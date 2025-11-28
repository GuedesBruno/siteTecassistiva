# 🔴 PROBLEMA IDENTIFICADO

## Análise Detalhada

### Culpados Encontrados

**1. layout.js - Linha 6**
```javascript
import { getAllCategories } from '@/lib/api';  // ❌ ESTE IMPORT CAUSA O ERRO
```

**2. page.js (home) - Linhas 10-11**
```javascript
import { 
  getBanners, 
  getFeaturedProducts,      // ❌ ESTES IMPORTS CAUSA O ERRO
  getManufacturers,
  getAllTestimonials,
  getHomeVideos
} from "@/lib/api";
```

**3. produtos/[slug]/page.js - Linha 1**
```javascript
import { getProductBySlug, getAllProducts } from '@/lib/api';  // ❌ ESTE IMPORT CAUSA O ERRO
```

---

## Por Que Isso Causa o Erro?

### Sequência do Problema:

1. **Durante Next.js static export build:**
   - Next.js tenta compilar `src/app/layout.js` para SSG
   - A primeira linha de código JavaScript encontrada é: `import { getAllCategories } from '@/lib/api'`
   
2. **Node.js carrega o módulo `src/lib/api.js`**
   - Este arquivo contém funções que usam fetch/URL (browser APIs)
   - Mas ele também tem outras dependências transitivas

3. **Transitive dependency loading:**
   - `src/lib/api.js` → `strapi.js` ou outro módulo
   - Alguma dessas dependências → `whatwg-url` (shim de browser URL para Node.js)
   
4. **Erro durante compilação:**
   - `whatwg-url` é incompatível com static export
   - Erro: `TypeError: Cannot read properties of undefined (reading 'get')`

### Por que funcionava em dd6daf6?

Em `dd6daf6` NÃO havia essas exportações de `metadata` em layout.js e page.js.
Sem metadata, as páginas não eram compiladas durante SSG, então o import não era avaliado.

---

## Por que dd6daf6 Funcionava?

```javascript
// dd6daf6 - layout.js original (SIMPLES)
export const metadata = {
  title: 'Tecassistiva',
  description: 'Tecnologia & Acessibilidade',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
}

export default async function RootLayout({ children }) {
  // ... sem imports de @/lib/api
}
```

**NÃO tinha:**
- `import { getAllCategories } from '@/lib/api'` ❌ Não existia
- Metadata expandido ❌ Não existia
- Page-level metadata ❌ Não existia

---

## Solução

### Opção 1: ✅ RECOMENDADO - Remover imports de @/lib/api
Remover as linhas que importam de `@/lib/api` em:
- `src/app/layout.js` - remover getAllCategories
- `src/app/page.js` - remover getBanners, etc.
- `src/app/produtos/[slug]/page.js` - remover getProductBySlug, getAllProducts

Estas funções precisam estar em `RootLayout` e `Home` (que são async)?
- Se SIM: usar dynamic() com {ssr: false}
- Se NÃO: remover e usar dados estáticos ou client-side

### Opção 2: ❌ NÃO RECOMENDADO - Remover Metadata
Remover as exportações de metadata para não forçar compilação durante SSG.
(Mas isso perde SEO que foi o objetivo)

### Opção 3: ❌ NÃO RECOMENDADO - Refatorar src/lib/api.js
Refatorar para não carregar whatwg-url (complexo e arriscado)

---

## Verificação

### Pergunta 1: getAllCategories é usado em layout.js?
```javascript
export default async function RootLayout({ children }) {
  // Está sendo usado aqui?
}
```

### Pergunta 2: getBanners, etc. são usados em page.js?
```javascript
export default async function Home() {
  // Sim, está sendo usado:
  const [banners, featuredProducts, ...] = await Promise.all([...])
}
```

**Resposta: SIM, estão sendo usados durante SSG (async functions são executadas no build)**

---

## Próxima Ação

Preciso verificar se essas funções REALMENTE precisam ser executadas durante SSG
ou se podem ser movidas para client-side.

Se forem movidas para client-side:
- ✅ Problema resolvido
- ✅ Home e layout carregam sem erros
- ✅ Dados carregam dinamicamente no browser

Se precisarem estar no SSG:
- ⚠️ Precisa refatorar `src/lib/api.js` para não carregar whatwg-url
- ⚠️ Opção: criar versões "SSG-safe" das funções (mais trabalho)

