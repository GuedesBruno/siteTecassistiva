import Link from 'next/link';
import Image from 'next/image';
import { getStrapiURL } from '@/lib/api';

export default function ProductCard({ product }) {
  // Acesso seguro aos atributos do produto
  // CORREÇÃO: 'preco' foi removido da desestruturação
  const { nome, slug, imagem_principal } = product.attributes || {};

  const imageUrl = imagem_principal?.data?.attributes?.url
    ? getStrapiURL(imagem_principal.data.attributes.url)
    : '/placeholder.jpg';

  const productName = nome || "Produto sem nome";

  if (!slug) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full">
      <Link href={`/produtos/${slug}`} className="flex flex-col h-full">
        <div className="relative w-full h-56 bg-gray-200">
          <Image
            src={imageUrl}
            alt={imagem_principal?.data?.attributes?.alternativeText || `Imagem de ${productName}`}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          {/* A div abaixo agora ocupa o espaço restante com flex-grow */}
          <h3 className="text-lg font-semibold text-gray-800 flex-grow">{productName}</h3>
          {/* CORREÇÃO: A linha que exibia o preço foi removida daqui */}
        </div>
      </Link>
    </div>
  );
}