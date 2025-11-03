import '../globals.css';
import WhatsAppButton from '@/components/WhatsAppButton';
import Script from 'next/script';

export default function ImersaoLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
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
  );
}
