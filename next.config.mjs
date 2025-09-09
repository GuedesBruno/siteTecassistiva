/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',

  images: {
    // ADICIONADO: Esta linha desativa a otimização de imagens do Next.js
    unoptimized: true,

    remotePatterns: [
      // Manter a configuração local para desenvolvimento
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      // ADICIONAR A NOVA CONFIGURAÇÃO PARA O STRAPI CLOUD
      {
        protocol: 'https',
        // Substitua pelo hostname da sua URL do Strapi Cloud
        // Ex: 'meu-projeto-a1b2c3d4.strapiapp.com'
        hostname: 'seu-projeto-strapiapp.com',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;