import './globals.css'

export const metadata = {
  title: 'Tecassistiva',
  description: 'Tecnologia & Acessibilidade',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}