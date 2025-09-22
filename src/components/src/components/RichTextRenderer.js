// src/components/RichTextRenderer.js
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

export default function RichTextRenderer({ content }) {
  // Se não houver conteúdo, não renderiza nada
  if (!content) {
    return null;
  }

  return (
    <div className="prose lg:prose-xl max-w-none">
      <BlocksRenderer
        content={content}
        blocks={{
          // Você pode customizar cada tipo de bloco aqui
          heading: ({ children, level }) => {
            switch (level) {
              case 1:
                return <h1 className="text-4xl font-bold my-4">{children}</h1>;
              case 2:
                return <h2 className="text-3xl font-bold my-3">{children}</h2>;
              case 3:
                return <h3 className="text-2xl font-bold my-2">{children}</h3>;
              default:
                return <h4 className="text-xl font-bold my-1">{children}</h4>;
            }
          },
          paragraph: ({ children }) => <p className="mb-4 text-gray-700">{children}</p>,
          link: ({ children, url }) => <a href={url} className="text-blue-600 hover:underline">{children}</a>,
          // Adicione customizações para listas, imagens, etc.
        }}
      />
    </div>
  );
}