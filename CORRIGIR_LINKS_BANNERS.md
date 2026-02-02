# Correção de Links dos Banners (Hero Content)

## Problema
Os links dos banners estão apontando para `devsite.tecassistiva.com.br` em vez do site de produção `www.tecassistiva.com.br`.

## Causa
Os links dos banners são gerenciados **no Strapi**, não no código. O componente `BannerSlider.js` (linha 73) usa o campo `link_do_botao` que vem da API.

## Solução

### Passo 1: Acessar o Strapi
1. Acesse: https://innovative-friendship-159ff40007.strapiapp.com/admin
2. Faça login com suas credenciais

### Passo 2: Editar os Banners
1. Vá em **Content Manager** (menu lateral esquerdo)
2. Clique em **Banner**
3. Para cada banner listado:
   - Clique em **Editar**
   - Localize o campo **"link_do_botao"**
   - Substitua `devsite.tecassistiva.com.br` por `www.tecassistiva.com.br`
   - Clique em **Save** (Salvar)

### Passo 3: Rebuild do Site
Após atualizar todos os banners no Strapi, execute:

```powershell
npm run build
git add .
git commit -m "fix: Atualiza links dos banners para produção"
git push origin main
```

## Verificação
Após o deploy, verifique se os links dos botões nos banners estão apontando para `www.tecassistiva.com.br`.

---

**Data:** 2026-02-02
**Status:** Aguardando atualização no Strapi
