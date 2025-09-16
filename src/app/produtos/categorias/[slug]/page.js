import { fetchAPI } from '@/lib/api';
import CategoryClientView from '@/components/CategoryClientView';

// GERA OS PARÂMETROS ESTÁTICOS (SLUGS) PARA CADA PÁGINA DE CATEGORIA
export async function generateStaticParams() {
  try {
    const categories = await fetchAPI("/categorias", { fields: ['slug'] });

    // CORREÇÃO APLICADA AQUI
    // 1. Verifica se a resposta da API é válida e não está vazia.
    // 2. Acessa o slug através de 'item.attributes.slug'.
    if (!categories || categories.length === 0) {
      return [];
    }

    return categories
      .filter(item => item && item.attributes && item.attributes.slug) // Garante que o item e seus atributos existam
      .map((item) => ({
        slug: item.attributes.slug,
      }));

  } catch (error) {
    console.error("Falha ao gerar slugs de categoria:", error);
    return []; // Retorna um array vazio em caso de erro para não quebrar o build
  }
}

// BUSCA OS DADOS ESPECÍFICOS DE UMA CATEGORIA
async function getCategoryData(slug) {
  try {
    const categories = await fetchAPI("/categorias", {
      filters: { slug: { $eq: slug } },
      populate: {
        subcategorias: {
          populate: {
            produtos: {
              populate: {
                imagem_principal: true,
              }
            }
          }
        }
      }
    });

    // Retorna o primeiro item do array ou null se não encontrar
    return categories && categories.length > 0 ? categories[0] : null;
  } catch (error) {
    console.error(`Erro ao buscar dados da categoria ${slug}:`, error);
    return null;
  }
}


// O COMPONENTE DA PÁGINA
export default async function CategoryPage({ params }) {
  const { slug } = params;
  const category = await getCategoryData(slug);

  if (!category) {
    return (
      <div className="container mx-auto text-center py-10">
        <h1 className="text-3xl font-bold">Categoria não encontrada</h1>
        <p>A categoria que você está procurando não existe ou foi movida.</p>
      </div>
    );
  }

  return <CategoryClientView category={category} />;
}