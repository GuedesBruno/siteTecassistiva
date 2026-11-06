// Servidor estático mínimo (sem dependências) para conferir `out/`. Uso: node qa/serve-out.mjs [porta] (padrão 4000)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('out');
const PORT = Number(process.argv[2] || 4000);
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.txt': 'text/plain',
  '.xml': 'application/xml', '.woff2': 'font/woff2', '.webp': 'image/webp',
};

http.createServer((req, res) => {
  let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { file = path.join(ROOT, '404.html'); res.statusCode = 404; }
  res.setHeader('Content-Type', TIPOS[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`Servindo out/ em http://localhost:${PORT}`));
