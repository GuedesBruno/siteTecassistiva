import Link from 'next/link';
import ContactForm from '@/components/ContactForm';

export default function ContatoPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/">Página Inicial</Link>
        <span className="mx-2" aria-hidden="true">&gt;</span>
        <span className="font-semibold text-gray-700">Contato</span>
      </nav>

      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold">Contato</h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Fale conosco para dúvidas, orçamentos e suporte. Preencha o formulário ou utilize um de nossos canais de atendimento.</p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna do Formulário */}
        <div className="lg:col-span-2">
            <ContactForm 
                title="Formulário de Contato"
                subtitle="Envie sua mensagem e retornaremos o mais breve possível."
                formName="Página de Contato"
            />
        </div>

        {/* Coluna de Informações */}
        <div className="bg-white p-6 rounded-lg border h-fit">
          <h2 className="text-2xl font-semibold mb-4">Informações</h2>
          <p className="text-gray-700"><strong>Telefone:</strong> +55 (11) 3266-4311</p>
          <p className="text-gray-700 mt-4"><strong>WhatsApp:</strong> +55 (11) 9 9597-8139</p>
          <p className="text-gray-700 mt-4"><strong>Email:</strong> teca@tecassistiva.com.br</p>
          <p className="text-gray-700 mt-4"><strong>Endereço:</strong> R. das Camélias, 37 - Mirandópolis, São Paulo - SP</p>
          <p className="text-gray-700 mt-4"><strong>Horário de Atendimento:</strong></p>
          <p className="text-gray-700">Seg-Qui 8h-18h e Sexta 8h-17h</p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-extrabold text-center mb-8">Nossa Localização</h2>
        <div className="w-full overflow-hidden rounded-lg shadow-lg">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.9935919417994!2d-46.642828889231275!3d-23.604562763091913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5a37343224f3%3A0xe4270a2659bfe78f!2sTecassistiva%20-%20Tecnologia%20%26%20Acessibilidade!5e0!3m2!1spt-BR!2sbr!4v1760723939741!5m2!1spt-BR!2sbr" 
            width="100%" 
            height="450" 
            className="border-0" 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </section>
    </div>
  );
}