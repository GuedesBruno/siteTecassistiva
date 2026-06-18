# Implementação Pendente: Campo palavras_chave para SEO

## Status
⏳ **Aguardando criação do campo no Strapi**

---

## Passo 1: Criar Campo no Strapi

### Acesso ao Painel
1. Acesse: https://innovative-friendship-159ff40007.strapiapp.com/admin
2. Vá em **Content-Type Builder** → **Produto**

### Configuração do Campo
- **Nome do campo:** `palavras_chave`
- **Tipo:** **JSON**
- **Configurações:**
  - ✅ Required: Não (opcional)

### Permissões
1. Vá em **Settings** → **Roles** → **Public**
2. Em **Produto**, marque:
   - ✅ `find`
   - ✅ `findOne`
3. Salvar

---

## Passo 2: Preencher Palavras-Chave no Strapi

### Formato JSON (Array de Strings)

Para cada produto, preencher o campo `palavras_chave` com um array JSON:

**Exemplo para BrailleBox:**
```json
["impressora braille", "index braille", "braille box", "folha solta", "tecnologia assistiva", "acessibilidade", "deficiência visual", "braille profissional"]
```

**Exemplo para Ruby 7 HD:**
```json
["lupa eletrônica", "ampliador portátil", "baixa visão", "ruby", "freedom scientific", "tecnologia assistiva"]
```

---

## Passo 3: Implementar no Código

### Arquivo: `src/lib/api.js`

**Linha 118** - Adicionar campo na função `getProductBySlug`:

```javascript
fields: [
  'nome',
  'slug',
  'descricao_curta',
  'descricao_longa',
  'caracteristicas_funcionais',
  'caracteristicas_tecnicas',
  'visao_geral',
  'videos',
  'Fabricante',
  'palavras_chave', // ← ADICIONAR ESTA LINHA
],
```

---

## Passo 4: Usar no SEO

### Arquivo: `src/app/produtos/[slug]/page.js`

**Função `generateMetadata`** - Adicionar keywords:

```javascript
export async function generateMetadata({ params }) {
  const { slug } = params;
  const productData = await getProductBySlug(slug);
  const product = productData?.attributes;

  if (!product) {
    return {
      title: 'Produto não encontrado | Tecassistiva',
    };
  }

  return {
    title: `${product.nome} | Tecassistiva`,
    description: product.descricao_curta || product.descricao_longa?.substring(0, 160),
    keywords: product.palavras_chave?.join(', '), // ← ADICIONAR ESTA LINHA (converte array para string)
    alternates: {
      canonical: `https://www.tecassistiva.com.br/produtos/${slug}`,
    },
  };
}
```

---

## Passo 5: Testar

1. **Build local:**
   ```powershell
   npm run build
   ```

2. **Verificar página gerada:**
   - Abrir `out/produtos/braille-box/index.html`
   - Procurar por `<meta name="keywords" content="impressora braille, index braille, ...">`

3. **Se funcionar:**
   ```powershell
   git add .
   git commit -m "feat: Adiciona campo palavras_chave (JSON) para SEO"
   git push origin main
   ```

---

## Benefícios SEO

✅ **Meta keywords** para motores de busca
✅ **Múltiplas palavras-chave** por produto
✅ **Fácil gerenciamento** no Strapi
✅ **Melhora relevância** nas buscas do Google

---

## Avisar Quando Pronto

Quando criar o campo JSON no Strapi, avise para implementarmos o código!
