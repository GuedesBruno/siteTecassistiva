import React from 'react';

// Um renderizador simplificado para o formato Rich Text do Strapi.
// Este componente é projetado para ser robusto e lidar com diferentes tipos de conteúdo.

const renderLeaf = (leaf, index) => {
  let children = leaf.text;
  if (leaf.bold) {
    children = <strong key={`${index}-bold`}>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em key={`${index}-italic`}>{children}</em>;
  }
  if (leaf.underline) {
    children = <u key={`${index}-underline`}>{children}</u>;
  }
  if (leaf.strikethrough) {
    children = <s key={`${index}-strike`}>{children}</s>;
  }
  return <React.Fragment key={index}>{children}</React.Fragment>;
};

const renderBlock = (block, index) => {
  if (!block || !Array.isArray(block.children)) {
    return null;
  }

  const children = block.children.map((leaf, i) => renderLeaf(leaf, i));

  switch (block.type) {
    case 'heading':
      const Tag = `h${block.level || 1}`;
      return <Tag key={index}>{children}</Tag>;
    case 'list':
      const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
      // Esta é uma implementação simplificada para listas.
      // Uma implementação completa lidaria com blocos 'list-item' aninhados.
      return (
        <ListTag key={index} className="list-inside space-y-1 pl-5">
          {block.children.map((listItem, i) => (
            <li key={i}>{listItem.children.map((leaf, j) => renderLeaf(leaf, j))}</li>
          ))}
        </ListTag>
      );
    case 'paragraph':
    default:
      return <p key={index}>{children}</p>;
  }
};

/**
 * Renderiza conteúdo do editor Rich Text do Strapi.
 * Lida com conteúdo de bloco (array) e strings de texto simples.
 */
export default function RichTextRenderer({ content }) {
  if (!content) {
    return null;
  }

  if (typeof content === 'string') {
    return <p>{content}</p>;
  }

  if (Array.isArray(content)) {
    return content.map((block, index) => renderBlock(block, index));
  }

  console.warn('RichTextRenderer recebeu um tipo de conteúdo inesperado:', content);
  return null;
}