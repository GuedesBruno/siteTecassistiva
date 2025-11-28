# ✅ SOLUÇÃO - REMOVER IMPORTS DE @/lib/api DURANTE SSG

## Estratégia

### Problema Atual:
```javascript
// src/app/layout.js
import { getAllCategories } from '@/lib/api';  // ❌ Causa erro na compilação

export default async function RootLayout({ children }) {
  const allCategories = await getAllCategories();  // ❌ Executado durante SSG
  return (
    <Header categories={allCategories} />  // ❌ Necessário?
  )
}
```

### Solução Proposta:

**REMOVER a chamada de getAllCategories() do servidor durante build**

1. **Remover o import de @/lib/api em layout.js**
2. **Passar categories = [] para Header**
3. **Fazer Header carregar categorias no CLIENT-SIDE** com useState/useEffect

Benefícios:
- ✅ Não carrega whatwg-url durante SSG
- ✅ Header continua funcional (carrega categorias do browser)
- ✅ Caching no browser (melhor performance)
- ✅ Sem quebra de funcionalidade

---

## Implementação

### Passo 1: layout.js - Remover getAllCategories

**De:**
```javascript
import { getAllCategories } from '@/lib/api';

export default async function RootLayout({ children }) {
  const allCategories = await getAllCategories();
  return (
    <Header categories={allCategories} />
  )
}
```

**Para:**
```javascript
export default async function RootLayout({ children }) {
  return (
    <Header categories={[]} />
  )
}
```

### Passo 2: Header.js - Carregar categorias no client-side

**De (Server Component):**
```javascript
export default function Header({ categories = [] }) {
  // Renderiza direto com categories passadas
}
```

**Para (Client Component):**
```javascript
'use client';
import { useEffect, useState } from 'react';

export default function Header({ categories: initialCategories = [] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories');  // Ou usar fetch direto
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // ... resto do componente
}
```

**OU mais simples - Se o Header não precisar das categorias para SSR:**
```javascript
'use client';
import { useEffect, useState } from 'react';

export default function Header({ categories = [] }) {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('https://seu-strapi.com/api/categories');
        const data = await response.json();
        setCats(data.data || []);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const categoriesToUse = cats.length > 0 ? cats : categories;

  // ... usar categoriesToUse no render
}
```

---

## Verificação de Outros Problemas

### page.js (home) também importa de @/lib/api

```javascript
import { 
  getBanners, 
  getFeaturedProducts,
  getManufacturers,
  getAllTestimonials,
  getHomeVideos
} from "@/lib/api";

export default async function Home() {
  const [banners, featuredProducts, ...] = await Promise.all([...])
  // Renderiza conteúdo
}
```

**Estes SIM precisam estar no servidor (para renderizar conteúdo no SSG).**

**Mas por que funcionava em dd6daf6?**

Porque em dd6daf6 `page.js` NÃO exportava metadata!

Em dd6daf6:
```javascript
// page.js em dd6daf6
import { getBanners, ... } from '@/lib/api';

// ❌ NÃO tinha: export const metadata = {...}

export default async function Home() {
  // ... fetches
}
```

**Quando não há metadata, o componente não é compilado durante SSG!**

Mas agora temos metadata em page.js:
```javascript
export const metadata = { ... }  // ✅ Novo em 8d73403

export default async function Home() {
  // Agora isto É compilado durante SSG
}
```

---

## Solução Completa

### Para layout.js
✅ **Remover import de @/lib/api**
✅ **Passar categories = []**
✅ **Header carrega no client-side**

### Para page.js
⚠️ **Mais complexo - precisa manter dados no SSG**

Opções:
1. **Remover metadata de page.js** (volta a não compilar durante SSG)
   - ❌ Perde SEO
   
2. **Refatorar page.js para não usar @/lib/api imports direto**
   - Criar funções "static-safe" que não carregam whatwg-url
   - ⚠️ Complexo

3. **Mover imports para dentro da função (lazy evaluation)**
   - ```javascript
     export default async function Home() {
       const { getBanners } = await import('@/lib/api');  // Lazy import
       ...
     }
     ```
   - ✅ Pode funcionar

4. **Remover a exportação de metadata em page.js**
   - Deixar apenas em layout.js
   - ✅ Simples e funciona

---

## Recomendação

### Imediato:
1. ✅ **Remover import de getAllCategories em layout.js** (causa erro direto)
2. ✅ **Header carrega categorias no client-side**

### Se ainda falhar:
3. ⚠️ **Remover exportação de metadata em page.js** (por enquanto)
   - Manter apenas metadata global em layout.js
   
### Teste:
```bash
npm run build
```

Se passar → Problema resolvido!

