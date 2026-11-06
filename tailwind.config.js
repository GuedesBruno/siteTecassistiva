/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // `container` para de crescer em 1280px (sem o passo 2xl de 1536px): o conteúdo fica com
    // margens laterais em telas largas, enquanto fundos, header e footer ocupam a tela toda.
    container: {
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
    },
    extend: {
      // Largura máxima do conteúdo. Valor único: manter igual a --shell-max em globals.css.
      maxWidth: { shell: 'var(--shell-max)' },
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