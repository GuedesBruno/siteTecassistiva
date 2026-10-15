// Mock mínimo do Strapi para validar `npm run build` sem acesso ao CMS real. Sem dependências.
//
// Uso:
//   node qa/mock-strapi.mjs [porta]            (padrão 14337; também aceita MOCK_STRAPI_PORT)
//   NEXT_PUBLIC_STRAPI_URL=http://localhost:14337 STRAPI_API_TOKEN=fake npm run build
//
// Serve só leituras (GET) em /api/... com dados FICTÍCIOS no formato "plano" do Strapi 5
// (sem `attributes`). Exige `Authorization: Bearer <qualquer coisa>`; sem o header responde 401,
// como o Strapi real. Cobre as rotas usadas por src/lib/api.js, scripts/build-search-data.js,
// scripts/generate-sitemap.mjs e src/app/imersao/[slug]/page.js. Não imita filtros em geral:
// só os que o código do site usa (ver `rota` abaixo).
import http from 'node:http';

const PORT = Number(process.argv[2] || process.env.MOCK_STRAPI_PORT || 14337);
const QTD_PRODUTOS = 24; // o workflow de deploy exige >= 20 páginas de produto

const bloco = (texto) => [{ type: 'paragraph', children: [{ type: 'text', text: texto }] }];

const subcategorias = [];
const categorias = ['Leitores de Tela', 'Impressoras Braille', 'Lupas Eletrônicas'].map((nome, c) => {
  const slug = nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-');
  const subs = [1, 2].map((n) => {
    const sub = { id: c * 10 + n, nome: `${nome} - Linha ${n}`, slug: `${slug}-linha-${n}`, ordem: n };
    subcategorias.push(sub);
    return sub;
  });
  return { id: c + 1, nome, slug, ordem: c + 1, descricao: `Categoria fictícia ${nome}`, subcategorias: subs, produtos: [] };
});

const fabricantes = [
  { id: 1, nome: 'Fabricante Alfa', slug: 'fabricante-alfa', ordem: 1, logo: null },
  { id: 2, nome: 'Fabricante Beta', slug: 'fabricante-beta', ordem: 2, logo: null },
];

const produtos = Array.from({ length: QTD_PRODUTOS }, (_, i) => {
  const n = i + 1;
  const cat = categorias[i % categorias.length];
  const sub = cat.subcategorias[i % 2];
  const fab = fabricantes[i % 2];
  return {
    id: n,
    nome: `Produto Fictício ${n}`,
    slug: `produto-ficticio-${n}`,
    ordem: n,
    descricao_curta: `Descrição curta do produto fictício ${n}.`,
    descricao_longa: bloco(`Descrição longa do produto fictício ${n}.`),
    caracteristicas_funcionais: bloco('Característica funcional fictícia.'),
    caracteristicas_tecnicas: bloco('Característica técnica fictícia.'),
    visao_geral: bloco('Visão geral fictícia.'),
    videos: null,
    Fabricante: fab.nome,
    destaque: n <= 6,
    ocultar_do_catalogo: false,
    palavras_chave: ['ficticio', `produto-${n}`],
    imagem_principal: null,
    galeria_de_imagens: [],
    categorias: [{ id: cat.id, nome: cat.nome, slug: cat.slug, ordem: cat.ordem }],
    subcategorias: [{ id: sub.id, nome: sub.nome, slug: sub.slug, ordem: sub.ordem }],
    relacao_fabricante: fab,
    documentos: n % 4 === 0 ? [{ id: n * 100, name: `manual-${n}.pdf`, url: `/uploads/manual-${n}.pdf`, ext: '.pdf', size: 10 }] : [],
    especificacoes_por_categoria: [],
  };
});

// Preenche as relações inversas usadas por getCategoryBySlug (categoria -> produtos e subcategorias -> produtos).
for (const cat of categorias) {
  cat.produtos = produtos.filter((p) => p.categorias[0].slug === cat.slug);
  for (const sub of cat.subcategorias) sub.produtos = produtos.filter((p) => p.subcategorias[0].slug === sub.slug);
}

const imersoes = [1, 2].map((n) => ({
  id: n,
  slug: `imersao-ficticia-${n}`,
  genero_descricao: n === 1 ? 'masculino' : 'feminino',
  curso: 'https://exemplo.com.br/curso',
  guia: 'https://exemplo.com.br/guia.pdf',
  manual: null,
  botoes_padrao: true,
  personalizado: [],
  link_playstore: null,
  link_appstore: null,
  produto: produtos[n - 1],
}));

