'use client';

import { useState } from 'react';

// Adicionamos a prop 'formName' para que a página possa se identificar
export default function ContactForm({ title, subtitle, formName }) {
  const [formData, setFormData] = useState({
    instituicao: '',
    nome: '',
    departamento: '',
    celular: '',
    email: '',
    mensagem: '',
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
        setFormData({
          instituicao: '',
          nome: '',
          departamento: '',
          celular: '',
          email: '',
          mensagem: '',
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
            {/* ✅ CAMPO OCULTO QUE DEFINE O ASSUNTO DO E-MAIL */}
            <input type="hidden" name="_subject" value={`Novo Contato via ${formName}`} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="instituicao" value={formData.instituicao} onChange={handleChange} placeholder="Instituição*" required className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome*" required className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <input type="text" name="departamento" value={formData.departamento} onChange={handleChange} placeholder="Departamento" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <input type="tel" name="celular" value={formData.celular} onChange={handleChange} placeholder="Celular*" required className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mail*" required className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 md:col-span-2" />
                
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
            <div className="text-center flex items-center justify-center space-x-4">
                <button type="submit" className="bg-tec-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105">Enviar Contato</button>
                <span className="text-gray-600">ou</span>
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105">
                    Fale agora
                </a>
            </div>
            
            {status && <p className="text-center text-sm text-gray-600 mt-4">{status}</p>}
        </form>
    </div>
  );
}