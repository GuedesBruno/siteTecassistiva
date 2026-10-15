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
    _gotcha: '', // honeypot: campo oculto que humanos não preenchem
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

    const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT;
    if (!endpoint) {
      setStatus('Erro: o formulário não está configurado no momento. Entre em contato pelo WhatsApp ou por e-mail.');
      return;
    }

    // Honeypot preenchido: provável robô. Finge sucesso sem enviar.
    if (formData._gotcha) {
      setStatus('Mensagem enviada com sucesso!');
      return;
    }

    setStatus('Enviando...');

    try {
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
          _gotcha: '',
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
      <p className="text-lg text-center text-gray-600 mb-6">{subtitle}</p>
      <form onSubmit={handleSubmit} className="space-y-2" aria-label="Formulário de contato">
        <input type="hidden" name="_subject" value={`Novo Contato via ${formName}`} />

        {/* Honeypot anti-spam: escondido de pessoas e de leitores de tela */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="_gotcha">Não preencha este campo</label>
          <input
            type="text"
            id="_gotcha"
            name="_gotcha"
            value={formData._gotcha}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Primeira linha: Nome, Instituição, Departamento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome <span className="text-red-700" aria-hidden="true">*</span><span className="sr-only"> (obrigatório)</span>
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              autoComplete="name"
              maxLength={100}
              value={formData.nome}
              onChange={handleChange}
              required
              aria-required="true"
              className="p-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm"
            />
          </div>

          {/* Instituição */}
          <div>
            <label htmlFor="instituicao" className="block text-sm font-medium text-gray-700 mb-1">
              Instituição <span className="text-red-700" aria-hidden="true">*</span><span className="sr-only"> (obrigatório)</span>
            </label>
            <input
              type="text"
              id="instituicao"
              name="instituicao"
              autoComplete="organization"
              maxLength={150}
              value={formData.instituicao}
              onChange={handleChange}
              required
              aria-required="true"
              className="p-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm"
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
              maxLength={100}
              value={formData.departamento}
              onChange={handleChange}
              className="p-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm"
            />
          </div>
        </div>

        {/* Segunda linha: Celular, E-mail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Celular */}
          <div>
            <label htmlFor="celular" className="block text-sm font-medium text-gray-700 mb-1">
              Celular <span className="text-red-700" aria-hidden="true">*</span><span className="sr-only"> (obrigatório)</span>
            </label>
            <input
              type="tel"
              id="celular"
              name="celular"
              autoComplete="tel"
              maxLength={20}
              value={formData.celular}
              onChange={handleChange}
              required
              aria-required="true"
              className="p-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm"
            />
          </div>

          {/* E-mail */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail <span className="text-red-700" aria-hidden="true">*</span><span className="sr-only"> (obrigatório)</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              maxLength={254}
              value={formData.email}
              onChange={handleChange}
              required
              aria-required="true"
              className="p-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm"
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
            maxLength={2000}
            placeholder="Digite sua dúvida ou solicitação"
            className="p-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm placeholder:text-gray-600"
          />
        </div>

        {/* Botões - mais próximos da mensagem */}
        <div className="text-center flex items-center justify-center space-x-4 pt-2">
          <button
            type="submit"
            className="bg-tec-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105 text-sm"
          >
            Enviar Contato
          </button>
          <span className="text-gray-600 text-sm">ou</span>
          <a
            href="https://wa.me/5511995978139"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-800 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105 text-sm"
          >
            Fale agora<span className="sr-only"> (abre em nova aba)</span>
          </a>
        </div>

        <p className="text-xs text-gray-600 text-center">
          Ao enviar, você concorda que a Tecassistiva use seus dados apenas para responder a esta solicitação (LGPD).
        </p>

        {/* Região de status sempre presente no DOM: "Enviando..." e sucesso são anunciados de forma educada */}
        <div
          role="status"
          aria-live="polite"
          className={status && status.includes('sucesso') ? 'text-center mt-4 p-3 rounded bg-green-100 text-green-800' : ''}
        >
          {status && (status === 'Enviando...' || status.includes('sucesso')) ? status : ''}
        </div>
        {/* Somente erro de envio usa role="alert", para ser anunciado imediatamente */}
        {status && status !== 'Enviando...' && !status.includes('sucesso') && (
          <div role="alert" className="text-center mt-4 p-3 rounded bg-red-100 text-red-800">
            {status}
          </div>
        )}
      </form>
    </div>
  );
}