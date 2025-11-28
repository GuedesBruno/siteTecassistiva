/**
 * Componente para renderizar Schema.org JSON-LD na página
 * Client-side only para evitar erros durante build
 */

'use client';

export function Schema({ schema }) {
  if (!schema) return null;
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}
