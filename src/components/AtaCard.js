'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Accordion from './Accordion';
import { getStrapiMediaUrl } from '@/lib/media';
import RichTextRenderer from './RichTextRenderer';

function formatDate(dateString) {
  if (!dateString) return 'Data não informada';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(date);
}

export default function AtaCard({ ata }) {
  const attributes = ata.attributes || ata;
  const { orgao, categoria, validade, descricao_adesao, item_ata, documentos } = attributes;

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [highlightedItemId, setHighlightedItemId] = useState(null);
  const itemRefs = useRef({});

  const itens = item_ata || [];
  const docs = documentos?.data;

  const handleButtonClick = (itemId) => {
    if (!isAccordionOpen) {
      setIsAccordionOpen(true);
    }

    setHighlightedItemId(itemId);

    const item = itens.find(i => i.id === itemId);
    const produtoData = item?.relacao_produto;

    if (produtoData && produtoData.slug) {
      window.open(`/produtos/${produtoData.slug}`, '_blank', 'noopener,noreferrer');
    }

    setTimeout(() => {
      const element = itemRefs.current[itemId];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300); // Atraso para permitir que o accordion abra

    setTimeout(() => {
      setHighlightedItemId(null);
    }, 2500); // Duração do destaque
  };

  const ItensContent = () => (
    <div className="space-y-4">
      {itens.map((item) => {
        const isHighlighted = item.id === highlightedItemId;
        const produtoData = item.relacao_produto;

        return (
          <div
            key={item.id}
            ref={(el) => (itemRefs.current[item.id] = el)}
            className={`p-4 border border-gray-200 rounded-md bg-gray-50 transition-all duration-500 ${isHighlighted ? 'ring-2 ring-tec-blue' : ''}`}>
            <p className="font-bold text-tec-blue">
              Item {item.numero_item}:{' '}
              {produtoData && produtoData.slug ? (
                <a
                  href={`/produtos/${produtoData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {produtoData.nome}
                </a>
              ) : (
                produtoData?.nome || item.descricao || 'Produto não especificado'
              )}
            </p>
            {item.categoria && <p className="text-sm text-gray-600 mt-2"><strong>Categoria:</strong> {item.categoria}</p>}
            {item.quantidade_carona && <p className="text-sm text-gray-600"><strong>Quantidade para "Carona":</strong> {item.quantidade_carona}</p>}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md mb-6 overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 md:items-start">
          {/* Coluna Esquerda */}
          <div className="w-full md:w-1/2">
            {categoria && <p className="text-base font-medium text-gray-700 mb-1">{categoria}</p>}
            <h3 className="text-2xl font-bold text-tec-blue mb-2">{orgao}</h3>
            <p className="text-sm text-gray-600 font-semibold mb-4">Válido até {formatDate(validade)}</p>
            <div className="prose prose-sm max-w-none text-gray-700 [&>*:first-child]:mt-0">
              <RichTextRenderer content={descricao_adesao} />
            </div>
          </div>

          {/* Coluna Direita */}
          {itens && itens.length > 0 && (
            <div className="w-full md:w-1/2">
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">Itens da Ata</h4>
              <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-4 lg:grid-cols-8 gap-1.5">
                  {itens.map((item) => {
                    const produtoData = item.relacao_produto?.data?.attributes || item.relacao_produto;
                    const produtoNome = produtoData?.nome || (typeof item.relacao_produto === 'string' ? item.relacao_produto : item.descricao) || 'Produto';

                    // Try to access image URL with various possible structures
                    const imgData = produtoData?.imagem_principal;
                    let imagemUrl = getStrapiMediaUrl(imgData?.data?.attributes?.url);

                    // Fallback for flat structure or direct object
                    if (!imagemUrl && imgData?.url) {
                      imagemUrl = getStrapiMediaUrl(imgData.url);
                    }

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleButtonClick(item.id)}
                        title={produtoNome}
                        className="flex flex-col items-center justify-start p-1 rounded-md bg-white border border-gray-200 hover:border-tec-blue hover:shadow-md focus:outline-none focus:ring-1 focus:ring-tec-blue transition-all duration-200 group h-full"
                      >
                        <div className="w-full aspect-square relative mb-1 bg-gray-50 rounded-sm overflow-hidden">
                          {imagemUrl ? (
                            <Image
                              src={imagemUrl}
                              alt={produtoNome}
                              fill
                              className="object-contain p-0.5 mix-blend-multiply"
                              sizes="(max-width: 768px) 25vw, 12vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] leading-tight text-gray-700 font-medium group-hover:text-tec-blue line-clamp-2 w-full break-words">
                          {produtoNome}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {itens && itens.length > 0 && (
          <div className="mt-4">
            <Accordion
              title="Ver Itens"
              content={<ItensContent />}
              isOpen={isAccordionOpen}
              onToggle={() => setIsAccordionOpen(!isAccordionOpen)}
            />
          </div>
        )}

        {docs && docs.length > 0 && (
          <div className="pt-4 mt-4 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Documentos da Ata:</h4>
            <ul className="space-y-2">
              {docs.map((doc) => {
                const docAttributes = doc.attributes;
                const fileUrl = getStrapiMediaUrl(docAttributes.url);
                return (
                  <li key={doc.id}>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Visualizar ${docAttributes.name} em nova aba`}
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 flex items-center"
                    >
                      {/* Ícone de "abrir em nova aba" */}
                      <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                      <span>{docAttributes.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
