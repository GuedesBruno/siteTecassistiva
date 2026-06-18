# Tecassistiva - Catálogo de Produtos

Este é o repositório do novo site da Tecassistiva, uma plataforma moderna para exibir um catálogo detalhado de produtos de tecnologia assistiva. O projeto foi construído utilizando uma arquitetura Jamstack, com Next.js para o frontend e Strapi como um Headless CMS para o backend.

## 🚀 Arquitetura

A solução é dividida em duas partes principais:

1.  **Frontend (Este repositório)**: Uma aplicação Next.js que utiliza o **App Router**. O site é gerado estaticamente (SSG - Static Site Generation) para máxima performance, segurança e otimização para SEO. As páginas dos produtos são dinâmicas, criadas em tempo de build a partir dos dados consumidos da API do Strapi.
2.  **Backend (Headless CMS)**: Um painel Strapi (hospedado separadamente) que serve como fonte de dados para todo o conteúdo do site, incluindo:
    *   Informações de produtos (descrições, especificações técnicas, etc.).
    *   Categorias e subcategorias.
    *   Fabricantes.
    *   Mídias como imagens, vídeos e documentos (PDFs de manuais e guias).

## ✨ Funcionalidades Principais

*   **Geração Estática (SSG)**: Páginas rápidas e otimizadas para motores de busca.
*   **Páginas de Produto Dinâmicas**: Rotas como `/produtos/[slug]` são geradas para cada item cadastrado no CMS.
*   **SEO Otimizado**: Metadados (título, descrição, palavras-chave) e URLs canônicas são gerados dinamicamente para cada página de produto, melhorando a relevância nos resultados de busca.
*   **Gerenciamento de Conteúdo Centralizado**: Toda a informação é gerenciada via Strapi, permitindo que a equipe de conteúdo atualize o site sem a necessidade de deploy.
*   **Conteúdo Rico**: Suporte para descrições longas, listas, vídeos embarcados (YouTube/Vimeo) e múltiplos documentos para download.

## 🛠️ Tecnologias e Bibliotecas

*   **Framework**: Next.js
*   **React**: React
*   **Gerenciamento de Ambiente**: dotenv para carregar variáveis de ambiente de um arquivo `.env`.
*   **Debugging**: debug para logs detalhados e namespaces durante o desenvolvimento.
*   **Fonte**: O projeto utiliza `next/font` para otimizar e carregar a família de fontes Geist.

## 📂 Estrutura do Projeto

```
tecassistiva-site/
├── src/
│   ├── app/
│   │   ├── produtos/
│   │   │   └── [slug]/
│   │   │       └── page.js      # Template da página de produto
│   │   ├── layout.js            # Layout principal
│   │   └── page.js              # Página inicial
│   └── lib/
│       └── api.js               # Funções para buscar dados da API do Strapi
├── public/
│   ├── guias/                   # PDFs dos guias de produtos
│   └── manuais/                 # PDFs dos manuais de produtos
├── .env.example                 # Arquivo de exemplo para variáveis de ambiente
└── next.config.js               # Configurações do Next.js
```

## ⚙️ Começando

Siga os passos abaixo para configurar o ambiente de desenvolvimento local.

### 1. Pré-requisitos

*   Node.js (versão 18 ou superior)
*   npm, yarn, pnpm ou bun

### 2. Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd tecassistiva-site
```

### 3. Instalar Dependências

Execute o comando correspondente ao seu gerenciador de pacotes:

```bash
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

### 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto, copiando o conteúdo de `.env.example`. Preencha as variáveis com os valores corretos para o seu ambiente (URL da API do Strapi, token, etc.).

```bash
# .env
STRAPI_API_URL="https://innovative-friendship-159ff40007.strapiapp.com"
STRAPI_API_TOKEN="seu_token_de_api"
```

### 5. Rodar o Servidor de Desenvolvimento

```bash
npm run dev
```

Abra http://localhost:3000 no seu navegador para ver o resultado. A página será atualizada automaticamente conforme você edita os arquivos.

## 📦 Build e Deploy

### Build

Para gerar a versão estática do site para produção, execute:

```bash
npm run build
```

O Next.js irá gerar os arquivos estáticos na pasta `.next/`. Se configurado para exportação estática, os arquivos HTML/CSS/JS estarão na pasta `out/`.

### Deploy na Vercel

A maneira mais fácil de fazer o deploy de uma aplicação Next.js é através da Vercel Platform, dos criadores do Next.js.

Para mais detalhes, consulte a documentação de deploy do Next.js.
