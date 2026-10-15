// A página /busca é um client component (usa useSearchParams); os metadados ficam neste layout.
// Página de resultados: não indexar (evita URLs infinitas por ?q=), mas seguir os links.
export const metadata = {
  title: 'Resultados da Busca',
  alternates: { canonical: '/busca/' },
  robots: { index: false, follow: true },
};

export default function BuscaLayout({ children }) {
  return children;
}
