// sitetecassistiva/src/app/produtos/[slug]/page.js

import { fetchAPI } from "@/lib/api";
import Image from 'next/image';
import { getStrapiURL } from "@/lib/api";

async function getProductBySlug(slug) {
  try {
    const products = await fetchAPI("/produtos", {
      filters: { slug: { $eq: slug } },
      populate: "deep", // 'deep' popula todos os níveis de relação
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
          {/* Aqui você pode adicionar botões como "Adicionar ao Carrinho" */}
        </div>
      </div>
    </div>
  );
}

// Opcional: Gerar rotas estáticas
export async function generateStaticParams() {
    const products = await fetchAPI("/produtos");
    return products.map((product) => ({
        slug: product.attributes.slug,
    }));
}