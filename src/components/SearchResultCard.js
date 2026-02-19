import Link from 'next/link';
import Image from 'next/image';

export default function SearchResultCard({ result }) {
  // Para documentos, exibe com ícone e link de download
  if (result.type === 'Documento') {
    return (
      <div className="border rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 h-full bg-blue-50">
        <div className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex items-start gap-2 mb-2">
              <span className="text-2xl">📄</span>
              <div className="flex-1">
                <a
                  href={result.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-1"
                >
                  <h3 className="text-lg font-bold text-gray-800 hover:text-tec-blue line-clamp-2">
                    {result.fileName}
                  </h3>
                </a>
                <Link href={result.slug} className="block">
                  <p className="text-sm text-tec-blue hover:underline">
                    Produto: {result.productTitle}
                  </p>
                </Link>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-2">
              <span className="font-semibold">Tipo:</span> {result.documentType}
            </p>

            <p className="text-sm text-gray-600 line-clamp-2">{result.description}</p>
          </div>

          <div className="mt-4 flex gap-2">
            <span className="text-xs font-semibold text-white bg-tec-blue px-2 py-1 rounded-full">
              {result.type}
            </span>
            <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded-full">
              {result.documentType}
            </span>
          </div>
        </div>
      </div>
    );
  }

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

          {/* Subcategoria - se disponível */}
          {result.subcategories && (
            <p className="text-xs text-gray-500 mb-1">
              <span className="font-semibold">Subcategoria:</span> {result.subcategories}
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
