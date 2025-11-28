import './globals.css';
import './swiper-custom.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Montserrat } from 'next/font/google';
import { getAllCategories } from '@/lib/api';
import WhatsAppButton from '@/components/WhatsAppButton';
import Script from 'next/script';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata = {
  metadataBase: new URL('https://www.tecassistiva.com.br'),
  title: {
    default: 'Tecassistiva - Tecnologia & Acessibilidade',
    template: '%s | Tecassistiva'
  },
  description: 'Soluções em tecnologia assistiva para inclusão educacional e social. Produtos, softwares e serviços para pessoas com deficiência visual e outras necessidades específicas.',
  keywords: 'tecnologia assistiva, acessibilidade, deficiência visual, braille, leitura de tela, inclusão digital, educação especial',
  authors: [{ name: 'Tecassistiva' }],
  creator: 'Tecassistiva',
  publisher: 'Tecassistiva',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: 'https://www.tecassistiva.com.br'
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://www.tecassistiva.com.br',
    siteName: 'Tecassistiva',
    title: 'Tecassistiva - Tecnologia & Acessibilidade',
    description: 'Soluções em tecnologia assistiva para inclusão educacional e social',
    images: [
      {
        url: 'https://www.tecassistiva.com.br/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tecassistiva - Tecnologia & Acessibilidade'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@tecassistiva',
    creator: '@tecassistiva',
    title: 'Tecassistiva - Tecnologia & Acessibilidade',
    description: 'Soluções em tecnologia assistiva para inclusão educacional e social',
    images: ['https://www.tecassistiva.com.br/og-image.png']
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
    shortcut: '/favicon-16x16.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'google-site-verification-code-here',
    // yandex: 'yandex-verification-code-here',
  }
}

export default async function RootLayout({ children }) {
  const allCategories = await getAllCategories();

  return (
    <html lang="pt-BR" className={`${montserrat.variable} font-sans`}>
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        <Header categories={allCategories} />
        <main className="flex-grow z-0" style={{ paddingTop: 'var(--header-height, 6rem)' }}>
          {children}
        </main>
        <Footer />
        <WhatsAppButton />

        {/* Scripts do Google Tag Manager */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-WH33R519KY" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-WH33R519KY');
          `}
        </Script>
      </body>
    </html>
  )
}