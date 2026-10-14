// Valida URLs vindas do CMS antes de usá-las em href/src.
// Aceita apenas os protocolos https, http, mailto e tel; também aceita caminhos
// internos do próprio site ("/produtos/x", "#ancora"). Qualquer outra coisa
// (javascript:, data:, vbscript: etc.) devolve null.
const ALLOWED_PROTOCOLS = ['https:', 'http:', 'mailto:', 'tel:'];

export function safeUrl(url) {
  if (typeof url !== 'string') return null;
  const value = url.trim();
  if (!value) return null;

  // Caminho interno (mas não "//host", que é protocolo relativo) ou âncora
  if ((value.startsWith('/') && !value.startsWith('//')) || value.startsWith('#')) {
    return value;
  }

  try {
    const parsed = new URL(value);
    return ALLOWED_PROTOCOLS.includes(parsed.protocol) ? value : null;
  } catch {
    return null;
  }
}
