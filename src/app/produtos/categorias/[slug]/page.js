import { getAllCategories, getCategoryBySlug } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

export async function generateStaticParams() {
  const categories = await getAllCategories();
  if (!categories || categories.length === 0) return [];
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

function CategoryProductCard({ product }) {
  const { nome, slug, descricao_curta, imagem_principal } = product;

  // CORREÇÃO: Usar a URL diretamente, pois ela já vem completa do Strapi.
  const fullImageUrl = imagem_principal?.url;
  const imageAlt = imagem_principal?.alternativeText || `Imagem de ${nome}`;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border flex flex-col">
      <div className="relative h-48 w-full mb-4">
        {fullImageUrl ? (
          <Image 
            src={fullImageUrl} 
            alt={imageAlt} 
            fill 
            className="object-contain rounded-md" 
          />
        ) : <div className="w-full h-full bg-gray-200 rounded-md" />}
      </div>
      <h3 className="text-xl font-bold text-gray-800">{nome}</h3>
      <p className="text-gray-600 text-sm mt-2 flex-grow">{descricao_curta}</p>
      <Link href={`/produtos/${slug}`} className="text-blue-600 hover:underline mt-4 font-semibold self-start">
        Ver detalhes &rarr;
      </Link>
    </div>
  );
}

export default async function CategoryPage({ params }) {
  const category = await getCategoryBySlug(params.slug);
  const allCategories = await getAllCategories();

  if (!category) {
    return <p>Categoria não encontrada.</p>;
  }

  // A API agora popula os produtos diretamente dentro da categoria
  const products = category.produtos || [];

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:underline">Página Inicial</Link>
          <span className="mx-2">&gt;</span>
          <span className="font-semibold text-gray-700">{category.nome}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h2 className="text-xl font-bold mb-4">Categorias</h2>
              <ul>
                {allCategories.map((cat) => (
                  <li key={cat.id} className="mb-2">
                    <Link 
                      href={`/produtos/categorias/${cat.slug}`} 
                      scroll={false}
                      className={`block p-2 rounded-md transition-colors ${params.slug === cat.slug ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-100'}`}
                    >
                      {cat.nome}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <main className="lg:col-span-3">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">{category.nome}</h1>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <CategoryProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Nenhum produto encontrado nesta categoria.</p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}