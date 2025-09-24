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
  // ÚLTIMO TESTE: Retornando um array vazio para ver se o build passa.
  // Se isso funcionar, o problema está nos dados retornados pela API.
  return [];
}

export default async function SubcategoryPage({ params }) {
  const { subslug } = params;

  // Busca os produtos e os dados da subcategoria em paralelo
  const [products, subcategoryData] = await Promise.all([
    getProductsBySubcategorySlug(subslug),
    getSubcategoryBySlug(subslug),
  ]);

  // Se não encontrar produtos ou a subcategoria, retorna 404
  if (!products || products.length === 0 || !subcategoryData) {
    notFound();
  }

  // Extrai a categoria pai dos dados da subcategoria
  const categoryData = subcategoryData.attributes.categoria?.data;

  // Se a categoria pai não estiver presente, é uma condição de erro
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
        <Link
          href={`/produtos/categorias/${categoryData.attributes.slug}`}
          className="hover:underline"
        >
          {categoryData.attributes.nome}
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-semibold text-gray-700">
          {subcategoryData.attributes.nome}
        </span>
      </nav>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        {subcategoryData.attributes.nome}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}