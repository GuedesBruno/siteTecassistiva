import Link from 'next/link';
import Image from 'next/image';
import { getStrapiMediaUrl } from '@/lib/api';

export default function ProductCard({ product }) {
  // Acesso seguro aos atributos do produto
  // CORREÇÃO: 'preco' foi removido da desestruturação
  const p = product.attributes || product;
  const { nome, slug, imagem_principal } = p || {};

  // imagem_principal pode vir como { data: { attributes: { url }}} ou plano { url }
  const imagePath = imagem_principal?.data?.attributes?.url || imagem_principal?.url || null;
  const imageUrl = imagePath ? getStrapiMediaUrl(imagePath) : '/placeholder.jpg';

  const productName = nome || "Produto sem nome";

  if (!slug) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full bg-white">
      <Link href={`/produtos/${slug}`} className="flex flex-col h-full">
        <div className="relative w-full h-64 bg-gray-200">
          <Image
            src={imageUrl}
            alt={imagem_principal?.data?.attributes?.alternativeText || imagem_principal?.alternativeText || `Imagem de ${productName}`}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-3 flex flex-col flex-grow">
          {/* A div abaixo agora ocupa o espaço restante com flex-grow */}
          <h3 className="text-lg font-semibold text-gray-800 flex-grow">{productName}</h3>
          {/* CORREÇÃO: A linha que exibia o preço foi removida daqui */}
        </div>
      </Link>
    </div>
  );
}