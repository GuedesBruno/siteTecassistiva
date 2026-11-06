# Plano de atualização de dependências

## Estado em 06/11/2026 (branch `chore/atualizacao-majors`, nada publicado)

Com autorização do responsável, as majors abaixo foram aplicadas **na ordem Swiper, Next 15 + React 19, ESLint 9, Next 16, Tailwind 4**, um commit por etapa. Cada etapa passou por `npm run lint` (0 erros), `node qa/test-*.mjs` e `npm run build` com o mock (`qa/mock-strapi.mjs`, CI=true), comparando a lista de arquivos de `out/` com a anterior.

| Pacote | Antes | Depois |
|---|---|---|
| swiper | 11.2.10 | 12.2.0 |
| next | 14.2.35 | 16.4.5 (passando por 15.5.29) |
| react / react-dom | 18.3.1 | 19.3.1 |
| eslint | 8.57.1 | 9.39.5 |
| eslint-config-next | 14.2.35 | 16.4.5 |
| tailwindcss | 3.4.19 | 4.3.4 (+ `@tailwindcss/postcss`; `autoprefixer` removido) |
| @types/react | 18 | 19 |

`npm audit`: **13 vulnerabilidades (2 críticas, 4 altas, 7 moderadas) -> 9 moderadas, nenhuma alta ou crítica.** Restam: `glob` 10.x (aviso de AbortSignal na API; é dependência direta, usada só em `scripts/build-search-data.js`; a correção exige glob >= 14) e `minimatch` dentro de `typescript-eslint` (ferramenta de lint, não vai para o site).

### O que foi feito em cada etapa

1. **Swiper 12.2.0**: sem mudança de código. Caminhos `swiper/css`, `swiper/css/navigation`, `swiper/css/pagination` e módulos (`Navigation`, `Pagination`, `Autoplay`, `Keyboard`, `A11y`) continuam existindo. Rotas de `out/` idênticas.
2. **Next 15.5.29 + React 19**: `params` assíncronos (`await props.params`) em `generateMetadata` e nas páginas dinâmicas de ambientes, imersao, produtos, categorias (incl. subcategoria) e fabricante. O Next acrescentou `target: ES2017` ao `tsconfig.json`. `react-icons`, `swiper/react` e `@strapi/blocks-react-renderer` funcionaram com React 19.
3. **ESLint 9**: feito **depois** do Next 15 (mudança de ordem): `eslint-config-next` 14 só aceita ESLint 7/8 e quebra com 9 (plugin `react-hooks` não é encontrado). Com `eslint-config-next` 15 funcionou com o flat config existente.
4. **Next 16.4.5**: `eslint.config.mjs` passou a importar `eslint-config-next/core-web-vitals` (flat nativo, sem `FlatCompat`). O `eslint-plugin-react-hooks` 7 trouxe regras novas (`set-state-in-effect`, `refs`, `static-components`) que acusam 7 pontos do código atual (BannerSlider, CarouselAutoplayToggle, ComparisonButton, ProductDetail, SupportPageClient, AtaCard, useModalFocus). Elas ficaram como **aviso** para não mexer no comportamento nesta atualização; tratar depois, uma a uma. O build agora usa Turbopack. O `tsconfig.json` foi ajustado pelo Next (`jsx: react-jsx`, `moduleResolution: bundler`).
5. **Tailwind 4.3.4**: configuração em CSS (`src/app/globals.css`): `@import "tailwindcss" source(none)` + `@source` de `src/components` e `src/app` (mesmos globs do antigo `content`), `@theme` com `--color-tec-*` e `--breakpoint-shell: 80rem`, `@utility max-w-shell` (usa `--shell-max`). `tailwind.config.js` e `autoprefixer` removidos; `postcss.config.cjs` usa `@tailwindcss/postcss`. Compatibilidade com o Tailwind 3 em `@layer base`: cor de borda padrão gray-200, `cursor: pointer` em botões, cor do placeholder. O foco global (`*:focus-visible`) foi para `@layer base`, senão as regras sem camada passariam a vencer `focus:ring-*`. Classes renomeadas à mão (`shadow-sm` -> `shadow-xs`, `rounded-sm` -> `rounded-xs`, `rounded` -> `rounded-sm`, `flex-grow` -> `grow`, `flex-shrink-0` -> `shrink-0`, `bg-opacity-N` -> `/N`, `bg-gradient-to-*` -> `bg-linear-to-*/srgb` para manter a interpolação em sRGB) e as regras de `border-radius` do `globals.css` ajustadas aos nomes novos. O CSS gerado antes/depois foi comparado por utilitário: mesmas classes e propriedades (só mudam para propriedades lógicas e `translate`/`scale`/`rotate` separados). `qa/test-static.mjs` agora compila pelo PostCSS (a CLI do Tailwind 3 não existe mais).

