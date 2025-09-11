/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Vamos manter desativado por enquanto para simplificar
    remotePatterns: [
      {
        protocol: 'https',
        // ESTA É A LINHA CRÍTICA CORRIGIDA:
        hostname: 'light-dog-088c5ec318.strapiapp.com',
        port: '',
        pathname: '/uploads/**',
      },
      // Manter o localhost para testes futuros
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