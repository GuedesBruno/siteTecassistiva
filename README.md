# Tecassistiva - Catálogo de Produtos

Site da Tecassistiva: catálogo de produtos de tecnologia assistiva. Next.js 14 (App Router) com **exportação estática** (`output: 'export'`, `trailingSlash: true`), alimentado em tempo de build por um Strapi (Headless CMS) hospedado à parte. O resultado (`out/`) é HTML/CSS/JS puro, publicado em hospedagem sem Node.js (Locaweb).

## Arquitetura

- **Frontend (este repositório)**: Next.js, React 18, Tailwind. Todas as páginas, inclusive `/produtos/[slug]`, `/produtos/categorias/...`, `/produtos/fabricante/[slug]`, `/ambientes/...` e `/imersao/[slug]`, são geradas no build. Não há ISR nem servidor: para refletir uma mudança do CMS é preciso novo build e deploy.
- **Backend**: Strapi (produtos, categorias, fabricantes, ambientes, banners, vídeos, atas, softwares, imersões, mídias e PDFs).
- **Busca**: `scripts/build-search-data.js` gera `public/search-data.json` a partir do Strapi; a página `/busca` filtra esse arquivo no navegador.
- **Sitemap**: `scripts/generate-sitemap.mjs` gera `public/sitemap.xml`.
- **Cliente HTTP do Strapi**: `src/lib/strapi-client.mjs` é único e usado pelo site e pelos scripts de build. `src/lib/api.js` tem as consultas; `src/lib/imersao-data.mjs` tem as das páginas de imersão.

## Requisitos

- Node.js 20 ou superior (`engines` no `package.json`) e npm.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha (nunca commite valores reais).

| Variável | Para que serve |
| --- | --- |
| `NEXT_PUBLIC_STRAPI_URL` | URL base do Strapi, com `https://` e sem `/api` no final. |
| `STRAPI_API_TOKEN` | Token de API somente leitura do Strapi. Usado só no build; é segredo. |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Endpoint do formulário de contato (ex.: Formspree). Vai para o JavaScript público. |
| `CI` | Definida pelo GitHub Actions. Quando verdadeira (qualquer valor exceto vazio, `false` ou `0`), **qualquer falha de dados do Strapi interrompe o build**, inclusive nas páginas de imersão. Fora de CI, falhas viram dados vazios para o desenvolvimento seguir. |

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento em http://localhost:3000. |
| `npm run build` | Gera `search-data.json` e `sitemap.xml` e roda `next build` (exportação para `out/`). |
| `npm run build:search` | Só regenera `public/search-data.json`. |
| `npm run start` | `next start` (não usar em produção: o site é estático). |
| `npm run lint` | `eslint src`. Deve terminar com 0 erros. |

O `npm run build` sobrescreve `public/search-data.json` e `public/sitemap.xml`. Não commite esses arquivos gerados com dados de teste.

## Testes (qa/)

Verificações sem dependências, executadas com Node:

```bash
for f in qa/test-*.mjs; do node "$f"; done
```

Cobrem retry e falha em CI da API, cliente do Strapi, páginas de imersão em CI, `safeUrl`, validação de iframes, navegação por teclado das abas, sentinelas do `VideoModal`, canonical por rota, imports e o `deploy.yml`.

`qa/mock-strapi.mjs` é um Strapi falso (somente leitura, dados fictícios) para validar o build sem acesso ao CMS:

```bash
node qa/mock-strapi.mjs 14337 &
NEXT_PUBLIC_STRAPI_URL=http://localhost:14337 STRAPI_API_TOKEN=fake npm run build
```

Encerre o mock depois (apenas o processo dele) e restaure `public/search-data.json`, `public/sitemap.xml` e `out/` se o build os alterar.

## Deploy

Automático por GitHub Actions (`.github/workflows/deploy.yml`), disparado por push na `main`, manualmente (`workflow_dispatch`) ou por `repository_dispatch` do tipo `strapi_update` (publicação no Strapi). O fluxo: `npm ci`, verificação do secret do formulário, `npm run build` com os secrets `NEXT_PUBLIC_STRAPI_URL`, `STRAPI_API_TOKEN` e `NEXT_PUBLIC_FORM_ENDPOINT`, verificação de `out/` (mínimo de 20 páginas de produto) e envio por FTP com `lftp mirror -R` **sem `--delete`**: arquivos removidos do site continuam no servidor até serem apagados à mão. Falhas avisam o webhook do n8n (`N8N_WEBHOOK_URL`). Os PDFs de `public/guias` e `public/manuais` ficam só no servidor (ver `docs/ARQUIVOS-ESTATICOS.md`).

`deploy.ps1` é um script auxiliar local.

## Documentação (docs/)

- `docs/ARQUIVOS-ESTATICOS.md`: PDFs hospedados só no servidor.
- `docs/LINKS-PDFS-STRAPI.md`: links dos PDFs para cadastro no Strapi.
- `docs/PLANO-ATUALIZACAO.md`: plano de atualização de dependências (vulnerabilidades restantes exigem versões major).
- `docs/seo_palavras_chave_pendente.md`: campo `palavras_chave` pendente no Strapi.

## Estrutura

```
tecassistiva-site/
├── src/
│   ├── app/          # Rotas (App Router): produtos, categorias, fabricantes, ambientes, imersao, busca, suporte, atas-abertas...
│   ├── components/   # Componentes React
│   └── lib/          # api.js, strapi-client.mjs, imersao-data.mjs, media.js, safeUrl, hooks de foco
├── scripts/          # build-search-data.js, generate-sitemap.mjs
├── qa/               # testes e mock do Strapi
├── docs/             # documentação
├── public/           # estáticos (search-data.json e sitemap.xml são gerados no build)
└── .github/workflows/deploy.yml
```

## Acessibilidade e SEO

Cada rota define `canonical`; `/busca` é `noindex, follow`. Modais usam `useModalFocus` (foco inicial, trap do Tab, Esc, retorno do foco). Animações respeitam `prefers-reduced-motion`.
