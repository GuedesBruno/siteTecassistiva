export default function SuportePage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/">Página Inicial</a>
        <span className="mx-2">&gt;</span>
        <span className="font-semibold text-gray-700">Suporte</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-4xl font-extrabold">Suporte</h1>
        <p className="text-gray-600 mt-3">Suporte técnico, downloads e materiais de ajuda.</p>
      </header>

      <section>
        <p className="text-gray-700">Encontre drivers, manuais e atualizações de software para os produtos Tecassistiva. Caso não encontre o material desejado, entre em contato conosco através da página de contato.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded bg-white">
            <h3 className="font-semibold">Documentação</h3>
            <p className="text-sm text-gray-500 mt-2">Manuais e guias de instalação.</p>
          </div>
          <div className="p-4 border rounded bg-white">
            <h3 className="font-semibold">Downloads</h3>
            <p className="text-sm text-gray-500 mt-2">Drivers, atualizações e utilitários.</p>
          </div>
          <div className="p-4 border rounded bg-white">
            <h3 className="font-semibold">Suporte Remoto</h3>
            <p className="text-sm text-gray-500 mt-2">Agende atendimento remoto com nossa equipe.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