### Pendências desta atualização

- **Codemod `@tailwindcss/upgrade` não rodou** nesta máquina (o módulo nativo `tree-sitter` não compila e dá segfault). A migração das classes foi feita a mão e conferida comparando o CSS gerado, mas convém rodar o codemod em outra máquina e ver que ele não encontra mais nada.
- **Navegadores**: Next 16 (Turbopack) e Tailwind 4 pressupõem navegadores recentes (Chrome/Edge 111+, Safari 16.4+, Firefox 128+ para o Tailwind). O site já usava `:has()` em `globals.css`. **Não houve confirmação do público**: se escolas ou instituições ainda usam Windows 7/8 (Chrome 109) ou Safari antigo, o visual quebra. Confirmar antes do merge.
- **Teste visual manual** (sem navegador nesta execução): ver a lista no relatório da entrega. Em especial hover (agora só em dispositivos com hover), gradientes, sombras, `space-*`, foco por teclado e carrosséis.
- Next 16 passa a gerar `_not-found/` e arquivos `__next.*.txt` (payload de prefetch, com `$` no nome em rotas dinâmicas) em `out/`. As páginas HTML são as mesmas. Conferir que o `lftp mirror` do deploy envia esses nomes e que a Locaweb os serve.
- Regras novas do `react-hooks` 7 como aviso (item 4 acima) e `tailwind.config.js` removido: quem tiver extensão de editor apontando para ele precisa atualizar.
- Observado, não alterado: `font-sans` no `<html>` usa a pilha padrão do Tailwind; a variável `--font-montserrat` é criada em `layout.js` mas nenhum token a usa. Também não existe a animação `animate-fade-in-up`/`animate-fade-in` (já era assim no Tailwind 3).

## Não feito / fica para depois

- TypeScript 5.9 -> 7, `@types/node` e `dotenv` 16 -> 18 (etapa 4 do plano original, risco baixo; `dotenv` 17+ imprime logs, usar `{ quiet: true }`).
- Swiper 12 -> 14 (a 12 já corrige o crítico).
- `glob` 10 -> 14 (aviso moderado restante).

## Plano original (referência)

O texto abaixo é o plano anterior à execução, mantido por histórico; os pontos de atenção já foram tratados como descrito acima.

Situação em 15/10/2026, depois de aplicar apenas atualizações dentro do semver atual (`npm update`, `npm audit fix` sem `--force`, `next` e `eslint-config-next` 14.2.32 -> 14.2.35).

`npm audit`: 29 vulnerabilidades (2 críticas, 22 altas, 5 moderadas) -> 13 (2 críticas, 9 altas, 2 moderadas). As restantes só se resolvem com versões major, listadas abaixo.

Contexto que reduz o risco real: o site é **exportação estática** (`output: 'export'`) servida pela Locaweb. Não há servidor Node em produção, então os avisos do Next.js sobre Server Components, Image Optimizer, rewrites, middleware e cache de runtime **não são explorados em produção**. Eles ainda importam para o `next dev` e para o ambiente de build (CI), que só processa conteúdo do nosso Strapi.

## Ordem sugerida

Uma major por vez, em branch própria, com `npm run build` (com Strapi real ou o mock de `qa/mock-strapi.mjs`) e `node qa/test-*.mjs` verdes em cada passo.

### 1. Swiper 11 -> 12 (primeiro: único crítico que afeta código do cliente)

