import { getAllCategories, getProductsByCategorySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

type Params = {
  params: {
    slug: string;
    subslug: string;
  };
};

export async function generateStaticParams() {
  // Retornando um array vazio temporariamente para testar o build.
  // Isso não irá gerar nenhuma página estática para esta rota,
  // mas deve fazer o build passar se o problema for na lógica de busca de dados.
  return [];
}

export default async function SubcategoryPage({ params }: Params) {
  const { slug, subslug } = params;
  const { products, category, subcategory } = await getProductsByCategorySlug(slug, subslug);

  if (!products.length || !category || !subcategory) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:underline">Página Inicial</Link>
        <span className="mx-2">&gt;</span>
        <Link href="/produtos/categorias" className="hover:underline">Produtos</Link>
        <span className="mx-2">&gt;</span>
        <Link href={`/produtos/categorias/${category.attributes.slug}`} className="hover:underline">{category.attributes.nome}</Link>
        <span className="mx-2">&gt;</span>
        <span className="font-semibold text-gray-700">{subcategory.attributes.nome}</span>
      </nav>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">{subcategory.attributes.nome}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
}