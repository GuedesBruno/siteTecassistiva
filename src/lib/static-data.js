// Arquivo: src/lib/static-data.js
// Aqui ficarão os dados estáticos (mock) para o nosso site.

export const staticBanners = [
  {
    id: 1,
    attributes: {
      Titulo: "Tecnologia que Transforma Vidas",
      Subtitulo: "Soluções inovadoras em tecnologia assistiva para inclusão e acessibilidade.",
      Link: "/produtos",
      Imagem: {
        data: {
          attributes: {
            url: "/Hero Content 1.jpg"
          }
        }
      }
    }
  },
  {
    id: 2,
    attributes: {
      Titulo: "Conheça Nossos Produtos",
      Subtitulo: "Navegue por nosso catálogo e encontre a solução ideal para você.",
      Link: "/produtos",
      Imagem: {
        data: {
          attributes: {
            url: "/Hero Content 2.jpg"
          }
        }
      }
    }
  }
];

export const staticProducts = [
  {
    id: 1,
    attributes: {
      Nome: "Mouse de Cabeça",
      Slug: "mouse-de-cabeca",
      DescricaoCurta: "Controle o cursor do mouse com movimentos da cabeça. Ideal para pessoas com mobilidade reduzida nos membros superiores.",
      DescricaoCompleta: "<p>O Mouse de Cabeça é um dispositivo de alta precisão que permite o controle total do computador através de movimentos cefálicos. Inclui software de calibração e cliques por sopro ou piscada.</p>",
      Destaque: true,
      ImagemDestaque: {
        data: {
          attributes: {
            url: "/Hero Content 3.jpg"
          }
        }
      },
      categorias: {
        data: [{ attributes: { Nome: "Acessibilidade", Slug: "acessibilidade" } }]
      }
    }
  },
  {
    id: 2,
    attributes: {
      Nome: "Teclado Ampliado",
      Slug: "teclado-ampliado",
      DescricaoCurta: "Teclado com teclas grandes e de alto contraste, facilitando a digitação para pessoas com baixa visão ou dificuldades motoras.",
      DescricaoCompleta: "<p>Este teclado possui um layout simplificado e teclas quatro vezes maiores que o padrão, com cores vibrantes para melhor visualização. Conexão USB plug-and-play.</p>",
      Destaque: true,
      ImagemDestaque: {
        data: {
          attributes: {
            url: "/Hero Content 4.jpg"
          }
        }
      }
    }
  },
  {
    id: 3,
    attributes: {
      Nome: "Software de Leitura",
      Slug: "software-de-leitura",
      DescricaoCurta: "Software que converte texto em voz, permitindo que pessoas com deficiência visual ou dislexia acessem conteúdo digital.",
      DescricaoCompleta: "<p>Compatível com Windows e macOS, nosso software de leitura de tela oferece vozes naturais, suporte a múltiplos idiomas e integração com os principais navegadores e aplicativos.</p>",
      Destaque: false,
      ImagemDestaque: {
        data: {
          attributes: {
            url: "/Hero Content 2.jpg"
          }
        }
      },
       categorias: {
        data: [{ attributes: { Nome: "Softwares", Slug: "softwares" } }]
      }
    }
  }
];

export const staticCategories = [
  {
    id: 1,
    attributes: {
      Nome: "Acessibilidade",
      Slug: "acessibilidade",
      produtos: {
        data: [staticProducts[0]]
      }
    }
  },
  {
    id: 2,
    attributes: {
      Nome: "Softwares",
      Slug: "softwares",
       produtos: {
        data: [staticProducts[2]]
      }
    }
  }
];