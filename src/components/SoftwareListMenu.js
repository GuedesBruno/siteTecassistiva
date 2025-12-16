'use client';

import React from 'react';

export default function SoftwareListMenu({ items = [], selectedItem, onItemSelect }) {
  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Itens Disponíveis</h3>
      <nav>
        <ul className="space-y-1">
          {items.map(item => {
            const isActive = selectedItem?.id === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onItemSelect(item)}
                  className={`block w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${isActive
                      ? 'bg-tec-blue text-white font-semibold shadow-sm'
                      : 'text-gray-800 hover:bg-gray-100 hover:text-tec-blue'
                    }`}
                >
                  {item.attributes.nome}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
