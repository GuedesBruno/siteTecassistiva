import Image from 'next/image';
import React from 'react';
import DOMPurify from 'isomorphic-dompurify';

// Renderizador de Rich Text abrangente para lidar com vários formatos do Strapi
export default function RichTextRenderer({ content }) {
  if (!content) return null;

  const renderNode = (node, index) => {
    if (node.type === 'text') {
      let text = <span key={index}>{node.text}</span>;
      if (node.bold) {
        text = <strong key={index}>{text}</strong>;
      }
      if (node.italic) {
        text = <em key={index}>{text}</em>;
      }
      if (node.underline) {
        text = <u key={index}>{text}</u>;
      }
      if (node.strikethrough) {
        text = <s key={index}>{text}</s>;
      }
      if (node.code) {
        // Sanitizar HTML antes de renderizar
        const sanitizedHtml = DOMPurify.sanitize(node.text);
        return <code key={index} className="block whitespace-pre-wrap bg-gray-100 p-2 rounded font-mono text-sm">{sanitizedHtml}</code>;
      }
      return text;
    }

    const children = node.children?.map((child, childIndex) => renderNode(child, `${index}-${childIndex}`));

    switch (node.type) {
      case 'heading':
        switch (node.level) {
          case 1: return <h1 key={index} className="text-4xl font-bold my-4">{children}</h1>;
          case 2: return <h2 key={index} className="text-3xl font-bold my-4">{children}</h2>;
          case 3: return <h3 key={index} className="text-2xl font-bold my-3">{children}</h3>;
          case 4: return <h4 key={index} className="text-xl font-bold my-3">{children}</h4>;
          case 5: return <h5 key={index} className="text-lg font-bold my-2">{children}</h5>;
          case 6: return <h6 key={index} className="font-bold my-2">{children}</h6>;
          default: return <h2 key={index} className="text-3xl font-bold my-4">{children}</h2>;
        }
      case 'paragraph':
        return <div key={index} className="mb-4">{children}</div>;
      case 'list':
        if (node.format === 'ordered') {
          return <ol key={index} className="list-decimal list-inside mb-4 pl-4">{children}</ol>;
        }
        return <ul key={index} className="list-disc list-inside mb-4 pl-4">{children}</ul>;
      case 'list-item':
        return <li key={index}>{children}</li>;
      case 'link':
        return <a key={index} href={node.url} className="text-blue-600 hover:underline" rel="noopener noreferrer">{children}</a>;
      case 'image':
        return <Image key={index} src={node.image.url} alt={node.image.alternativeText || 'Imagem do conteúdo'} width={node.image.width || 800} height={node.image.height || 600} className="my-4 rounded" />;
      default:
        return <div key={index}>{children}</div>;
    }
  };

  return <>{content.map((node, index) => renderNode(node, index))}</>;
}