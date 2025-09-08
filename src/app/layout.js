import './globals.css'
import Header from '@/components/Header'; // Importa o Header
import Footer from '@/components/Footer'; // Importa o Footer

export const metadata = {
  title: 'Tecassistiva',
  description: 'Tecnologia & Acessibilidade',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}