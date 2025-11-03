import WhatsAppButton from '@/components/WhatsAppButton';
import Script from 'next/script';

export default function ImersaoLayout({ children }) {
  return (
    <>
      <style>{`
        header, footer {
          display: none;
        }
        main {
          padding-top: 0 !important;
        }
      `}</style>
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
    </>
  );
}