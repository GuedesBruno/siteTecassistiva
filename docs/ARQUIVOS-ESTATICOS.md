# Arquivos estáticos hospedados só no servidor (PDFs)

## O que são

Os PDFs das pastas abaixo **não estão mais no repositório git** (continuam na máquina de quem os tinha, mas estão no `.gitignore`):

| Pasta | Conteúdo | URL pública |
|---|---|---|
| `public/guias/` | Guias rápidos dos produtos (15 arquivos na última contagem) | `/guias/<arquivo>.pdf` |
| `public/manuais/` | Manuais dos produtos (16) | `/manuais/<arquivo>.pdf` |
| `public/catalogo/` | Catálogos dos produtos (19) | `/catalogo/<arquivo>.pdf` |

Eles ficam hospedados **somente no servidor da Locaweb** (`/public_html/guias`, `/public_html/manuais`, `/public_html/catalogo`).
Os links para eles são cadastrados no Strapi (lista em `docs/LINKS-PDFS-STRAPI.md`).

## Por que o deploy não os apaga

O deploy (`.github/workflows/deploy.yml`) envia o conteúdo de `out/` com:

```
lftp ... "mirror -R --no-perms --parallel=5 ... . /public_html/"
```

Sem `--delete`, o `mirror -R` só envia e atualiza arquivos; **não remove** do servidor o que não existe em `out/`.
Como o CI faz checkout sem esses PDFs, `out/` não os contém, e eles continuam intactos no servidor.

> **NÃO adicione `--delete` (nem `--delete-first`, `--delete-excluded`, `--just-delete`) ao `mirror`.**
> Isso apagaria do servidor todos os PDFs desta pasta (e qualquer outro arquivo que exista só lá, como logs e `.htaccess` manual).
> Se um dia for necessário usar `--delete`, antes envie os PDFs ao repositório (ou a outro armazenamento) e teste em uma pasta de homologação.

## O build não depende dos PDFs

Verificado por busca no código, scripts, `package.json` e workflow: nenhum arquivo em `src/`, `scripts/`, `qa/` ou no workflow lê, lista ou valida `public/guias`, `public/manuais` ou `public/catalogo`.
`search-data.json` e `sitemap.xml` vêm do Strapi, não desses arquivos.
O único PDF referenciado no código é `public/laudo-pericia.pdf` (link na página de comparativo de impressão), que **continua no git**.

## Backup

Os arquivos agora existem só no servidor (e em cópias locais antigas). Faça backup periódico:

1. Com um cliente FTP/SFTP (FileZilla, WinSCP) ou `lftp`, baixe as três pastas:
   `lftp -u USUARIO ftp.SEU-HOST -e "mirror /public_html/guias ./backup/guias; mirror /public_html/manuais ./backup/manuais; mirror /public_html/catalogo ./backup/catalogo; bye"`
2. Guarde a cópia fora do repositório (drive da empresa), com a data no nome da pasta.
3. Não coloque usuário e senha de FTP em scripts versionados nem em documentação.

## Novo upload ou substituição de PDF (manual, via FTP)

1. Nomeie o arquivo em minúsculas, sem espaços e sem acentos (ex.: `ruby10.pdf`).
2. Envie por FTP para a pasta certa em `/public_html/` (`guias`, `manuais` ou `catalogo`). Sobrescrever mantém a mesma URL.
3. Abra `https://<dominio>/<pasta>/<arquivo>.pdf` e confira que baixa.
4. Se for arquivo novo, cadastre o link (`/guias/<arquivo>.pdf`) no produto, no Strapi.
5. Atualize `docs/LINKS-PDFS-STRAPI.md` se a lista mudou.

## Atenção em desenvolvimento local

Quem tem os PDFs na pasta `public/` os verá no `npm run dev` e dentro de `out/` local. Em clone novo eles não existem: links para `/guias/...` darão 404 localmente. Isso é esperado.
