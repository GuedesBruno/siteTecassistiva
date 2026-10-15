# Plano de atualização de dependências

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
