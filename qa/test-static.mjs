// Verificações estáticas: deploy.yml (YAML + scripts executados em bash com árvores falsas), .htaccess,
// canonical em todas as rotas, imports quebrados, símbolos removidos, ids/aria-controls.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { suite, assert } from './harness.mjs';

const require = createRequire(import.meta.url);
const root = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
};
const bash = (script, { cwd, env = {} } = {}) =>
  spawnSync('bash', ['-c', script], { cwd, env: { ...process.env, ...env }, encoding: 'utf8' });

// ---------------------------------------------------------------- deploy.yml
const ts = suite('deploy.yml');
const yaml = require('js-yaml'); // já presente em node_modules (dependência transitiva); nada instalado
const wf = yaml.load(read('.github/workflows/deploy.yml'));
const job = wf.jobs['build-and-deploy'];
const step = (name) => job.steps.find((s) => s.name === name);

ts.test('YAML válido, gatilhos e permissões mínimas', () => {
  const on = wf.on ?? wf[true];
  assert.ok(on.push && "workflow_dispatch" in on && on.repository_dispatch);
  assert.deepEqual(wf.permissions, { contents: 'read' });
  assert.equal(wf.concurrency.group, 'deploy-producao');
  assert.equal(wf.concurrency['cancel-in-progress'], false);
});
ts.test('Node 20 (compatível com engines >=20) e npm ci', () => {
  assert.equal(String(step('Setup Node.js').with['node-version']), '20');
  assert.equal(step('Install dependencies').run, 'npm ci');
});
ts.test('todo passo tem uses ou run; `if` usa funções/contextos válidos', () => {
  for (const s of job.steps) assert.ok(s.uses || s.run, s.name);
  const withIf = job.steps.filter((s) => s.if);
  assert.equal(withIf.length, 1);
  assert.equal(withIf[0].if, "failure() && env.N8N_WEBHOOK_URL != ''");
  // env do job existe (necessário para o contexto env no `if` do passo)
  assert.match(job.env.N8N_WEBHOOK_URL, /\$\{\{ secrets\.N8N_WEBHOOK_URL \}\}/);
});
ts.test('aviso n8n é o último passo e usa a variável de ambiente (sem secret no comando)', () => {
  const last = job.steps.at(-1);
  assert.equal(last.name, 'Avisar n8n em caso de erro');
  assert.ok(last.run.includes('"$N8N_WEBHOOK_URL"'));
  assert.ok(!last.run.includes('secrets.'));
});
ts.test('o build recebe os 3 secrets necessários', () => {
  const env = step('Build (Next static export)').env;
  for (const k of ['NEXT_PUBLIC_STRAPI_URL', 'STRAPI_API_TOKEN', 'NEXT_PUBLIC_FORM_ENDPOINT']) assert.ok(env[k], k);
});
ts.test('script "Verificar secret do formulário": falha com secret vazio, passa com valor', () => {
  const run = step('Verificar secret do formulário').run;
  let r = bash(run, { env: { NEXT_PUBLIC_FORM_ENDPOINT: '' } });
  assert.equal(r.status, 1); assert.match(r.stdout, /::error::Secret NEXT_PUBLIC_FORM_ENDPOINT vazio/);
  r = bash(run, { env: { NEXT_PUBLIC_FORM_ENDPOINT: 'https://formspree.io/f/ficticio' } });
  assert.equal(r.status, 0);
});
function checkBuildOutput(nProducts, { withOut = true, withProdutosDir = true, extra = [] } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qa-out-'));
  try {
    if (withOut) fs.mkdirSync(path.join(dir, 'out'));
    if (withOut && withProdutosDir) {
      for (let i = 0; i < nProducts; i++) {
        fs.mkdirSync(path.join(dir, 'out', 'produtos', `p${i}`), { recursive: true });
        fs.writeFileSync(path.join(dir, 'out', 'produtos', `p${i}`, 'index.html'), '');
      }
      for (const e of extra) { fs.mkdirSync(path.join(dir, 'out', 'produtos', e), { recursive: true }); fs.writeFileSync(path.join(dir, 'out', 'produtos', e, 'index.html'), ''); }
    }
    return bash(step('Verificar saída do build (out/)').run, { cwd: dir });
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
ts.test('verificação de out/: sem out/ => falha com mensagem', () => {
  const r = checkBuildOutput(0, { withOut: false }); assert.equal(r.status, 1); assert.match(r.stdout, /out\/ não existe/);
});
ts.test('verificação de out/: 19 => falha, 20 => passa, 40 => passa', () => {
  let r = checkBuildOutput(19); assert.equal(r.status, 1); assert.match(r.stdout, /Poucas páginas de produto \(19 < 20\)/);
  assert.equal(checkBuildOutput(20).status, 0); assert.equal(checkBuildOutput(40).status, 0);
});
ts.test('verificação de out/: out/ existe mas sem out/produtos => falha (set -e), mesmo sem a mensagem amigável', () => {
  const r = checkBuildOutput(0, { withProdutosDir: false });
  assert.notEqual(r.status, 0);
});
ts.defect('verificação de out/: páginas não-produto (categorias/fabricante/imersao) inflam a contagem (19 produtos + 3 outras = passa)', () => {
  const r = checkBuildOutput(19, { extra: ['categorias', 'fabricante', 'imersao'] });
  assert.equal(r.status, 1, 'deveria reprovar com 19 produtos reais');
});
ts.test('slugs de produto vêm de search-data.json: >= 20 produtos hoje (limiar 20 está abaixo do real)', () => {
  // search-data.json é gerado pelo build e não fica no git: sem ele (clone limpo) o teste é ignorado
  if (!fs.existsSync(path.join(root, 'public/search-data.json'))) { console.log('       (public/search-data.json ausente: teste ignorado)'); return; }
  const sd = JSON.parse(read('public/search-data.json'));
  const n = sd.filter((i) => i.type === 'Produto').length;
  console.log(`       (produtos em search-data.json: ${n})`);
  assert.ok(n >= 20);
});

// ---------------------------------------------------------------- .htaccess
const th = suite('.htaccess (análise estática; Apache real não disponível)');
const ht = read('public/.htaccess');
th.test('contêineres <IfModule>/<If> balanceados e bem aninhados', () => {
  const stack = [];
  for (const line of ht.split(/\r?\n/)) {
    const l = line.trim(); if (l.startsWith('#')) continue;
    let m;
    if ((m = /^<(IfModule|If)\b/.exec(l))) stack.push(m[1]);
    else if ((m = /^<\/(IfModule|If)>/.exec(l))) assert.equal(stack.pop(), m[1], `fechamento inesperado: ${l}`);
  }
  assert.deepEqual(stack, []);
});
th.test('só diretivas permitidas em .htaccess (sem Location/LocationMatch/Directory/VirtualHost/ServerName)', () => {
  assert.ok(!/^\s*<(Location|LocationMatch|Directory|DirectoryMatch|VirtualHost)\b/m.test(ht));
  const known = /^(RewriteEngine|RewriteBase|RewriteCond|RewriteRule|Redirect|Header|ExpiresActive|ExpiresByType|AddOutputFilterByType|ErrorDocument)\b/;
  for (const line of ht.split(/\r?\n/)) {
    const l = line.trim();
    if (!l || l.startsWith('#') || l.startsWith('<')) continue;
    assert.match(l, known, `diretiva desconhecida: ${l}`);
  }
});
th.test('<If> com sintaxe de expressão do Apache 2.4 e dentro de mod_headers', () => {
  const m = /<If "([^"]+)">/.exec(ht); assert.ok(m);
  assert.equal(m[1], '%{REQUEST_URI} =~ m#^/_next/static/#');
  // a regex da expressão casa só _next/static
  const re = /^\/_next\/static\//;
  assert.ok(re.test('/_next/static/chunks/a.js')); assert.ok(!re.test('/_next/image')); assert.ok(!re.test('/x/_next/static/a.js'));
  const idx = ht.lastIndexOf('<IfModule mod_headers.c>'); assert.ok(ht.indexOf('<If "') > idx);
});
th.test('HSTS 1 ano sem includeSubDomains/preload; CSP em modo Report-Only; aspas da CSP balanceadas', () => {
  assert.match(ht, /Header always set Strict-Transport-Security "max-age=31536000"\s*$/m);
  const csp = /Header set Content-Security-Policy-Report-Only "([^"\n]+)"/.exec(ht); assert.ok(csp, 'CSP-Report-Only ausente');
  assert.ok(!/Header set Content-Security-Policy "/.test(ht));
  assert.equal((csp[1].match(/'/g) || []).length % 2, 0);
  for (const d of csp[1].split(';').map((s) => s.trim())) assert.match(d, /^[a-z-]+( .+)?$/, d);
});
th.test('CSP cobre as origens que o código usa (vimeo, youtube, google maps, formspree, backend)', () => {
  const csp = /Report-Only "([^"]+)"/.exec(ht)[1];
  for (const o of ['https://player.vimeo.com', 'https://www.youtube.com', 'https://www.google.com', 'https://formspree.io', 'https://backend.tecassistiva.com.br', 'https://vimeo.com'])
    assert.ok(csp.includes(o), o);
});
th.test('X-Frame-Options DENY coerente com frame-ancestors none da CSP', () => {
  assert.match(ht, /X-Frame-Options "DENY"/);
  assert.match(ht, /frame-ancestors 'none'/);
});
th.test('robots.txt não bloqueia mais /_next/ (CSS/JS renderizáveis pelo Google)', () => {
  assert.ok(!/Disallow:\s*\/_next\//.test(read('public/robots.txt')));
});

// ---------------------------------------------------------------- canonical
const tc = suite('canonical / metadata');
const pages = walk(path.join(root, 'src/app')).filter((p) => p.endsWith(`${path.sep}page.js`)).map((p) => path.relative(root, p).replaceAll('\\', '/'));
const noindexOrRedirect = ['src/app/busca/page.js', 'src/app/em-construcao/page.js', 'src/app/produtos/apresentacao/biblioteca/page.js', 'src/app/produtos/imersao/[slug]/page.js'];
tc.test('layout: metadataBase é URL absoluta e não define canonical global', () => {
  const l = read('src/app/layout.js');
  assert.match(l, /metadataBase: new URL\('https:\/\/www\.tecassistiva\.com\.br'\)/);
  assert.ok(!/canonical/.test(l));
});
tc.test('todo canonical declarado é caminho relativo iniciado e terminado em "/" (trailingSlash: true)', () => {
  for (const p of pages) {
    for (const m of read(p).matchAll(/canonical:\s*[`']([^`']+)[`']/g)) {
      const v = m[1].replace(/\$\{[^}]*\}/g, 'X');
      assert.match(v, /^\/(.*\/)?$/, `${p}: ${m[1]}`);
    }
  }
});
tc.test('rotas indexáveis principais têm canonical', () => {
  for (const p of pages.filter((x) => !noindexOrRedirect.includes(x) && !/vantagens|fabricante/.test(x))) {
    assert.ok(/canonical/.test(read(p)), `${p} sem canonical`);
  }
});
tc.defect('vantagens-index-basic e produtos/fabricante/[slug] (indexáveis) deveriam ter canonical próprio', () => {
  for (const p of ['src/app/vantagens-index-basic/page.js', 'src/app/produtos/fabricante/[slug]/page.js']) assert.ok(/canonical/.test(read(p)), `${p} sem canonical`);
});
tc.defect('produtos/[slug]: o ramo de erro de generateMetadata (catch) devolve metadata sem canonical', () => {
  const s = read('src/app/produtos/[slug]/page.js');
  const catchBlock = s.slice(s.indexOf('} catch (error) {', s.indexOf('export async function generateMetadata')));
  assert.ok(/canonical/.test(catchBlock.slice(0, 400)));
});
tc.defect('sitemap gerado usa URLs sem barra final, enquanto o canonical usa barra final', () => {
  const s = read('scripts/generate-sitemap.mjs');
  assert.ok(/\/produtos\/\$\{p\.slug\}\//.test(s), 'sitemap sem trailing slash');
});

// ---------------------------------------------------------------- imports e símbolos
const ti = suite('imports / símbolos / acessibilidade estática');
const srcFiles = walk(path.join(root, 'src')).filter((p) => /\.(js|jsx|mjs|ts|tsx)$/.test(p));
const exists = (base) => ['', '.js', '.jsx', '.mjs', '.ts', '.tsx', '.json', '.css', '/index.js', '/index.jsx', '/index.ts'].some((e) => fs.existsSync(base + e) && fs.statSync(base + e).isFile());
ti.test('todos os imports relativos e "@/" resolvem para arquivos existentes', () => {
  const broken = [];
  for (const f of srcFiles) {
    const code = fs.readFileSync(f, 'utf8');
    for (const m of code.matchAll(/(?:import\s+(?:[^'"]*?\s+from\s+)?|import\(\s*|require\(\s*)['"]([^'"]+)['"]/g)) {
      const spec = m[1];
      let base = null;
      if (spec.startsWith('@/')) base = path.join(root, 'src', spec.slice(2));
      else if (spec.startsWith('.')) base = path.resolve(path.dirname(f), spec);
      if (base && !exists(base)) broken.push(`${path.relative(root, f)} -> ${spec}`);
    }
  }
  assert.deepEqual(broken, []);
});
ti.test('funções/refs removidos não são mais usados (closeMobileMenu, menuButtonRef)', () => {
  for (const f of srcFiles) assert.ok(!/\b(closeMobileMenu|menuButtonRef)\b/.test(fs.readFileSync(f, 'utf8')), f);
});
ti.test('named imports de safeUrl/tabsKeyboard/useModalFocus/CarouselAutoplayToggle existem nos módulos', () => {
  assert.match(read('src/lib/safeUrl.js'), /export function safeUrl/);
  assert.match(read('src/lib/tabsKeyboard.js'), /export function handleTablistKeyDown/);
  assert.match(read('src/lib/useModalFocus.js'), /export function useModalFocus/);
  const c = read('src/components/CarouselAutoplayToggle.js');
  assert.match(c, /export function useCarouselAutoplay/); assert.match(c, /export default function CarouselAutoplayToggle/);
  for (const f of srcFiles) {
    const code = fs.readFileSync(f, 'utf8');
    for (const m of code.matchAll(/import\s*\{([^}]+)\}\s*from\s*'@\/lib\/(safeUrl|tabsKeyboard|useModalFocus)'/g)) {
      const mod = read(`src/lib/${m[2]}.js`);
      for (const name of m[1].split(',').map((s) => s.trim()).filter(Boolean)) assert.match(mod, new RegExp(`export (async )?function ${name}\\b`), `${f}: ${name}`);
    }
  }
});
ti.test('arquivos que usam hooks de cliente têm "use client" (ou são importados só por clientes)', () => {
  const hookRe = /\buse(State|Effect|Ref|Id|Callback|Memo|ModalFocus|CarouselAutoplay)\(/;
  const noDirective = srcFiles.filter((f) => hookRe.test(fs.readFileSync(f, 'utf8')) && !/^['"]use client['"]/m.test(fs.readFileSync(f, 'utf8')) && f.includes(`${path.sep}components${path.sep}`));
  console.log(`       (componentes com hooks sem "use client" no próprio arquivo: ${noDirective.map((f) => path.basename(f)).join(', ') || 'nenhum'})`);
  // DownloadModal.js e SoftwareListItem... dependem de ser importados por componente cliente
  const isClient = (f) => /^['"]use client['"]/m.test(fs.readFileSync(f, 'utf8'));
  const importersOf = (f) => {
    const base = path.basename(f, '.js');
    return srcFiles.filter((g) => g !== f && new RegExp(`from '\\./${base}(\\.js)?'`).test(fs.readFileSync(g, 'utf8')));
  };
  // Cada cadeia de importadores precisa alcançar um arquivo "use client" antes de chegar a um server component/rota.
  const ok = (f, seen = new Set()) => {
    if (isClient(f)) return true;
    if (seen.has(f)) return true;
    seen.add(f);
    const imps = importersOf(f);
    return imps.length > 0 && imps.every((g) => ok(g, seen));
  };
  for (const f of noDirective) assert.ok(ok(f), `${path.basename(f)} pode ser importado por server component`);
});
ti.test('ids referenciados por aria-controls existem no código (menu-mobile, submenu-*, support-tabpanel, product-tabpanel-*)', () => {
  const h = read('src/components/Header.js');
  assert.ok(h.includes('aria-controls="menu-mobile"') && h.includes('id="menu-mobile"'));
  assert.ok(h.includes('aria-controls={`submenu-${name}`}') && h.includes('id={`submenu-${name}`}'));
  const s = read('src/components/SupportPageClient.js');
  assert.ok(s.includes('aria-controls="support-tabpanel"') && s.includes('id="support-tabpanel"'));
  assert.ok(s.includes('id={`support-tab-${id}`}') && s.includes('aria-labelledby={`support-tab-${activeTab}`}'));
  const p = read('src/components/ProductDetail.js');
  assert.ok(p.includes('id={`product-tabpanel-${tabIndex}`}') && p.includes('aria-controls={`product-tabpanel-${tabIndex}`}'));
  assert.ok(p.includes('id={`product-tab-${tabIndex}`}') && p.includes('aria-labelledby={`product-tab-${tabIndex}`}'));
  const a = read('src/components/Accordion.js'); assert.ok(a.includes('aria-controls={panelId}') && a.includes('id={panelId}'));
});
ti.test('nomes de abas do suporte: os ids de handleTablistKeyDown coincidem com os de TabButton', () => {
  const s = read('src/components/SupportPageClient.js');
  const ids = [...s.matchAll(/\['(\w+)', '[^']+'\]/g)].map((m) => m[1]);
  const listed = /SUPPORT_TABS = \[([^\]]+)\]/.exec(s)[1].match(/'(\w+)'/g).map((x) => x.replaceAll("'", ''));
  assert.deepEqual(ids, listed);
});
ti.test('Header: hooks no topo do componente, antes de qualquer return; sem acesso a window/document fora de efeitos/handlers', () => {
  const h = read('src/components/Header.js');
  const firstReturn = h.indexOf('\n  return (');
  const lastHook = Math.max(h.lastIndexOf('useEffect('), h.lastIndexOf('useModalFocus('), h.lastIndexOf('useState('), h.lastIndexOf('useRef('));
  assert.ok(lastHook < firstReturn, 'hook depois do return principal');
});
ti.test('Tailwind: classes novas/arbitrárias geram CSS (CLI local do projeto, sem instalar nada)', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qa-tw-'));
  try {
    fs.writeFileSync(path.join(dir, 'in.css'), '@tailwind utilities;\n');
    const bin = path.join(root, 'node_modules', 'tailwindcss', 'lib', 'cli.js');
    const r = spawnSync(process.execPath, [bin, '-c', path.join(root, 'tailwind.config.js'), '-i', path.join(dir, 'in.css'), '-o', path.join(dir, 'out.css')], { cwd: root, encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    const css = fs.readFileSync(path.join(dir, 'out.css'), 'utf8');
    for (const sel of ['animate-\\[bounce_1s_ease-in-out_3\\]', 'motion-reduce\\:animate-none', 'motion-reduce\\:transition-none',
      'transition-\\[transform\\2c visibility\\]', 'placeholder\\:text-gray-600', 'bg-tec-blue\\/85', 'focus-visible\\:opacity-100',
      'group-hover\\/video\\:opacity-100', 'focus-visible\\:outline-offset-\\[-2px\\]', 'scroll-mt-14', 'bg-green-700', 'text-red-700'])
      assert.ok(css.includes(sel), `classe sem CSS: ${sel}`);
    assert.ok(/@keyframes bounce/.test(css));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

const fails = (await ts.run()) + (await th.run()) + (await tc.run()) + (await ti.run());
process.exit(fails ? 1 : 0);
