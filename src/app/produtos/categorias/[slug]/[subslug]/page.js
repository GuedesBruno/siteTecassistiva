// /app/produtos/categorias/[slug]/[subslug]/page.js
import { getCategoryBySlug, getAllCategories, getProductsBySubcategorySlug, getAllCategoryPaths } from "@/lib/api";
import CategoryMenu from "@/components/CategoryMenu";
import ProductDisplay from "@/components/ProductDisplay";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateStaticParams() {
  const categories = await getAllCategoryPaths();
  const params = categories
    .filter(Boolean)
    .flatMap((category) => {
      // No "attributes" nesting, based on user's JSON response
      if (!category || !category.slug || !category.subcategorias) {
        return [];
      }
      return category.subcategorias
        .filter(Boolean)
        .map((subcategory) => {
          if (!subcategory || !subcategory.slug) {
            return null;
          }
          return {
            slug: category.slug,
            subslug: subcategory.slug,
          };
        })
        .filter(Boolean);
    });
  return params;
}

export async function generateMetadata({ params }) {
  // TODO: Fetch specific subcategory name for a more descriptive title
  return {
    title: `Produtos | Tecassistiva`,
  };
}

export default async function SubCategoryPage({ params }) {
  const { slug, subslug } = params;

  const [categoryData, products, allCategories] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsBySubcategorySlug(subslug),
    getAllCategories()
  ]);

  if (!categoryData || !categoryData.data || categoryData.data.length === 0) {
    notFound();
  }

  const category = categoryData.data[0].attributes;
  const subcategory = category.subcategorias?.data?.find(s => (s.attributes || s).slug === subslug);
  const subcategoryName = subcategory ? (subcategory.attributes || subcategory).nome : '';

  const pageTitle = subcategoryName ? `${category.nome} - ${subcategoryName}` : category.nome;

  return (
    <div className="container mx-auto flex flex-col md:flex-row gap-8 py-8 px-4">
      <aside className="w-full md:w-1/4 lg:w-1/5">
        <CategoryMenu
          categories={allCategories}
          activeCategorySlug={slug}
          activeSubcategorySlug={subslug}
        />
      </aside>
      <main className="w-full md:w-3/4 lg:w-4/5 px-4 md:px-8 lg:px-16">
        <Suspense fallback={<div>Carregando...</div>}>
          <ProductDisplay
            categoryName={pageTitle}
            products={products}
          />
        </Suspense>
      </main>
    </div>
  );
}