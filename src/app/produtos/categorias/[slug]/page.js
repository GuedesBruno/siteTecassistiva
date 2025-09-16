import { fetchAPI } from '@/lib/api';
import CategoryClientView from '@/components/CategoryClientView';

// GERA OS PARÂMETROS ESTÁTICOS (SLUGS) PARA CADA PÁGINA DE CATEGORIA
export async function generateStaticParams() {
  console.log("A tentar gerar parâmetros estáticos para categorias...");
  const categories = await fetchAPI("/categorias", { fields: ['slug'] });

  // CORREÇÃO: Adicionada uma verificação explícita para falhar o build com uma mensagem clara
  if (!categories || categories.length === 0) {
    throw new Error("A API não retornou categorias para gerar as páginas. Verifique se as categorias existem e estão publicadas no Strapi.");
  }

  console.log(`Encontradas ${categories.length} categorias para gerar as páginas.`);

  return categories
    .filter(item => item && item.attributes && item.attributes.slug)
    .map((item) => ({
      slug: item.attributes.slug,
    }));
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