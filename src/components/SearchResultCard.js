import Link from 'next/link';
import Image from 'next/image';

export default function SearchResultCard({ result }) {
  return (
    <div className="border rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 h-full">
      {/* Imagem - se disponível */}
      {result.imageUrl && (
        <div className="w-full h-40 bg-gray-200 relative overflow-hidden">
          <Image
            src={result.imageUrl}
            alt={result.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      {/* Conteúdo */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <Link href={result.slug} className="block mb-2">
            <h3 className="text-lg font-bold text-gray-800 hover:text-tec-blue line-clamp-2">{result.title}</h3>
          </Link>
          
          {/* Categoria - se disponível */}
          {result.categories && (
            <p className="text-xs text-gray-500 mb-1">
              <span className="font-semibold">Categoria:</span> {result.categories}
            </p>
          )}
          
          {/* Fabricante - se disponível */}
          {result.fabricante && (
            <p className="text-xs text-gray-500 mb-2">
              <span className="font-semibold">Fabricante:</span> {result.fabricante}
            </p>
          )}
          
          <p className="text-sm text-gray-600 line-clamp-3">{result.description}</p>
        </div>
        
        <div className="mt-4">
          <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{result.type}</span>
        </div>
      </div>
    </div>
  );
}
