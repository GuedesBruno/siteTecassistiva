/**
 * Converte o JSON do Rich Text do Strapi em uma string HTML.
 * @param {Array|string} richTextData - Os dados do campo Rich Text.
 * @returns {string} A string HTML renderizada.
 */
export function renderRichText(richTextData) {
  if (!richTextData) return '';
  if (typeof richTextData === 'string') return richTextData;
  if (!Array.isArray(richTextData)) return '';

  return richTextData.map((block) => {
    if (block.type === 'paragraph' && Array.isArray(block.children)) {
      const content = block.children.map((child) => {
        if (child.type !== 'text') return '';
        let text = child.text || '';
        if (child.bold) text = `<strong>${text}</strong>`;
        if (child.italic) text = `<em>${text}</em>`;
        return text;
      }).join('');
      return `<p>${content}</p>`;
    }
    if (block.type === 'list' && Array.isArray(block.children)) {
      const listTag = block.format === 'ordered' ? 'ol' : 'ul';
      const items = block.children.map((item) => `<li>${item.children.map((child) => child.text || '').join('')}</li>`).join('');
      return `<${listTag}>${items}</${listTag}>`;
    }
    return '';
  }).join('');
}

