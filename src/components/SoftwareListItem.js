import React from 'react';
import RichTextRenderer from './RichTextRenderer';

export default function SoftwareListItem({ software }) {
  const { nome, instaladores } = software.attributes;

  const insts = Array.isArray(instaladores) ? instaladores : (instaladores ? [instaladores] : []);

  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      <h3 className="text-lg font-bold text-gray-800">{nome}</h3>
      
      {insts.length > 0 && (
        <div className="pl-4 mt-3">
          {insts.map((inst) => (
            <div key={inst.id} className="pt-3 first:pt-0 mt-3 first:mt-0 border-t border-gray-200 first:border-t-0">
              {inst.versao && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-gray-600">Versão:</span>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {inst.versao}
                  </span>
                </div>
              )}
              {inst.links && <RichTextRenderer content={inst.links} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}