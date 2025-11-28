/**
 * Componente para renderizar Schema.org JSON-LD na página
 * Deve ser usado em layouts ou pages específicas
 */

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
