/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',

  // Configuração para permitir imagens de domínios externos.
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**', // O caminho padrão onde o Strapi armazena as imagens.
      },
      // PREPARAÇÃO PARA O FUTURO:
      // Quando você hospedar seu Strapi online, descomente e adicione a configuração abaixo.
      // Exemplo:
      // {
      //   protocol: 'https',
      //   hostname: 'api.tecassistiva.com.br',
      //   port: '',
      //   pathname: '/uploads/**',
      // },
    ],
  },
};

export default nextConfig;