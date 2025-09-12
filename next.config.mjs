/** @type {import('next').NextConfig} */
const nextConfig = {
  // AQUI ESTÁ A CORREÇÃO:
  // Esta linha instrui o Next.js a gerar um site estático na pasta "out"
  output: 'export',

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