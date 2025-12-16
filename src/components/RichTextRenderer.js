import Image from 'next/image';
import React from 'react';

// Renderizador de Rich Text abrangente para lidar com vários formatos do Strapi
export default function RichTextRenderer({ content }) {
  if (!content) return null;

  const renderNode = (node, index) => {
    if (!node) return null; // Proteção contra nodes nulos

    if (node.type === 'text') {
      if (!node.text) return null; // Proteção contra texto vazio/nulo

      let text = <span key={index}>{node.text}</span>;
      if (node.bold) {
        text = <strong key={index} className="font-bold text-[#002554]">{text}</strong>;
      }
      if (node.italic) {
        text = <em key={index} className="italic text-gray-800">{text}</em>;
      }
      if (node.underline) {
        text = <u key={index} className="decoration-tec-blue underline-offset-2">{text}</u>;
      }
      if (node.strikethrough) {
        text = <s key={index} className="text-gray-400">{text}</s>;
      }
      if (node.code) {
        // Check if the code block contains an iframe
        if (node.text && node.text.trim().startsWith('<iframe')) {
          return (
            <div
              key={index}
              className="my-6 aspect-video w-full rounded-xl overflow-hidden shadow-sm"
              dangerouslySetInnerHTML={{ __html: node.text }}
            />
          );
        }
        // React already escapes text automatically, preventing XSS
        // DOMPurify is not needed for text content
        return <code key={index} className="block whitespace-pre-wrap bg-gray-50 p-4 rounded-lg font-mono text-sm text-gray-700 border border-gray-100">{node.text}</code>;
      }
      return text;
    }

    const children = node.children?.map((child, childIndex) => renderNode(child, `${index}-${childIndex}`));

    switch (node.type) {
      case 'heading':
        switch (node.level) {
          case 1: return <h1 key={index} className="text-4xl font-bold my-6 text-[#002554] leading-tight">{children}</h1>;
          case 2: return <h2 key={index} className="text-3xl font-bold my-5 text-[#002554] leading-tight">{children}</h2>;
          case 3: return <h3 key={index} className="text-2xl font-bold my-4 text-[#002554] leading-tight">{children}</h3>;
          case 4: return <h4 key={index} className="text-xl font-bold my-3 text-[#002554] leading-snug">{children}</h4>;
          case 5: return <h5 key={index} className="text-lg font-bold my-3 text-[#002554] leading-snug">{children}</h5>;
          case 6: return <h6 key={index} className="font-bold my-2 text-[#002554]">{children}</h6>;
          default: return <h2 key={index} className="text-3xl font-bold my-5 text-[#002554] leading-tight">{children}</h2>;
        }
      case 'paragraph':
        return <div key={index} className="mb-6 leading-relaxed text-gray-700" style={{ fontSize: 'inherit' }}>{children}</div>;
      case 'list':
        if (node.format === 'ordered') {
          return <ol key={index} className="list-decimal list-inside mb-6 pl-4 space-y-2 text-gray-700 marker:text-[#002554] marker:font-bold" style={{ fontSize: 'inherit' }}>{children}</ol>;
        }
        return <ul key={index} className="list-disc list-inside mb-6 pl-4 space-y-2 text-gray-700 marker:text-[#002554]" style={{ fontSize: 'inherit' }}>{children}</ul>;
      case 'list-item':
        return <li key={index} className="pl-2">{children}</li>;
      case 'link':
        return <a key={index} href={node.url} className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors" style={{ lineHeight: '1.3' }} rel="noopener noreferrer">{children}</a>;
      case 'image':
        return <Image key={index} src={node.image.url} alt={node.image.alternativeText || 'Imagem do conteúdo'} width={node.image.width || 800} height={node.image.height || 600} className="my-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300" />;
      default:
        return <div key={index}>{children}</div>;
    }
  };

  return <>{content.map((node, index) => renderNode(node, index))}</>;
}