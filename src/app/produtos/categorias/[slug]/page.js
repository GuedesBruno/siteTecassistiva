import { getAllCategories, getCategoryBySlug } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import CategoryClientView from '@/components/CategoryClientView'; // Usaremos um componente de cliente

// Gera a lista de todas as categorias para o Next.js criar as páginas estáticas
export async function generateStaticParams() {
  const categories = await getAllCategories();
  if (!categories || categories.length === 0) return [];
  
  // CORREÇÃO: Acedemos a 'category.attributes.slug'
  return categories
    .filter(category => category.attributes && category.attributes.slug)
    .map((category) => ({
      slug: category.attributes.slug,
    }));
}

export async function generateMetadata({ params }) {
    const categoryData = await getCategoryBySlug(params.slug);
    const category = categoryData?.attributes;

    if (!category) {
        return { title: 'Categoria não encontrada' };
    }
    return { title: `${category.nome} | Tecassistiva` };
}

// Componente do Servidor que busca os dados
export default async function CategoryPage({ params }) {
  const categoryData = await getCategoryBySlug(params.slug);
  const allCategories = await getAllCategories();

  if (!categoryData) {
    return (
        <div className="container mx-auto px-6 py-12">
            <p>Categoria não encontrada.</p>
        </div>
    );
  }

  // Passa os dados para um componente de cliente para renderização
  return (
    <CategoryClientView 
        category={categoryData.attributes}
        allCategories={allCategories}
        initialProducts={categoryData.attributes.produtos.data}
        params={params}
    />
  )
}