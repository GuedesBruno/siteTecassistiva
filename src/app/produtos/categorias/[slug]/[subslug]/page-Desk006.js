import CategoryMenu from "@/components/CategoryMenu";
import ProductDisplay from "@/components/ProductDisplay";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import fs from 'fs';
import path from 'path';

// Lazy load API functions to avoid compilation during SSG
async function getCategoryBySlug(slug) {
  const { getCategoryBySlug: _getCategoryBySlug } = await import("@/lib/api");
  return _getCategoryBySlug(slug);
}

async function getAllCategories() {
  const { getAllCategories: _getAllCategories } = await import("@/lib/api");
  return _getAllCategories();
}

async function getProductsBySubcategorySlug(categorySlug, subcategorySlug) {
  const { getProductsBySubcategorySlug: _getProductsBySubcategorySlug } = await import("@/lib/api");
  return _getProductsBySubcategorySlug(categorySlug, subcategorySlug);
}

async function getAllCategoryPaths() {
  const { getAllCategoryPaths: _getAllCategoryPaths } = await import("@/lib/api");
  return _getAllCategoryPaths();
}

export async function generateStaticParams() {
  const categories = await getAllCategoryPaths();

  const paths = [];
  categories.forEach(category => {
    const catAttrs = category.attributes || category;
    const catSlug = catAttrs.slug;

    if (catAttrs.subcategorias && (catAttrs.subcategorias.data || Array.isArray(catAttrs.subcategorias))) {
      const subs = Array.isArray(catAttrs.subcategorias) ? catAttrs.subcategorias : catAttrs.subcategorias.data;

      subs.forEach(sub => {
        const subAttrs = sub.attributes || sub;
        if (subAttrs.slug) {
          paths.push({
            slug: catSlug,
            subslug: subAttrs.slug
          });
        }
      });
    }
  });

  return paths;
}

export async function generateMetadata({ params }) {
  const { slug, subslug } = params;
  const categoryData = await getCategoryBySlug(slug);
  const category = categoryData?.data?.[0]?.attributes;

  if (!category) {
    return {
      title: 'Produtos | Tecassistiva',
    };
  }

  // Encontrar a subcategoria específica
  const subcategoriesArray = Array.isArray(category.subcategorias)
    ? category.subcategorias
    : (category.subcategorias?.data || []);

  const subcategory = subcategoriesArray.find(s => (s.attributes || s).slug === subslug);
  const subcategoryName = subcategory ? (subcategory.attributes || subcategory).nome : '';

  if (subcategoryName) {
    return {
      title: `${subcategoryName} | Tecassistiva`,
      description: `Confira nossos produtos em ${subcategoryName}.`,
      alternates: {
        canonical: `https://www.tecassistiva.com.br/produtos/categorias/${slug}/${subslug}`,
      },
    };
  }

  return {
    title: `${category.nome} | Tecassistiva`,
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

  // Lidar com ambas estruturas: .data ou array direto
  const subcategoriesArray = Array.isArray(category.subcategorias)
    ? category.subcategorias
    : (category.subcategorias?.data || []);

  const subcategory = subcategoriesArray.find(s => (s.attributes || s).slug === subslug);
  const subcategoryName = subcategory ? (subcategory.attributes || subcategory).nome : '';

  const pageTitle = subcategoryName ? `${category.nome} - ${subcategoryName}` : category.nome;

  const breadcrumbs = [
    { name: 'Página Inicial', path: '/' },
    { name: 'Produtos', path: '/produtos' },
    { name: category.nome, path: `/produtos/categorias/${category.slug}` },
  ];

  // Adicionar subcategoria ao breadcrumb apenas se houver nome
  if (subcategoryName) {
    breadcrumbs.push({ name: subcategoryName, path: `/produtos/categorias/${category.slug}/${subslug}` });
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Página Inicial',
        'item': 'https://www.tecassistiva.com.br'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Produtos',
        'item': 'https://www.tecassistiva.com.br/produtos'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': category.nome,
        'item': `https://www.tecassistiva.com.br/produtos/categorias/${category.slug}`
      },
      ...(subcategoryName ? [{
        '@type': 'ListItem',
        'position': 4,
        'name': subcategoryName,
        'item': `https://www.tecassistiva.com.br/produtos/categorias/${category.slug}/${subslug}`
      }] : [])
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/3 lg:w-1/4">
          <CategoryMenu
            categories={allCategories}
            activeCategorySlug={slug}
            activeSubcategorySlug={subslug}
          />
        </aside>
        <main className="w-full md:w-2/3 lg:w-3/4">
          <Breadcrumbs items={breadcrumbs} />
          <Suspense fallback={<div>Carregando...</div>}>
            <ProductDisplay
              categoryName={pageTitle}
              products={products}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}