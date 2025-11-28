// Pure utility functions for media URL handling
// These don't import @/lib/api to avoid loading problematic dependencies during static export

export function getStrapiURL() {
  let base = (process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337').replace(/\/+$/g, '');
  if (base.endsWith('/api')) base = base.replace(/\/api$/, '');
  return base;
}

export function getStrapiMediaUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path) || /^\/\//.test(path)) return path;
  const base = getStrapiURL();
  if (path.startsWith('/')) return `${base}${path}`;
  return `${base}/${path}`;
}
