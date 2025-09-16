/** @type {import('next').NextConfig} */
const nextConfig = {

  // AQUI ESTÁ A CORREÇÃO CRÍTICA PARA O ERRO 404/403:
  // Esta linha força o Next.js a criar uma pasta para cada rota
  // (ex: /tecassistiva/index.html), o que é 100% compatível com o seu .htaccess.
  trailingSlash: true,

  // Adicionado para gerar um site estático compatível com hospedagem sem Node.js
  output: 'export',

  reactStrictMode: true,
  images: {
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'light-dog-088c5ec318.strapiapp.com', // Mantém a sua URL correta
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;