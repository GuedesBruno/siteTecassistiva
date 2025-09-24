import {
  getProductsBySubcategorySlug,
  getSubcategoryBySlug,
  getSubcategoriesForCategory,
} from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

// Abordagem "Top-Down" para gerar os parâmetros estáticos
export async function generateStaticParams({ params }) {
  try {
    const { slug } = params;
    const subcategories = await getSubcategoriesForCategory(slug);

    // CORREÇÃO FINAL: Acessando o .slug diretamente, conforme a estrutura da sua API
    return subcategories.map((subcategory) => ({
      subslug: subcategory.slug,
    }));

  } catch (error) {
    console.error(
      `Falha ao gerar parâmetros para a categoria ${params.slug}:`,
      error
    );
    return [];
  }
}

export default async function SubcategoryPage({ params }) {
  const { subslug } = params;

  const [products, subcategoryData] = await Promise.all([
    getProductsBySubcategorySlug(subslug),
    getSubcategoryBySlug(subslug),
  ]);

  if (!products || products.length === 0 || !subcategoryData) {
    notFound();
  }

  // CORREÇÃO: Acessar os dados da categoria e subcategoria sem .attributes
  const categoryData = subcategoryData.categoria?.data;

  if (!categoryData) {
    console.error(`Categoria pai não encontrada para a subcategoria: ${subslug}`);
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:underline">
          Página Inicial
        </Link>
        <span className="mx-2">&gt;</span>
        <Link href="/produtos/categorias" className="hover:underline">
          Produtos
        </Link>
        <span className="mx-2">&gt;</span>
        {/* CORREÇÃO: Acessar .slug e .nome diretamente */}
        <Link
          href={`/produtos/categorias/${categoryData.slug}`}
          className="hover:underline"
        >
          {categoryData.nome}
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-semibold text-gray-700">
          {subcategoryData.nome}
        </span>
      </nav>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        {subcategoryData.nome}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}