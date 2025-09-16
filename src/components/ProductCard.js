// sitetecassistiva/src/components/ProductCard.js

import Link from 'next/link';
import Image from 'next/image';
import { getStrapiURL } from '@/lib/api';

export default function ProductCard({ product }) {
  // Acesso correto aos atributos do produto na v4
  const { nome, slug, preco, imagem_principal } = product.attributes;

  // Acesso correto à URL da imagem na v4
  const imageUrl = imagem_principal?.data?.attributes?.url
    ? getStrapiURL(imagem_principal.data.attributes.url)
    : '/placeholder.jpg'; // Imagem de fallback

  return (
    <Link href={`/produtos/${slug}`} className="block border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <div className="relative w-full h-64">
        <Image
          src={imageUrl}
          alt={nome || 'Imagem do Produto'}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{nome}</h3>
        <p className="text-gray-700 mt-2">R$ {preco ? preco.toFixed(2) : '0.00'}</p>
      </div>
    </Link>
  );
}