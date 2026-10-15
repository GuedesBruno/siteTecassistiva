// Valida URLs vindas do CMS antes de usá-las em href/src.
// Aceita apenas os protocolos https, mailto e tel (http: é rejeitado: o site é só HTTPS); também aceita caminhos
// internos do próprio site ("/produtos/x", "#ancora"). Qualquer outra coisa
// (javascript:, data:, vbscript: etc.) devolve null.
const ALLOWED_PROTOCOLS = ['https:', 'mailto:', 'tel:'];

const INTERNAL_PATH = /^\/(?![\/\\])[^\\\u0000-\u001f\s]*$/;

export function safeUrl(url) {
  if (typeof url !== 'string') return null;
  const value = url.trim();
  if (!value) return null;

  // Caminho interno ou âncora. Rejeita "//host" (protocolo relativo), barra invertida,
  // caracteres de controle e espaços, que alguns navegadores normalizam para "//host".
  if (INTERNAL_PATH.test(value) || value.startsWith('#')) {
    return value;
  }

  try {
    const parsed = new URL(value);
    return ALLOWED_PROTOCOLS.includes(parsed.protocol) ? value : null;
  } catch {
    return null;
  }
}
