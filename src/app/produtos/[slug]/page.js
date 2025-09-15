// sitetecassistiva/src/app/produtos/[slug]/page.js

import { fetchAPI, getStrapiURL } from "@/lib/api";
import Image from 'next/image';

// Adicionando exports para forçar o comportamento estático
export const dynamic = 'error'; // Lança um erro se uma rota dinâmica não gerada for acessada
export const dynamicParams = false; // Bloqueia rotas que não foram geradas por generateStaticParams

// Gera as rotas estáticas no momento do build
export async function generateStaticParams() {
    const products = await fetchAPI("/produtos");
    if (!Array.isArray(products)) {
        return [];
    }
    return products.map((product) => ({
        slug: product.attributes.slug,
    }));
}

async function getProductBySlug(slug) {
  try {
    const products = await fetchAPI("/produtos", {
      filters: { slug: { $eq: slug } },
      populate: "deep",
    });
    return products && products.length > 0 ? products[0] : null;
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
}

export default async function ProductPage({ params }) {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return <div className="text-center py-10">Produto não encontrado.</div>;
  }

  const { nome, descricao, preco, imagem_principal } = product.attributes;
  const imageUrl = imagem_principal?.data?.attributes?.url
    ? getStrapiURL(imagem_principal.data.attributes.url)
    : '/placeholder.jpg';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="relative w-full h-96">
          <Image
            src={imageUrl}
            alt={nome || 'Imagem do Produto'}
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold mb-4">{nome}</h1>
          <p className="text-2xl text-blue-600 font-semibold mb-6">R$ {preco ? preco.toFixed(2) : 'Preço a consultar'}</p>
          <div className="prose lg:prose-xl max-w-none">
            <p>{descricao}</p>
          </div>
        </div>
      </div>
    </div>
  );
}