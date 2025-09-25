import React from 'react';
import ProductCard from './ProductCard';

/**
 * Exibe um título de categoria e uma grade de produtos.
 * @param {object} props - As propriedades do componente.
 * @param {string} props.categoryName - O nome da categoria a ser exibido como título.
 * @param {Array<object>} props.products - A lista de produtos a serem exibidos.
 */
export default function ProductDisplay({ categoryName, products = [] }) {
  if (products.length === 0) {
    return <p className="text-gray-600">Nenhum produto encontrado nesta categoria.</p>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 border-b-2 border-gray-200 pb-4 mb-8">
        {categoryName}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}