import Accordion from './Accordion';
import { getStrapiMediaUrl } from '@/lib/api';
import RichTextRenderer from './RichTextRenderer';

function formatDate(dateString) {
  if (!dateString) return 'Data não informada';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(date);
}

export default function AtaCard({ ata }) {
  const { titulo, validade, descricao_adesao, lista_de_itens, documentos } = ata.attributes;

  const docs = documentos?.data;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md mb-6 overflow-hidden">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-tec-blue mb-2">{titulo}</h3>
        <p className="text-sm text-gray-600 font-semibold mb-4">Válido até {formatDate(validade)}</p>
        
        <div className="prose prose-sm max-w-none text-gray-700 mb-4">
          <RichTextRenderer content={descricao_adesao} />
        </div>
        
        {lista_de_itens && (
          <Accordion 
            title="Ver Itens" 
            content={<RichTextRenderer content={lista_de_itens} />} 
          />
        )}

        {docs && docs.length > 0 && (
          <div className="pt-4">
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
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      {docAttributes.name}
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