# 🎯 Guia Completo de SEO e Metadados - Tecassistiva

## ✅ Implementações Concluídas

### 1. Schema.org JSON-LD Estruturado
- **Arquivo:** `src/lib/schemas.js`
- **Componente:** `src/components/Schema.js`
- **Benefícios:**
  - Melhor indexação do Google (Rich Snippets)
  - Aparição em buscas visuais (Google Images, Google Shopping)
  - Melhor compreensão semântica do conteúdo
  - Schema implementados:
    - **Product** - Para todas as páginas de produtos
    - **Organization** - Para informações da empresa
    - **LocalBusiness** - Para localização e contato
    - **BreadcrumbList** - Para navegação estruturada
    - **WebPage** - Para páginas genéricas
    - **Article** - Para publicações

### 2. Metadados Completos
- **Arquivo:** `src/app/layout.js`
- **Incluído:**
  - ✅ Title (com template para dinamismo)
  - ✅ Description (160 caracteres otimizado)
  - ✅ Keywords relevantes
  - ✅ Robots meta (index, follow)
  - ✅ Canonical URLs
  - ✅ Open Graph (og:title, og:description, og:image, og:url)
  - ✅ Twitter Card
  - ✅ Alternates (para futuras expansões de idioma)

### 3. Open Graph e Twitter Card
- Imagens otimizadas para redes sociais (1200x630px)
- Descrições e títulos personalizados
- Suporta compartilhamentos em Facebook, Instagram, LinkedIn, Twitter
- **Nota:** Adicione a imagem em `/public/og-image.png`

### 4. PWA (Progressive Web App)
- **Arquivo:** `public/manifest.json`
- **Funcionalidades:**
  - Instalação em home screen
  - Tema personalizado (cor azul Tecassistiva)
  - Atalhos rápidos (Produtos, Suporte, Contato)
  - Categorias de busca
  - Screenshots para demonstração

### 5. Robots.txt Otimizado
- **Arquivo:** `public/robots.txt`
- **Configurações:**
  - Disallow de APIs e pastas privadas
  - Crawl-delay para não sobrecarregar servidor
  - Configurações específicas para Googlebot, Bingbot, Yandex
  - Referência ao sitemap.xml

### 6. Cache-Control Headers
- **Arquivo:** `next.config.mjs`
- **Configurações:**
  - Assets imutáveis: cache 1 ano
  - HTML: cache 1 hora com revalidação
  - Sitemap/Robots: cache 7 dias
  - Imagens: cache 1 ano
  - Benefício: Melhor performance e SEO (Core Web Vitals)

### 7. Páginas de Produto com Schema
- **Arquivo:** `src/app/produtos/[slug]/page.js`
- **Melhorias:**
  - Schema.org Product JSON-LD
  - BreadcrumbList automático
  - Open Graph com imagem do produto
  - Keywords dinâmicas
  - Canonical URLs

---

## 🚀 Próximos Passos (URGENTE)

### 1. Gerar Imagem OG (1200x630px)
```
Crie: /public/og-image.png
Recomendação: Logo + texto "Tecassistiva - Tecnologia & Acessibilidade"
```

### 2. Criar Ícones PWA Adicionais
```
Existentes: /favicon.ico, /apple-icon.png
Criar:
  - /favicon-16x16.png
  - /favicon-32x32.png
  - /apple-icon-192x192.png (maskable)
```

### 3. Google Search Console
```
Passos:
1. Acesse: https://search.google.com/search-console
2. Adicione propriedade: https://www.tecassistiva.com.br
3. Valide por DNS ou arquivo HTML
4. Envie sitemap: https://www.tecassistiva.com.br/sitemap.xml
5. Monitore: Erros, Performance, Indexação
```

### 4. Bing Webmaster Tools
```
Passos:
1. Acesse: https://www.bing.com/webmasters
2. Adicione site
3. Envie sitemap (importa de Google Search Console)
```

### 5. Google Analytics 4
```
Passos:
1. Já configurado no layout.js
2. Verifique em: https://analytics.google.com
3. Configure eventos customizados:
   - view_product
   - search
   - contact (form submission)
```

