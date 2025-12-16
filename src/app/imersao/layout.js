import WhatsAppButton from '@/components/WhatsAppButton';

export default function ImersaoLayout({ children }) {
  return (
    <>
      <style>{`
        body {
          /* Adiciona classe para permitir cantos arredondados */
        }
        header, footer {
          display: none;
        }
        main {
          padding-top: 0 !important;
        }
      `}</style>
      <div className="imersao-page">
        {children}
      </div>
      <WhatsAppButton />
    </>
  );
}