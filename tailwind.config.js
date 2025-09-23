/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ATUALIZADO: Paleta de cores ajustada
      colors: {
        'tec-blue': '#002554',        // Nova cor principal do Header
        'tec-blue-light': '#0056b3',  // Azul vibrante para botões e links
        'tec-navy': '#001F3F',       // Azul ainda mais escuro para a barra superior
        'tec-footer': '#003366',     // A cor antiga do Header, agora para o Footer
      },
    },
  },
  plugins: [],
};