import Link from 'next/link';

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className="text-sm text-gray-500 mb-6">
      {items.map((item, index) => (
        <span key={index}>
          {index > 0 && <span className="mx-2">&gt;</span>}
          {item.path ? (
            <Link href={item.path} className="hover:underline">
              {item.name}
            </Link>
          ) : (
            <span className="font-semibold text-gray-700">{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}