import React from 'react';

/**
 * Renderiza o conteúdo Rich Text do Strapi de forma segura,
 * convertendo o JSON em componentes React.
 * @param {object} props
 * @param {Array|string} props.content - O array de blocos do campo Rich Text ou uma string.
 */
const RichTextRenderer = ({ content }) => {
  if (!content) {
    return null;
  }

  // Lida com strings simples, preservando quebras de linha.
  if (typeof content === 'string') {
    return <div className="whitespace-pre-line">{content}</div>;
  }

  if (!Array.isArray(content)) {
    console.warn('RichTextRenderer: O conteúdo fornecido não é um array válido.');
    return null;
  }

  const renderTextNode = (node, index) => {
    let children = node.text;

    if (node.bold) {
      children = <strong key={`${index}-bold`}>{children}</strong>;
    }
    if (node.italic) {
      children = <em key={`${index}-italic`}>{children}</em>;
    }
    if (node.underline) {
      children = <u key={`${index}-underline`}>{children}</u>;
    }
    if (node.strikethrough) {
      children = <s key={`${index}-strikethrough`}>{children}</s>;
    }

    return <React.Fragment key={index}>{children}</React.Fragment>;
  };

  const renderElement = (element, index) => {
    const key = `${element.type}-${index}`;
    switch (element.type) {
      case 'paragraph':
        return (
          <p key={key}>
            {element.children.map((child, i) => renderTextNode(child, `${key}-${i}`))}
          </p>
        );
      case 'heading':
        const Tag = `h${element.level}`;
        return (
          <Tag key={key}>
            {element.children.map((child, i) => renderTextNode(child, `${key}-${i}`))}
          </Tag>
        );
      case 'list':
        const ListTag = element.format === 'ordered' ? 'ol' : 'ul';
        const style = element.indentLevel ? { paddingLeft: `${element.indentLevel * 1.5}rem` } : {};
        return (
          <ListTag key={key} style={style}>
            {element.children.map((listItem, i) => {
              if (listItem.type === 'list') {
                return renderElement(listItem, `${key}-nested-${i}`);
              }
              return (
                <li key={`${key}-li-${i}`}>
                  {listItem.children.map((child, j) => renderTextNode(child, `${key}-li-${i}-${j}`))}
                </li>
              );
            })}
          </ListTag>
        );
      default:
        return null;
    }
  };

  return <>{content.map((element, index) => renderElement(element, index))}</>;
};

export default RichTextRenderer;