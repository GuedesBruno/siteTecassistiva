// Este arquivo define a estrutura estática para os ambientes.
// As imagens (grid e banner) devem ser colocadas na pasta `public/ambientes/`.

export const ambientesData = [
  {
    id: 1,
    slug: 'ambiente-escolar',
    nome: 'Ambiente Escolar',
    imagem_grid: '/ambientes/escola-apresentacao.jpg',
    imagem_banner: '/ambientes/escola-apresentacao.jpg',
    subAmbientes: [
      {
        id: 101,
        slug: 'sala-de-aula',
        nome: 'Sala de Aula',
        imagem: '/ambientes/escola-apresentacao.jpg', // Placeholder
        productSlugs: ['clearreader', 'focus-40-blue', 'brinca-braille', 'ruby-7-hd', 'multiplano']
      },
      {
        id: 102,
        slug: 'sala-de-recurso-multifuncional',
        nome: 'Sala de Recurso Multifuncional',
        imagem: '/ambientes/inst-federal-apresentacao.jpg', // Placeholder
        productSlugs: ['clearreader', 'focus-40-blue', 'brinca-braille', 'ruby-7-hd', 'traveller-hd', 'clearview-24', 'teca-fuser', 'multiplano', 'everest', 'abafador-index']
      },
      {
        id: 103,
        slug: 'biblioteca-escolar',
        nome: 'Biblioteca',
        imagem: '/ambientes/biblioteca-apresentacao.jpg', // Placeholder
        productSlugs: ['clearreader', 'focus-40-blue', 'traveller-hd', 'clearview-24']
      }
    ]
  },
  {
    id: 2,
    slug: 'biblioteca-acessivel',
    nome: 'Biblioteca Acessível',
    imagem_grid: '/ambientes/biblioteca-apresentacao.jpg',
    imagem_banner: '/ambientes/biblioteca-apresentacao.jpg',
    productSlugs: ['clearreader', 'focus-40-blue', 'ruby-7-hd', 'traveller-hd', 'clearview-24', 'everest', 'abafador-index']
  },
  {
    id: 3,
    slug: 'instituto-federal',
    nome: 'Instituto Federal',
    imagem_grid: '/ambientes/inst-federal-apresentacao.jpg',
    imagem_banner: '/ambientes/inst-federal-apresentacao.jpg',
    subAmbientes: [
      {
        id: 301,
        slug: 'sala-de-aula-if',
        nome: 'Sala de Aula',
        imagem: '/ambientes/escola-apresentacao.jpg', // Placeholder
        productSlugs: ['clearreader', 'focus-40-blue', 'brinca-braille', 'ruby-7-hd', 'multiplano', 'everest', 'abafador-index']
      },
      {
        id: 302,
        slug: 'napne-conapne',
        nome: 'Napne + Conapne e afins',
        imagem: '/ambientes/inst-federal-apresentacao.jpg', // Placeholder
        productSlugs: ['clearreader', 'focus-40-blue', 'brinca-braille', 'ruby-7-hd', 'traveller-hd', 'clearview-24', 'teca-fuser', 'multiplano', 'everest', 'abafador-index']
      },
      {
        id: 303,
        slug: 'biblioteca-if',
        nome: 'Biblioteca',
        imagem: '/ambientes/biblioteca-apresentacao.jpg', // Placeholder
        productSlugs: ['clearreader', 'focus-40-blue', 'traveller-hd', 'clearview-24']
      }
    ]
  },
  {
    id: 4,
    slug: 'universidade-federal',
    nome: 'Universidade Federal',
    imagem_grid: '/ambientes/uni-federal-apresentacao.jpg',
    imagem_banner: '/ambientes/uni-federal-apresentacao.jpg',
    subAmbientes: [
      {
        id: 401,
        slug: 'sala-de-aula-uf',
        nome: 'Sala de Aula',
        imagem: '/ambientes/escola-apresentacao.jpg', // Placeholder
        productSlugs: ['clearreader', 'focus-40-blue', 'brinca-braille', 'ruby-7-hd', 'multiplano']
      },
      {
        id: 402,
        slug: 'sala-de-recurso-multifuncional-uf',
        nome: 'Sala de Recurso Multifuncional',
        imagem: '/ambientes/inst-federal-apresentacao.jpg', // Placeholder
        productSlugs: ['clearreader', 'focus-40-blue', 'brinca-braille', 'ruby-7-hd', 'traveller-hd', 'clearview-24', 'teca-fuser', 'multiplano', 'everest', 'abafador-index']
      },
      {
        id: 403,
        slug: 'biblioteca-uf',
        nome: 'Biblioteca',
        imagem: '/ambientes/biblioteca-apresentacao.jpg', // Placeholder
        productSlugs: ['clearreader', 'focus-40-blue', 'traveller-hd', 'clearview-24']
      }
    ]
  }
];
