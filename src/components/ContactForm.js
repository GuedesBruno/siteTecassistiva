'use client';

import { useState } from 'react';

export default function ContactForm({ title, subtitle }) {
  const [formData, setFormData] = useState({
    instituicao: '',
    nome: '',
    departamento: '',
    celular: '',
    email: '',
    mensagem: '', // <-- Novo campo adicionado ao estado
  });
  
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Enviando...');

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(e.target),
      });

      if (response.ok) {
        setStatus('Obrigado pelo seu contato! Em breve retornaremos.');
        // Limpa o formulário, incluindo o novo campo
        setFormData({
          instituicao: '',
          nome: '',
          departamento: '',
          celular: '',
          email: '',
          mensagem: '', // <-- Limpa o novo campo
        });
      } else {
        const data = await response.json();
        const errorMsg = data.errors?.map(err => err.message).join(', ') || 'Ocorreu um erro.';
        setStatus(`Erro ao enviar: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      setStatus('Não foi possível enviar o formulário. Verifique sua conexão.');
    }
  };

  return (
    <div className="bg-gray-50 p-8 rounded-lg shadow-inner">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">{title}</h2>
        <h3 className="text-xl text-center text-gray-600 mb-8">{subtitle}</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="instituicao" value={formData.instituicao} onChange={handleChange} placeholder="Instituição*" required className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome*" required className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <input type="text" name="departamento" value={formData.departamento} onChange={handleChange} placeholder="Departamento" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <input type="tel" name="celular" value={formData.celular} onChange={handleChange} placeholder="Celular*" required className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mail*" required className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 md:col-span-2" />
                
                {/* ✅ NOVO CAMPO DE MENSAGEM ADICIONADO AQUI */}
                <div className="md:col-span-2">
                    <textarea 
                        name="mensagem" 
                        value={formData.mensagem} 
                        onChange={handleChange} 
                        placeholder="Digite sua dúvida ou solicitação..." 
                        rows="4" 
                        className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    />
                </div>
            </div>
            <div className="text-center">
                <button type="submit" className="bg-tec-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105">Enviar Contato</button>
            </div>
            
            {status && <p className="text-center text-sm text-gray-600 mt-4">{status}</p>}
        </form>
    </div>
  );
}