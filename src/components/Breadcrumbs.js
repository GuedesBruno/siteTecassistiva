import Link from 'next/link';

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className="text-sm text-gray-500 mb-6" aria-label="Trilha de navegação">
      <ol className="flex flex-wrap items-center">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index}>
              {index > 0 && <span className="mx-2" aria-hidden="true">&gt;</span>}
              {item.path ? (
                <Link href={item.path} className="hover:underline" {...(isLast ? { 'aria-current': 'page' } : {})}>
                  {item.name}
                </Link>
              ) : (
                <span className="font-semibold text-gray-700" {...(isLast ? { 'aria-current': 'page' } : {})}>{item.name}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
