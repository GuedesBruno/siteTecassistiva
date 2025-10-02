'use client';

import { useState } from 'react';

// Adicionamos title e subtitle como props para máxima reutilização
export default function ContactForm({ title, subtitle }) {
  const [formData, setFormData] = useState({
    instituicao: '',
    nome: '',
    departamento: '',
    celular: '',
    email: '',
  });
  
  // Estado para fornecer feedback de envio ao usuário
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Enviando...');

    try {
      // Envia os dados do formulário para o endpoint do Formspree
      const response = await fetch(process.env.NEXT_PUBLIC_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(e.target),
      });

      if (response.ok) {
        setStatus('Obrigado pelo seu contato! Em breve retornaremos.');
        // Limpa o formulário após o envio bem-sucedido
        setFormData({
          instituicao: '',
          nome: '',
          departamento: '',
          celular: '',
          email: '',
        });
      } else {
        // Trata possíveis erros retornados pelo Formspree
        const data = await response.json();
        const errorMsg = data.errors?.map(err => err.message).join(', ') || 'Ocorreu um erro.';
        setStatus(`Erro ao enviar: ${errorMsg}`);
      }
    } catch (error) {
      // Trata erros de rede (ex: sem conexão com a internet)
      console.error('Erro de rede:', error);
      setStatus('Não foi possível enviar o formulário. Verifique sua conexão.');
    }
  };

  return (
    <div className="bg-gray-50 p-8 rounded-lg shadow-inner">
        {/* Renderiza os títulos recebidos via props */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">{title}</h2>
        <h3 className="text-xl text-center text-gray-600 mb-8">{subtitle}</h3>
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <input type="text" name="instituicao" value={formData.instituicao} onChange={handleChange} placeholder="Instituição*" required className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome*" required className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <input type="text" name="departamento" value={formData.departamento} onChange={handleChange} placeholder="Departamento" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <input type="tel" name="celular" value={formData.celular} onChange={handleChange} placeholder="Celular*" required className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mail*" required className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 md:col-span-2" />
            </div>
            <div className="text-center">
                <button type="submit" className="bg-tec-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105">Enviar Contato</button>
            </div>
            
            {/* Exibe a mensagem de status para o usuário */}
            {status && <p className="text-center text-sm text-gray-600 mt-4">{status}</p>}
        </form>
    </div>
  );
}