import { getAllCategories, getCategoryBySlug } from '@/lib/api';
import CategoryClientView from '@/components/CategoryClientView';

export async function generateStaticParams() {
  const categories = await getAllCategories();
  if (!categories || categories.length === 0) return [];
  return categories
    .filter(category => category.attributes && category.attributes.slug)
    .map((category) => ({
      slug: category.attributes.slug,
    }));
}

// Gera o título e a descrição da página
export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Produto não Encontrado' };
  const { nome, descricao_curta } = product.attributes;
  return {
    title: `${nome} | Tecassistiva`,
    description: descricao_curta || `Detalhes sobre o produto ${nome}`,
  };
}

// Componente da página
export default async function ProductPage({ params }) {
  const productData = await getProductBySlug(params.slug);
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  if (!productData) {
    // Componente para produto não encontrado
    return (
      <div className="container mx-auto text-center py-20">
        <h1 className="text-4xl font-bold">Produto não encontrado</h1>
      </div>
    );
  }

  const { nome, descricao_longa, imagem_principal, galeria_de_imagens, categorias } = productData.attributes;
  const imageUrl = imagem_principal?.data?.attributes?.url;
  const fullImageUrl = imageUrl ? `${STRAPI_URL}${imageUrl}` : null;
  const imageAlt = imagem_principal?.data?.attributes?.alternativeText || `Imagem ilustrativa de ${nome}`;

  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-12">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:underline">Página Inicial</Link>
          <span className="mx-2">&gt;</span>
          {categorias?.data?.[0] && (
            <>
              <Link href={`/produtos/categorias/${categorias.data[0].attributes.slug}`} className="hover:underline">
                {categorias.data[0].attributes.nome}
              </Link>
              <span className="mx-2">&gt;</span>
            </>
          )}
          <span className="font-semibold text-gray-700">{nome}</span>
        </div>

        {/* Conteúdo do Produto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Coluna de Imagens */}
          <div>
            {fullImageUrl && (
              <div className="aspect-square relative w-full rounded-lg shadow-lg overflow-hidden border">
                <Image src={fullImageUrl} alt={imageAlt} fill className="object-contain" priority />
              </div>
            )}
            {/* Galeria */}
            {galeria_de_imagens?.data && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {galeria_de_imagens.data.map((img) => (
                  <div key={img.id} className="aspect-square relative w-full rounded-lg overflow-hidden border">
                    <Image src={`${STRAPI_URL}${img.attributes.url}`} alt={img.attributes.alternativeText || ''} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Coluna de Texto */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{nome}</h1>
            {descricao_longa && (
              <div className="prose prose-lg max-w-none text-gray-700">
                {descricao_longa.map((block, index) => (
                  <p key={index}>{block.children.map(child => child.text).join('')}</p>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Seção de Abas (a ser implementada) */}
      </div>
    </div>
  );
}