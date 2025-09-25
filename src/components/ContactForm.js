'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    instituicao: '',
    nome: '',
    departamento: '',
    celular: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual form submission logic (e.g., API call)
    console.log('Form data submitted:', formData);
    alert('Obrigado pelo seu contato! Em breve retornaremos.');
    // Reset form
    setFormData({
        instituicao: '',
        nome: '',
        departamento: '',
        celular: '',
        email: '',
    });
  };

  return (
    <div className="bg-gray-50 p-8 rounded-lg shadow-inner">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Queremos diminuir o seu trabalho</h2>
        <h3 className="text-xl text-center text-gray-600 mb-8">Preencha o formulário abaixo com o seu contato:</h3>
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
        </form>
    </div>
  );
}
