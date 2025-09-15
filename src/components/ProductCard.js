import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {
  // Extrai os atributos do produto do objeto 'attributes'
  const { nome, slug, descricao_curta, imagem_principal } = product.attributes;
  
  // Navega pela estrutura 'data' para obter a URL da imagem
  const fullImageUrl = imagem_principal?.data?.attributes?.url; 
  const imageAlt = imagem_principal?.data?.attributes?.alternativeText || `Imagem de ${nome}`;

  // Se não houver slug, não renderiza o card (boa prática)
  if (!slug) return null;

  return (
    <div className="bg-white border border-gray-200 shadow-md hover:shadow-xl transition-shadow flex flex-col text-center h-full">
      <div className="bg-tec-navy p-4 text-white">
        <h3 className="text-xl font-bold truncate">{nome}</h3>
      </div>
      <div className="p-5 flex-grow flex flex-col items-center">
        <div className="relative h-48 w-full mb-4">
          {fullImageUrl ? ( // A verificação agora é feita com a variável correta
            <Image 
              src={fullImageUrl} 
              alt={imageAlt} 
              fill 
              className="object-contain" 
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">Imagem indisponível</span>
            </div>
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