### 6. Validar Metadados
```
Ferramentas gratuitas:
- Schema.org Validator: https://validator.schema.org/
- Open Graph Debugger: https://www.facebook.com/sharing/debugger/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- Google Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
```

---

## 📊 Checklist de SEO On-Page

### ✅ Já Implementado
- [x] Schema.org JSON-LD (Product, Organization, BreadcrumbList, WebPage)
- [x] Meta tags (title, description, keywords)
- [x] Open Graph completo (og:title, og:description, og:image, og:url)
- [x] Twitter Card
- [x] Robots meta (index, follow)
- [x] Canonical URLs
- [x] PWA Manifest
- [x] Robots.txt
- [x] Cache-Control headers
- [x] Sitemap.xml (dinâmico)

### 🟠 Ainda Fazer
- [ ] Gerar og-image.png (1200x630px)
- [ ] Criar ícones PWA adicionais (16, 32, 192px)
- [ ] Adicionar Google Search Console
- [ ] Adicionar Bing Webmaster Tools
- [ ] Configurar eventos GA4 (view_product, search, contact)
- [ ] Validar markup em https://validator.schema.org/
- [ ] Testar Mobile-Friendly em Google
- [ ] Implementar hreflang se expandir para outros idiomas
- [ ] Adicionar FAQ Schema para perguntas frequentes
- [ ] Implementar review ratings quando tiver avaliações

---

## 🔗 URLs Úteis para SEO

**Google:**
- Search Console: https://search.google.com/search-console
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- PageSpeed Insights: https://pagespeed.web.dev/

**Bing:**
- Webmaster Tools: https://www.bing.com/webmasters

**Validação:**
- Schema.org Validator: https://validator.schema.org/
- W3C HTML Validator: https://validator.w3.org/
- Open Graph Debugger: https://www.facebook.com/sharing/debugger/

**Monitoramento:**
- Google Analytics: https://analytics.google.com
- Ahrefs SEO Toolbar: https://ahrefs.com/seo-toolbar (extensão Chrome)
- SEOquake: https://www.seoquake.com/

---

## 💡 Dicas Adicionais

### Alt Text em Imagens
Sempre adicione `alt` em imagens (já fazemos isso no código):
```jsx
<Image 
  src={image} 
  alt="Descrição do produto - relevante para busca"
/>
```

### Heading Hierarchy
Siga ordem H1 → H2 → H3 (sem pular níveis):
```jsx
<h1>Tecassistiva - Página Única por página</h1>
<h2>Seção Principal</h2>
<h3>Subseção</h3>
```

### URLs Amigáveis
✅ Bom: `/produtos/ruby-hd/`
❌ Ruim: `/product.php?id=123`

### Velocidade de Página (Core Web Vitals)
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- Verificar em: https://pagespeed.web.dev/

### Links Internos
Linke bastante conteúdo relacionado:
- Produtos → Categorias → Subcategorias
- Produtos → Produtos Relacionados
- Blog/FAQ → Produtos relevantes

---

## 📈 Métricas de SEO para Acompanhar

1. **Impressões** - Quantas vezes seu site apareceu nos resultados
2. **Cliques** - Cliques recebidos do Google
3. **CTR** - Taxa de cliques (Impressões/Cliques)
4. **Posição Média** - Rank médio nos resultados
5. **Cobertura** - Quantas páginas foram indexadas
6. **Erros de Rastreamento** - Problemas de indexação
7. **Core Web Vitals** - Velocidade e experiência do usuário

---

## ✨ Resultado Final Esperado

Com todas essas implementações, o site deve:
- ✅ Aparecer em buscas com Rich Snippets (avaliação em estrelas, preços, etc.)
- ✅ Ter compartilhamentos bonitos em redes sociais (com imagem)
- ✅ Ser instalável em home screen (PWA)
- ✅ Ter melhor ranking para palavras-chave
- ✅ Passar em Core Web Vitals do Google
- ✅ Ter cache otimizado (mais rápido)
- ✅ Ser compreensível para Google, Bing, Yandex
