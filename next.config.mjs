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
        protocol: 'https',
        hostname: 'innovative-friendship-159ff40007.media.strapiapp.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
  },

  // Security Headers + Cache-Control
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache específico para HTML
      {
        source: '/:path*.(html|htm)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
      // Cache específico para JSON (search-data, sitemap)
      {
        source: '/search-data.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
      // Imagens com cache longo
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;