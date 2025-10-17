import Link from 'next/link';

export default function SearchResultCard({ result }) {
  return (
    <div className="border rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
      <div>
        <Link href={result.slug} className="block mb-2">
          <h3 className="text-lg font-bold text-gray-800 hover:text-tec-blue">{result.title}</h3>
        </Link>
        <p className="text-sm text-gray-600 line-clamp-3">{result.description}</p>
      </div>
      <div className="mt-4">
        <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{result.type}</span>
      </div>
    </div>
  );
}
