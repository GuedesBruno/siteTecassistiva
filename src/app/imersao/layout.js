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
    </>
  );
}