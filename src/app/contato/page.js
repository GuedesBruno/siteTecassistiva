import Link from 'next/link';

export default function ContatoPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/">Página Inicial</Link>
        <span className="mx-2">&gt;</span>
        <span className="font-semibold text-gray-700">Contato</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-4xl font-extrabold">Contato</h1>
        <p className="text-gray-600 mt-3">Fale conosco para dúvidas, orçamentos e suporte.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded border">
          <h2 className="text-2xl font-semibold mb-4">Formulário de Contato</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input className="mt-1 block w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input className="mt-1 block w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mensagem</label>
              <textarea className="mt-1 block w-full border rounded p-2 h-32" />
            </div>
            <div>
              <button type="submit" className="bg-[#002554] text-white px-4 py-2 rounded">Enviar</button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded border">
          <h2 className="text-2xl font-semibold mb-4">Informações</h2>
          <p className="text-gray-700">Telefone: +55 (11) 3266-4311</p>
          <p className="text-gray-700 mt-2">Endereço: R. das Camélias, 37 - Mirandópolis, São Paulo - SP</p>
          <p className="text-gray-700 mt-4">Horário de Atendimento: Seg-Sex 9h-18h</p>
        </div>
      </section>
    </div>
  );
}
