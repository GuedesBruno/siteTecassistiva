import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const { nome, slug, descricao_curta, imagem_principal } = product;
  
  const fullImageUrl = imagem_principal?.url; 
  const imageAlt = imagem_principal?.alternativeText || `Imagem de ${nome}`;

  if (!slug) return null;

  return (
    // Bordas retas, como solicitado
    <div className="bg-white border border-gray-200 shadow-md hover:shadow-xl transition-shadow flex flex-col text-center h-full">
      <div className="bg-tec-navy p-4 text-white">
        <h3 className="text-xl font-bold truncate">{nome}</h3>
      </div>
      <div className="p-5 flex-grow flex flex-col items-center">
        {/* ALTURA DA IMAGEM REDUZIDA para tornar o card mais retangular */}
        <div className="relative h-48 w-full mb-4">
          {fullImageUrl && (
            <Image 
              src={fullImageUrl} 
              alt={imageAlt} 
              fill 
              className="object-contain" 
            />
          )}
        </div>
        <p className="text-gray-600 text-sm flex-grow mb-4">{descricao_curta}</p>
        <Link href={`/produtos/${slug}`} className="text-tec-blue-light hover:underline mt-auto self-center font-semibold">
          Saiba mais...
        </Link>
      </div>
    </div>
  );
}