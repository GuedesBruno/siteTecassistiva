import React from 'react';

// Função recursiva para renderizar nós de texto (folhas da árvore)
const renderTextNode = (node, index) => {
  let textElement = <React.Fragment key={index}>{node.text}</React.Fragment>;
  if (node.bold) {
    textElement = <strong key={index}>{textElement}</strong>;
  }
  if (node.italic) {
    textElement = <em key={index}>{textElement}</em>;
  }
  // Adicione outros estilos de texto aqui se necessário (underline, strikethrough)
  return textElement;
};

// Função recursiva para renderizar elementos aninhados (como links)
const renderElementNode = (node, index) => {
  switch (node.type) {
    case 'link':
      return (
        <a 
          href={node.url}
          key={index} 
          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
          target="_blank" 
          rel="noopener noreferrer"
        >
          {node.children.map(renderTextNode)}
        </a>
      );
    default:
      return renderTextNode(node, index);
  }
};

// Função principal que mapeia os blocos de nível superior do Strapi
export default function RichTextRenderer({ content }) {
  if (!content || !Array.isArray(content)) {
    return null;
  }

  return (
    <div className="prose prose-sm max-w-none text-gray-700">
      {content.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={index} className="mb-2 last:mb-0">
                {block.children.map(renderElementNode)}
              </p>
            );
          // Adicione outros tipos de bloco aqui (heading, list, etc.) se precisar
          default:
            return (
              <p key={index} className="mb-2 last:mb-0">
                {block.children.map(renderElementNode)}
              </p>
            );
        }
      })}
    </div>
  );
}