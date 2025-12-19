# Links de PDFs para Strapi

## 📘 Guias (14 arquivos)

### Lista de Links - Guias

```
/guias/basic.pdf
/guias/braillebox.pdf
/guias/clearreader.pdf
/guias/everest.pdf
/guias/fanfold.pdf
/guias/focus40.pdf
/guias/ruby10.pdf
/guias/ruby7.pdf
/guias/Rubyhd.pdf
/guias/rubyxl.pdf
/guias/tecafuser.pdf
/guias/transformer.pdf
/guias/Traveller.pdf
/guias/tutor.pdf
```

### Formato para Strapi (Guias)

| Nome do Produto | Link do Guia |
|----------------|--------------|
| Basic | `/guias/basic.pdf` |
| Braille Box | `/guias/braillebox.pdf` |
| Clear Reader | `/guias/clearreader.pdf` |
| Everest | `/guias/everest.pdf` |
| Fanfold | `/guias/fanfold.pdf` |
| Focus 40 | `/guias/focus40.pdf` |
| Ruby 10 | `/guias/ruby10.pdf` |
| Ruby 7 | `/guias/ruby7.pdf` |
| Ruby HD | `/guias/Rubyhd.pdf` |
| Ruby XL | `/guias/rubyxl.pdf` |
| Teca Fuser | `/guias/tecafuser.pdf` |
| Transformer | `/guias/transformer.pdf` |
| Traveller | `/guias/Traveller.pdf` |
| Tutor | `/guias/tutor.pdf` |

---

## 📖 Manuais (11 arquivos)

### Lista de Links - Manuais

```
/manuais/basic.pdf
/manuais/brincabraille.pdf
/manuais/clearreader.pdf
/manuais/everest.pdf
/manuais/ruby.pdf
/manuais/ruby10.pdf
/manuais/ruby7.pdf
/manuais/rubyxl.pdf
/manuais/tecafuser.pdf
/manuais/traveller.pdf
/manuais/tutor.pdf
```

### Formato para Strapi (Manuais)

| Nome do Produto | Link do Manual |
|----------------|----------------|
| Basic | `/manuais/basic.pdf` |
| Brinca Braille | `/manuais/brincabraille.pdf` |
| Clear Reader | `/manuais/clearreader.pdf` |
| Everest | `/manuais/everest.pdf` |
| Ruby | `/manuais/ruby.pdf` |
| Ruby 10 | `/manuais/ruby10.pdf` |
| Ruby 7 | `/manuais/ruby7.pdf` |
| Ruby XL | `/manuais/rubyxl.pdf` |
| Teca Fuser | `/manuais/tecafuser.pdf` |
| Traveller | `/manuais/traveller.pdf` |
| Tutor | `/manuais/tutor.pdf` |

---

## 📋 Formato CSV para Importação (Opcional)

### Guias
```csv
produto,link_guia
Basic,/guias/basic.pdf
Braille Box,/guias/braillebox.pdf
Clear Reader,/guias/clearreader.pdf
Everest,/guias/everest.pdf
Fanfold,/guias/fanfold.pdf
Focus 40,/guias/focus40.pdf
Ruby 10,/guias/ruby10.pdf
Ruby 7,/guias/ruby7.pdf
Ruby HD,/guias/Rubyhd.pdf
Ruby XL,/guias/rubyxl.pdf
Teca Fuser,/guias/tecafuser.pdf
Transformer,/guias/transformer.pdf
Traveller,/guias/Traveller.pdf
Tutor,/guias/tutor.pdf
```

### Manuais
```csv
produto,link_manual
Basic,/manuais/basic.pdf
Brinca Braille,/manuais/brincabraille.pdf
Clear Reader,/manuais/clearreader.pdf
Everest,/manuais/everest.pdf
Ruby,/manuais/ruby.pdf
Ruby 10,/manuais/ruby10.pdf
Ruby 7,/manuais/ruby7.pdf
Ruby XL,/manuais/rubyxl.pdf
Teca Fuser,/manuais/tecafuser.pdf
Traveller,/manuais/traveller.pdf
Tutor,/manuais/tutor.pdf
```

---

## 💡 Instruções para Uso no Strapi

1. **Adicionar campo de texto** no tipo de conteúdo "Produto" chamado `link_guia` e `link_manual`
2. **Copiar e colar** os links correspondentes para cada produto
3. **Usar nos templates** da seguinte forma:

```jsx
{produto.link_guia && (
  <a href={produto.link_guia} target="_blank" rel="noopener noreferrer">
    📄 Baixar Guia
  </a>
)}

{produto.link_manual && (
  <a href={produto.link_manual} target="_blank" rel="noopener noreferrer">
    📖 Baixar Manual
  </a>
)}
```

---

## ⚠️ Importante

- Os links começam com `/` (barra) porque são relativos à raiz do site
- Certifique-se de fazer o **commit e push** das pastas `public/guias` e `public/manuais` para o repositório
- Após o deploy, os links funcionarão em: `https://tecassistiva.com.br/guias/arquivo.pdf`
