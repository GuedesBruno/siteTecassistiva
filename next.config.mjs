/** @type {import('next').NextConfig} */
const nextConfig = {
  // A LINHA MAIS IMPORTANTE:
  // Garante que o build gere uma pasta 'out' com arquivos estáticos.
  output: 'export',

  // Opcional: Desativa a otimização de imagens, o que pode evitar
  // erros de build em alguns ambientes de hospedagem compartilhada.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;