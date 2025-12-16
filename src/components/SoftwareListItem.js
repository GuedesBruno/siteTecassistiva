import React, { useState } from 'react';
import { FaCodeBranch, FaChevronLeft, FaChevronRight, FaDownload } from 'react-icons/fa';
import DownloadModal from './DownloadModal';

export default function SoftwareListItem({ software }) {
  const { nome, instaladores, descricao } = software.attributes;
  const insts = Array.isArray(instaladores) ? instaladores : (instaladores ? [instaladores] : []);

  const [startIndex, setStartIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const itemsPerPage = 4;

  const handleNext = () => {
    if (startIndex + itemsPerPage < insts.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const openModal = (inst) => {
    setSelectedVersion(inst);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedVersion(null);
  };

  const visibleInsts = insts.slice(startIndex, startIndex + itemsPerPage);
  const showArrows = insts.length > itemsPerPage;

  const containerStyle = {
    padding: '16px',
    fontSize: '10px',
    backgroundColor: '#ffffff'
  };

  const titleStyle = {
    fontSize: '16px',
    lineHeight: '1.2',
    marginBottom: '4px',
    color: '#002554'
  };

  const descStyle = {
    fontSize: '12px',
    lineHeight: '1.3',
    margin: '0',
    color: '#6b7280'
  };

  const cardStyle = {
    minHeight: '70px',
    padding: '10px',
    fontSize: '10px',
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0'
  };

  const versionStyle = {
    fontSize: '12px',
    padding: '4px 10px',
    lineHeight: '1',
    backgroundColor: '#dbeafe',
    color: '#002554'
  };

  return (
    <>
      <div
        className="bg-white border-2 border-gray-300 shadow-lg rounded-xl mb-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-400 hover:bg-blue-50"
        style={containerStyle}
      >
        {/* Header com linha divisória */}
        <div className="border-b-2 border-gray-200 pb-3 mb-4">
          <h3 className="font-bold" style={titleStyle}>
            {nome}
          </h3>
          {descricao && (
            <p className="line-clamp-1" style={descStyle}>
              {descricao}
            </p>
          )}
        </div>

        {/* Versões */}
        {insts.length > 0 && (
          <div className="relative">
            {showArrows && (
              <>
                <button
                  onClick={handlePrev}
                  disabled={startIndex === 0}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-md bg-white border border-gray-200 hover:bg-gray-50 transition-all ${startIndex === 0 ? 'opacity-0 cursor-default' : 'hover:scale-110'}`}
                  style={{
                    marginLeft: '-12px',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    color: '#002554'
                  }}
                  aria-label="Ver versões anteriores"
                >
                  <FaChevronLeft size={12} aria-hidden="true" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={startIndex + itemsPerPage >= insts.length}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-md bg-white border border-gray-200 hover:bg-gray-50 transition-all ${startIndex + itemsPerPage >= insts.length ? 'opacity-0 cursor-default' : 'hover:scale-110'}`}
                  style={{
                    marginRight: '-12px',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    color: '#002554'
                  }}
                  aria-label="Ver próximas versões"
                >
                  <FaChevronRight size={12} aria-hidden="true" />
                </button>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 mx-0.5" style={{ gap: '8px' }}>
              {visibleInsts.map((inst) => (
                <div
                  key={inst.id}
                  className="border rounded hover:border-blue-300 hover:shadow-sm transition-all duration-200 flex flex-col"
                  style={cardStyle}
                  role="article"
                  aria-label={`Versão ${inst.versao || 'não disponível'} de ${nome}`}
                >
                  <div style={{ marginBottom: '8px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                    {inst.versao ? (
                      <div
                        className="inline-flex items-center font-semibold rounded"
                        style={versionStyle}
                      >
                        <FaCodeBranch className="mr-1.5" size={10} aria-hidden="true" />
                        {inst.versao}
                      </div>
                    ) : (
                      <span className="font-medium text-gray-400" style={{ fontSize: '12px', lineHeight: '1' }}>
                        Versão n/d
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => openModal(inst)}
                    className="mt-auto bg-[#002554] hover:bg-[#003d7a] text-white font-medium rounded transition-all duration-200 flex items-center justify-center gap-1.5"
                    style={{
                      fontSize: '11px',
                      padding: '6px 8px'
                    }}
                    aria-label={`Baixar ${nome} versão ${inst.versao || 'não disponível'}`}
                  >
                    <FaDownload size={10} aria-hidden="true" />
                    Baixar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedVersion && (
        <DownloadModal
          isOpen={modalOpen}
          onClose={closeModal}
          version={selectedVersion.versao || 'N/D'}
          softwareName={nome}
          links={selectedVersion.links}
        />
      )}
    </>
  );
}