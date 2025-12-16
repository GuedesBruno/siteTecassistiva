'use client';

import { useState } from 'react';

export default function ContactForm({ title, subtitle, formName }) {
  const [formData, setFormData] = useState({
    instituicao: '',
    nome: '',
    departamento: '',
    celular: '',
    email: '',
    mensagem: '',
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Enviando...');

    try {
      const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT || 'https://formspree.io/f/YOUR_FORM_ID';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          _subject: `Novo Contato via ${formName}`,
        }),
      });

      if (response.ok) {
        setStatus('Mensagem enviada com sucesso!');
        setFormData({
          instituicao: '',
          nome: '',
          departamento: '',
          celular: '',
          email: '',
          mensagem: '',
        });
      } else {
        setStatus('Erro ao enviar mensagem. Tente novamente.');
      }
    } catch (error) {
      setStatus('Erro ao enviar mensagem. Tente novamente.');
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">{title}</h2>
      <h3 className="text-lg text-center text-gray-600 mb-6">{subtitle}</h3>
      <form onSubmit={handleSubmit} className="space-y-2" aria-label="Formulário de contato">
        <input type="hidden" name="_subject" value={`Novo Contato via ${formName}`} />

        {/* Primeira linha: Nome, Instituição, Departamento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome <span className="text-red-500" aria-label="obrigatório">*</span>
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              aria-required="true"
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm"
            />
          </div>

          {/* Instituição */}
          <div>
            <label htmlFor="instituicao" className="block text-sm font-medium text-gray-700 mb-1">
              Instituição <span className="text-red-500" aria-label="obrigatório">*</span>
            </label>
            <input
              type="text"
              id="instituicao"
              name="instituicao"
              value={formData.instituicao}
              onChange={handleChange}
              required
              aria-required="true"
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm"
            />
          </div>

          {/* Departamento */}
          <div>
            <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-1">
              Departamento
            </label>
            <input
              type="text"
              id="departamento"
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm"
            />
          </div>
        </div>

        {/* Segunda linha: Celular, E-mail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Celular */}
          <div>
            <label htmlFor="celular" className="block text-sm font-medium text-gray-700 mb-1">
              Celular <span className="text-red-500" aria-label="obrigatório">*</span>
            </label>
            <input
              type="tel"
              id="celular"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              required
              aria-required="true"
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm"
            />
          </div>

          {/* E-mail */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail <span className="text-red-500" aria-label="obrigatório">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              aria-required="true"
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm"
            />
          </div>
        </div>

        {/* Terceira linha: Mensagem */}
        <div>
          <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">
            Mensagem
          </label>
          <textarea
            id="mensagem"
            name="mensagem"
            value={formData.mensagem}
            onChange={handleChange}
            rows="3"
            placeholder="Digite sua dúvida ou solicitação"
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm"
            aria-describedby="mensagem-hint"
          />
        </div>

        {/* Botões - mais próximos da mensagem */}
        <div className="text-center flex items-center justify-center space-x-4 pt-2">
          <button
            type="submit"
            className="bg-tec-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105 text-sm"
          >
            Enviar Contato
          </button>
          <span className="text-gray-600 text-sm">ou</span>
          <a
            href="https://wa.me/5511995978139"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105 text-sm"
          >
            Fale agora
          </a>
        </div>

        {status && (
          <div
            role="status"
            aria-live="polite"
            className={`text-center mt-4 p-3 rounded ${status.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
          >
            {status}
          </div>
        )}
      </form>
    </div>
  );
}