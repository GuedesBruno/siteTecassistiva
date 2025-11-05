import WhatsAppButton from '@/components/WhatsAppButton';

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
    </>
  );
}