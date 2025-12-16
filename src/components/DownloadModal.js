import React from 'react';
import { FaTimes, FaDownload } from 'react-icons/fa';
import RichTextRenderer from './RichTextRenderer';

export default function DownloadModal({ isOpen, onClose, version, softwareName, links }) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                style={{ padding: '24px' }}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 id="modal-title" className="text-xl font-bold text-[#002554] mb-1">
                            {softwareName}
                        </h2>
                        <p className="text-sm text-gray-600">
                            Versão {version}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        aria-label="Fechar modal de download"
                    >
                        <FaTimes size={20} aria-hidden="true" />
                    </button>
                </div>

                {/* Content */}
                <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <FaDownload className="mr-2 text-[#002554]" size={14} aria-hidden="true" />
                        Opções de Download
                    </h3>

                    {links ? (
                        <div className="space-y-2" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                            <RichTextRenderer content={links} />
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">
                            Nenhum link de download disponível para esta versão.
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 mt-6 pt-4">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded transition-colors"
                        aria-label="Fechar modal"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
