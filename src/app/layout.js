import './globals.css';
import './swiper-custom.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Montserrat } from 'next/font/google';
import { getAllCategories } from '@/lib/api';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata = {
  title: 'Tecassistiva',
  description: 'Tecnologia & Acessibilidade',
}

export default async function RootLayout({ children }) {
  const allCategories = await getAllCategories();

  return (
    <html lang="pt-BR" className={`${montserrat.variable} font-sans`}>
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        <Header categories={allCategories} />
        {/* Adiciona um padding-top dinâmico para compensar a altura do header fixo */}
        <main className="flex-grow z-0" style={{ paddingTop: 'var(--header-height, 6rem)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}