/** @type {import('next').NextConfig} */
const nextConfig = {
  // Esta linha força o Next.js a criar uma pasta para cada rota
  trailingSlash: true,

  // Adicionado para gerar um site estático compatível com hospedagem sem Node.js.
  output: 'export',

  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backend.tecassistiva.com.br', // Seu novo servidor VPS
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