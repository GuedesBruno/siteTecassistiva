import './globals.css'
import Header from '@/components/Header'; // Importa Header
import Footer from '@/components/Footer'; // Importa Footer
import { getAllCategories } from '@/lib/api';

export const metadata = {
  title: 'Tecassistiva',
  description: 'Tecnologia & Acessibilidade',
}

export default async function RootLayout({ children }) {
  // Busca as categorias no servidor para passar ao Header
  const allCategories = await getAllCategories();

  return (
    <html lang="pt-BR">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <Header categories={allCategories} />
        {/* Adiciona um padding-top (pt-24) para compensar a altura do header fixo */}
        <main className="flex-grow z-0 pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}