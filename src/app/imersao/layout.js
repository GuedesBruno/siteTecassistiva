import '../globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function ImersaoLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <WhatsAppButton />
        <GoogleAnalytics gaId="G-1J55L46P18" />
      </body>
    </html>
  );
}
