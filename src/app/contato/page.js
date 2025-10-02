import Link from 'next/link';
import ContactForm from '@/components/ContactForm'; // Importa o componente reutilizável

export default function ContatoPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/">Página Inicial</Link>
        <span className="mx-2">&gt;</span>
        <span className="font-semibold text-gray-700">Contato</span>
      </nav>

      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold">Contato</h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Fale conosco para dúvidas, orçamentos e suporte. Preencha o formulário ou utilize um de nossos canais de atendimento.</p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna do Formulário - Ocupa 2/3 do espaço em telas grandes */}
        <div className="lg:col-span-2">
            <ContactForm 
                title="Formulário de Contato"
                subtitle="Envie sua mensagem e retornaremos o mais breve possível."
            />
        </div>

        {/* Coluna de Informações - Ocupa 1/3 do espaço */}
        <div className="bg-white p-6 rounded-lg border h-fit">
          <h2 className="text-2xl font-semibold mb-4">Informações</h2>
          <p className="text-gray-700"><strong>Telefone:</strong> +55 (11) 3266-4311</p>
          <p className="text-gray-700 mt-4
          "><strong>WhatsApp:</strong> +55 (11) 9 9597-8139</p>
          <p className="text-gray-700 mt-4"><strong>Email:</strong> teca@tecassistiva.com.br</p>
          <p className="text-gray-700 mt-4"><strong>Endereço:</strong> R. das Camélias, 37 - Mirandópolis, São Paulo - SP</p>
          <p className="text-gray-700 mt-4"><strong>Horário de Atendimento:</strong></p>
          <p className="text-gray-700">Seg-Qui 8h-18h e Sexta 8h-17h</p>
        </div>
      </section>
    </div>
  );
}