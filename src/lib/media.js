// Pure utility functions for media URL handling
// These don't import @/lib/api to avoid loading problematic dependencies during static export.
// Fonte única de getStrapiURL/getStrapiMediaUrl (api.js reexporta daqui).
import { trimStrapiBase } from './strapi-client.mjs';

export function getStrapiURL() {
  return trimStrapiBase(process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337');
}

export function getStrapiMediaUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path) || /^\/\//.test(path)) return path;
  const base = getStrapiURL();
  if (path.startsWith('/')) return `${base}${path}`;
  return `${base}/${path}`;
}
