/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Adicionando a paleta de cores personalizada da Tecassistiva
      colors: {
        'tec-blue': '#003366', // Um azul marinho profundo para o header
        'tec-blue-light': '#007bff', // Um azul mais vibrante para botões e links
        'tec-navy': '#001F3F', // Um azul ainda mais escuro para títulos de cards
      },
    },
  },
  plugins: [],
};