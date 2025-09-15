/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  // AQUI ESTÁ A CORREÇÃO:
  // Esta linha força o Next.js a criar uma pasta para cada rota
  // (ex: /tecassistiva/index.html), o que é mais compatível com servidores Apache.
  trailingSlash: true,

  reactStrictMode: true,
  images: {
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'light-dog-088c5ec318.strapiapp.com',
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