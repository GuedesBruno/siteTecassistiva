'use client';

import { useState, useRef } from 'react';
import Accordion from './Accordion';
import { getStrapiMediaUrl } from '@/lib/api';
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
    const produtoData = item?.relacao_produto?.data?.attributes;

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
        const produtoData = item.produto?.data?.attributes;
        
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
                (typeof item.relacao_produto === 'string' && item.relacao_produto) || item.descricao || 'Produto não especificado'
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
          <div className="w-full md:w-2/3">
            {categoria && <p className="text-base font-medium text-gray-700 mb-1">{categoria}</p>}
            <h3 className="text-2xl font-bold text-tec-blue mb-2">{orgao}</h3>
            <p className="text-sm text-gray-600 font-semibold mb-4">Válido até {formatDate(validade)}</p>
            <div className="prose prose-sm max-w-none text-gray-700 [&>*:first-child]:mt-0">
              <RichTextRenderer content={descricao_adesao} />
            </div>
          </div>

          {/* Coluna Direita */}
          {itens && itens.length > 0 && (
            <div className="w-full md:w-1/3">
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">Itens da Ata</h4>
              <div className="max-h-48 overflow-y-auto pr-2">
                <div className="grid grid-cols-4 gap-1">
                  {itens.map((item) => {
                    const produtoData = item.relacao_produto?.data?.attributes;
                    const produtoNome = produtoData?.nome || (typeof item.produto === 'string' ? item.produto : item.descricao) || 'Produto';

                    return (
                        <button
                          key={item.id}
                          onClick={() => handleButtonClick(item.id)}
                          title={produtoNome}
                          className="text-center p-1 rounded bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 text-[10px] leading-tight"
                        >
                          {item.descricao}
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
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Documentos para Download:</h4>
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
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
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