- Vulnerabilidade: prototype pollution (GHSA-hmx5-qpq5-p643), afeta 6.5.1 até 12.1.1.
- **Menor major corrigida: 12** (corrigido em 12.1.2; a 12.1.3 é a última da série 12). Não é preciso ir para a 14.3.0 que o `npm audit fix --force` sugere.
- Módulos que usamos, todos continuam existindo em `swiper/modules`: `Navigation`, `Pagination`, `Autoplay`, `Keyboard`, `A11y` (BannerSlider, FeaturedProductsSlider, ProductDetail, TestimonialSection, VideoSection).
- Impacto a verificar:
  - Ler o changelog 12.0 (mudanças em CSS/variáveis e remoção de APIs antigas); conferir as importações de CSS `swiper/css`, `swiper/css/navigation`, `swiper/css/pagination` (os caminhos precisam continuar existindo).
  - **A11y**: rótulos (`prevSlideMessage`, `nextSlideMessage`, `paginationBulletMessage`) e `role`/`aria-live` do contêiner. Reexecutar a revisão da `dorina` e `qa/test-tabs-keyboard.mjs`.
  - **Autoplay**: `pauseOnMouseEnter`, `disableOnInteraction` e o botão de pausa (`CarouselAutoplayToggle.js`, que usa `swiper.autoplay.start()/stop()`). WCAG 2.2.2 exige poder pausar.
  - **Navigation**: botões e teclado (`Keyboard` no BannerSlider).
  - Passar de 12 para 14 (se quiser ficar na última) fica para depois, como passo separado.
- Risco: médio (visual e acessibilidade dos carrosséis). Conferir home, página de produto, suporte e imersão em mobile e desktop.

### 2. Tailwind 3.4 -> 4

- Resolve `postcss-selector-parser`, `micromatch`/`braces`/`chokidar` (ferramentas de build, risco baixo em produção).
- Mudanças grandes: configuração passa a ser em CSS (`@import "tailwindcss"`), plugin do PostCSS separado (`@tailwindcss/postcss`), remoção do `autoprefixer` e do `tailwind.config.js` como padrão, classes renomeadas/removidas, navegadores-alvo mais novos (Safari 16.4+, Chrome 111+, Firefox 128+) -- **confirme com o time se o público (escolas, instituições federais) usa navegadores antigos**.
- Há um teste em `qa/test-tabs-keyboard.mjs` que usa a CLI local do Tailwind; ele precisará ser ajustado.
- Risco: alto (todo o visual). Fazer comparação visual página a página.

### 3. Next 14 -> 15 -> 16, React 18 -> 19, ESLint 8 -> 9/10, eslint-config-next 16

- Resolve os avisos críticos do Next (`next`, `postcss` embutido) e `glob` do `@next/eslint-plugin-next`.
- Fazer em duas etapas: Next 15 + React 19 (codemod `npx @next/codemod@latest`), depois Next 16.
- Pontos de atenção neste projeto:
  - `params` e `searchParams` passam a ser assíncronos nas páginas dinâmicas (`produtos/[slug]`, `imersao/[slug]`, `produtos/categorias/[slug]`, `fabricante/[slug]`) e em `generateMetadata`.
  - `generateStaticParams` lê `public/search-data.json` com `fs`; continuar válido, mas testar.
  - React 19: `@strapi/blocks-react-renderer` 1.0.2 já aceita React 18 e 19 (peer `^18 || ^19`). Conferir `react-icons` e `swiper/react` (versão compatível com 19) antes de subir.
  - `next lint` foi removido no Next 16: já usamos `eslint src` (ver `package.json`), o que facilita a migração. ESLint 9+ exige o formato flat (já temos `eslint.config.mjs`).
  - `trailingSlash: true` e `output: 'export'` continuam; reconferir canonicals e `out/` com o mock.
  - O workflow usa Node 20; Next 16 exige Node >= 20.9 (ok), conferir.
- Risco: alto; build estático precisa ser comparado (lista de rotas em `out/` antes e depois).

### 4. TypeScript 5.9 -> 7, `@types/*`, `dotenv` 16 -> 18

- TypeScript quase não é usado (código em JS); só `tsconfig.json`/`next-env.d.ts`. Baixo risco, fazer junto com o Next 16.
- `@types/node` seguir o Node do CI (20): manter na série 20.
- `dotenv` 17+/18 passou a imprimir mensagens de log por padrão; usado só em `scripts/` (build). Usar `{ quiet: true }` ao migrar.

## Itens que ficaram de fora e por quê

| Pacote | Motivo |
|---|---|
| next / eslint-config-next 14.2.x | 14.2.35 é a última 14.2; os avisos restantes só somem na 15/16 |
| glob 10.x | o aviso é da CLI do glob (comando `-c`); usamos só a API em `scripts/build-search-data.js`, sem a CLI. `glob@10.5.0` já instalado pelo `npm update` |
| dotenv | fica em devDependencies: só scripts de build/depuração usam, e o CI roda `npm ci` completo |