const ambientes = [
  {
    id: 1, slug: 'sala-de-aula-ficticia', nome: 'Sala de Aula Fictícia', descricao: 'Ambiente fictício.',
    imagem_grid: { url: '/uploads/ambiente-ficticio.png' }, imagem_banner: null, produtos: produtos.slice(0, 3).map((p) => ({ id: p.id, slug: p.slug })),
    sub_ambientes: [{ id: 11, slug: 'sub-ambiente-ficticio', nome: 'Sub-ambiente Fictício', descricao: null, imagem: { url: '/uploads/sub-ambiente-ficticio.png' }, produtos: produtos.slice(3, 5).map((p) => ({ id: p.id, slug: p.slug })) }],
  },
];

const banners = [1, 2].map((n) => ({
  id: n, titulo: `Banner fictício ${n}`, subtitulo: 'Subtítulo fictício', texto_comercial: null,
  texto_do_botao: 'Saiba mais', link_do_botao: '/produtos/', ordem: n, imagem: null,
}));
const videos = [{ id: 1, titulo: 'Vídeo fictício', link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail: null, ordem: 1 }];
const depoimentos = [{ id: 1, texto: 'Depoimento fictício.', autor: 'Pessoa Fictícia', descricao_autor: 'Escola Fictícia' }];
const atas = [{
  id: 1, orgao: 'Órgão Fictício', categoria: 'Educação', validade: '2099-12-31', descricao_adesao: bloco('Ata fictícia.'), ordem: 1,
  item_ata: [{ id: 1, numero_item: 1, descricao: 'Item fictício', categoria: 'Equipamento', quantidade_carona: 1, relacao_produto: produtos[0] }],
  documentos: { data: [] }, // AtaCard lê documentos?.data
}];
const softwares = [{
  id: 1, nome: 'Software Fictício', tipo: 'Software', ordem: 1, produto: produtos[0],
  instaladores: [{ id: 1, sistema: 'Windows', link_online: null, link_offline_1: null, link_offline_2: null }],
}];

// ---------------------------------------------------------------- roteamento
const eq = (q, chave) => q.get(`filters[${chave}][$eq]`);

function filtrarProdutos(q) {
  let lista = produtos;
  const slug = eq(q, 'slug');
  if (slug) lista = lista.filter((p) => p.slug === slug);
  if (eq(q, 'destaque') === 'true') lista = lista.filter((p) => p.destaque);
  const fab = eq(q, 'relacao_fabricante][slug');
  if (fab) lista = lista.filter((p) => p.relacao_fabricante.slug === fab);
  const catSlug = q.get('filters[$or][0][categorias][slug][$eq]');
  if (catSlug) lista = lista.filter((p) => p.categorias[0].slug === catSlug);
  const subSlug = eq(q, 'subcategorias][slug');
  if (subSlug) lista = lista.filter((p) => p.subcategorias[0].slug === subSlug);
  return lista;
}

function rota(nome, q) {
  switch (nome) {
    case 'produtos': return filtrarProdutos(q);
    case 'categorias': { const s = eq(q, 'slug'); return s ? categorias.filter((c) => c.slug === s) : categorias; }
    case 'fabricantes': { const s = eq(q, 'slug'); return s ? fabricantes.filter((f) => f.slug === s) : fabricantes; }
    case 'banner-sites': return banners;
    case 'video-homes': return videos;
    case 'depoimentos': return depoimentos;
    case 'atas': return atas;
    case 'softwares': return softwares;
    case 'ambientes': return ambientes;
    case 'imersaos': { const s = eq(q, 'slug'); return s ? imersoes.filter((i) => i.slug === s) : imersoes; }
    default: return null;
  }
}

const server = http.createServer((req, res) => {
  const enviar = (status, corpo) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(corpo));
  };
  const url = new URL(req.url, `http://localhost:${PORT}`);
  console.log(`${req.method} ${url.pathname}${url.search ? '?...' : ''}`);

  if (req.method !== 'GET') return enviar(405, { error: { status: 405, message: 'Mock somente leitura' } });
  if (!/^Bearer \S+/.test(req.headers.authorization || '')) return enviar(401, { error: { status: 401, message: 'Missing or invalid credentials' } });

  const m = url.pathname.match(/^\/api\/([a-z-]+)\/?$/);
  const dados = m ? rota(m[1], url.searchParams) : null;
  if (!dados) return enviar(404, { error: { status: 404, message: 'Not Found' } });

  // Paginação: pagination[page]/pagination[pageSize]; sem parâmetros devolve tudo.
  const pageSize = Number(url.searchParams.get('pagination[pageSize]')) || dados.length || 1;
  const page = Number(url.searchParams.get('pagination[page]')) || 1;
  const pageCount = Math.max(1, Math.ceil(dados.length / pageSize));
  const fatia = dados.slice((page - 1) * pageSize, page * pageSize);
  enviar(200, { data: fatia, meta: { pagination: { page, pageSize, pageCount, total: dados.length } } });
});

server.listen(PORT, '127.0.0.1', () => console.log(`Mock do Strapi ouvindo em http://localhost:${PORT} (PID ${process.pid})`));
