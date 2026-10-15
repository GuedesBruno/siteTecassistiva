import Image from 'next/image';
import React from 'react';
import { safeUrl } from '@/lib/safeUrl';

// Hosts permitidos para vídeos incorporados vindos do CMS
const ALLOWED_IFRAME_HOSTS = {
  'player.vimeo.com': () => true,
  'www.youtube.com': (pathname) => pathname.startsWith('/embed/'),
  'www.youtube-nocookie.com': (pathname) => pathname.startsWith('/embed/'),
};

// Extrai e valida o src de um <iframe ...> escrito no CMS; retorna null se não for permitido
const getAllowedIframeSrc = (html) => {
  const match = /<iframe[^>]*\ssrc\s*=\s*["']([^"']+)["']/i.exec(html);
  if (!match) return null;
  try {
    // O HTML escrito no CMS traz "&amp;" nas query strings; decodifica antes de validar
    const url = new URL(match[1].replace(/&amp;/g, '&'));
    const isAllowed = url.protocol === 'https:' && ALLOWED_IFRAME_HOSTS[url.hostname]?.(url.pathname);
    return isAllowed ? url.toString() : null;
  } catch {
    return null;
  }
};

const getIframeTitle = (html) => {
  const match = /<iframe[^>]*\stitle\s*=\s*["']([^"']*)["']/i.exec(html);
  return match?.[1] || 'Vídeo incorporado';
};

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
          const iframeSrc = getAllowedIframeSrc(node.text);
          if (!iframeSrc) return null;
          return (
            <div key={index} className="my-6 aspect-video w-full rounded-xl overflow-hidden shadow-sm">
              <iframe
                src={iframeSrc}
                title={getIframeTitle(node.text)}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
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
      case 'link': {
        const href = safeUrl(node.url);
        if (!href) return <span key={index}>{children}</span>;
        return <a key={index} href={href} className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors" style={{ lineHeight: '1.3' }} rel="noopener noreferrer">{children}</a>;
      }
      case 'image':
        return <Image key={index} src={node.image.url} alt={node.image.alternativeText || 'Imagem do conteúdo'} width={node.image.width || 800} height={node.image.height || 600} className="my-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300" />;
      default:
        return <div key={index}>{children}</div>;
    }
  };

  return <>{content.map((node, index) => renderNode(node, index))}</>;
}