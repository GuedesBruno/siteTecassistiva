/** @type {import('postcss').Config} */
const config = {
  plugins: [
    '@tailwindcss/postcss', // Este é o nome correto do plugin
    'autoprefixer',
  ],
};

export default config;