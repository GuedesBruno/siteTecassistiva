import Link from 'next/link';
import Image from 'next/image';
import { getStrapiMediaUrl } from '@/lib/api';

export default function ProductCard({ product }) {
  // Acesso seguro aos atributos do produto
  const p = product.attributes || product;
  const { nome, slug, imagem_principal, descricao_curta } = p || {};

  // imagem_principal pode vir como { data: { attributes: { url }}} ou plano { url }
  const imagePath = imagem_principal?.data?.attributes?.url || imagem_principal?.url || null;
  const isPlaceholder = !imagePath;
  const imageUrl = isPlaceholder ? '/icon-tecassistiva.svg' : getStrapiMediaUrl(imagePath);

  const productName = nome || "Produto sem nome";
  const description = descricao_curta || "Descrição não disponível.";

  if (!slug) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full bg-white">
      {/* Cabeçalho Azul */}
      <div className="bg-tec-blue text-white font-bold text-left py-2 px-4">
        <h3 className="text-lg truncate">{productName}</h3>
      </div>

      <Link href={`/produtos/${slug}`} className="flex flex-col flex-grow">
        {/* Imagem do Produto */}
        <div className="relative w-full h-48 bg-gray-200">
          <Image
            src={imageUrl}
            alt={imagem_principal?.data?.attributes?.alternativeText || imagem_principal?.alternativeText || `Imagem de ${productName}`}
            fill
            className={isPlaceholder ? "object-contain p-8" : "object-cover"}
          />
        </div>
        {/* Descrição */}
        <div className="p-4 flex-grow">
          <p className="text-sm text-gray-700">{description}</p>
        </div>
      </Link>
    </div>
  );
}