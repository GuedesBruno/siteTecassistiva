# Deploy estático para Locaweb (via GitHub Actions)

Este projeto está configurado para export estático usando `next.config.mjs` com `output: 'export'`.

Requisitos:
- GitHub repository com Actions ativadas.
- Secrets configurados no repositório:
  - `NEXT_PUBLIC_STRAPI_URL` — URL base do Strapi (ex.: `https://meu-strapi.com`)
  - `STRAPI_API_TOKEN` — token de acesso da API do Strapi (usado em build time)
  - `LOCALWEB_FTP_HOST` — host FTP/SFTP da Locaweb (ex.: `ftp.minhalocaweb.com.br`)
  - `LOCALWEB_FTP_USER` — usuário FTP
  - `LOCALWEB_FTP_PASSWORD` — senha FTP

O workflow `.github/workflows/deploy.yml` faz:
1. Checkout do código
2. `npm ci`
3. `npm run build` (o Next gera a pasta `out/` por causa de `output: 'export'`)
4. Faz upload da pasta `out/` para o servidor via FTP (usando `SamKirkland/FTP-Deploy-Action`)

Observações:
- Se sua Locaweb usa SFTP, a action acima suporta (ver documentação do action). Ajuste o `server`/`server-dir` conforme necessário.
- Garanta que as variáveis de ambiente do Strapi estejam corretas para o ambiente de build. Se o Strapi exigir IPs/hosts permitidos, permita os IPs do runner do GitHub Actions.

Testes locais sugeridos:
```powershell
npm ci
npm run build
npx http-server out -p 3000
# Abra http://localhost:3000
```

Se preferir, posso ajustar o workflow para empacotar os arquivos e criar um artefato em vez de FTP, ou publicar em outro provedor suportado.
