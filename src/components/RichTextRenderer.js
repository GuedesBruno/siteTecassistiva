
import React from 'react';

// Este é um renderizador de texto rico muito básico.
// O campo de texto rico do Strapi retorna um JSON estruturado (blocks).
// Uma implementação completa usaria uma biblioteca como 'react-markdown' ou 
// mapearia recursivamente os blocos para componentes React.
// Por enquanto, isso apenas renderizará o texto simples para evitar erros.

export default function RichTextRenderer({ content }) {
  if (!content) {
    return null;
  }

  // Se o conteúdo for uma string simples
  if (typeof content === 'string') {
    return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />;
  }

  // Placeholder para uma estrutura de blocos mais complexa (não implementado)
  // console.log("RichText content structure:", content);

  return (
    <div className="prose max-w-none prose-sm text-gray-600">
        <p>O conteúdo formatado aparecerá aqui.</p>
    </div>
  );
}
