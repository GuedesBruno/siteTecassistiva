// Este arquivo define a estrutura estática para os ambientes.
// As imagens (grid e banner) devem ser colocadas na pasta `public/ambientes/`.
// Os 'productSlugs' são os slugs dos produtos que você já tem no Strapi.

export const ambientesData = [
  {
    id: 1,
    slug: 'sala-de-aula-inclusiva',
    nome: 'Sala de Aula Inclusiva',
    imagem_grid: '/ambientes/escola-apresentacao.jpg',
    imagem_banner: '/ambientes/escola-apresentacao.jpg',
    productSlugs: [
      'maquina-braille-mountbatten', 
      'impressora-braille-index-everest-d-v5',
      // Adicione aqui outros slugs de produtos para este ambiente
    ],
  },
  {
    id: 2,
    slug: 'biblioteca-acessivel',
    nome: 'Biblioteca Acessível',
    imagem_grid: '/ambientes/biblioteca-apresentacao.jpg',
    imagem_banner: '/ambientes/biblioteca-apresentacao.jpg',
    productSlugs: [
      'scanner-e-leitor-autonomo-omni-reader',
      'lupa-eletronica-de-mesa-clearview-c-24-fhd',
      // Adicione aqui outros slugs de produtos para este ambiente
    ],
  },
    {
    id: 3,
    slug: 'institutos-federais',
    nome: 'Institutos Federais',
    imagem_grid: '/ambientes/inst-federal-apresentacao.jpg',
    imagem_banner: '/ambientes/inst-federal-apresentacao.jpg',
    productSlugs: [
      'teclado-ampliado-xl-print',
      'software-de-leitura-de-tela-jaws', // Exemplo
    ],
  },
  {
    id: 4,
    slug: 'universidades-federais',
    nome: 'Universidades Federais',
    imagem_grid: '/ambientes/uni-federal-apresentacao.jpg',
    imagem_banner: '/ambientes/uni-federal-apresentacao.jpg',
    productSlugs: [
      'teclado-ampliado-xl-print',
      'software-de-leitura-de-tela-jaws', // Exemplo
    ],
  },
  // Adicione quantos outros ambientes você precisar
];