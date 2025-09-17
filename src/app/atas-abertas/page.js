export default function AtasAbertasPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/">Página Inicial</a>
        <span className="mx-2">&gt;</span>
        <span className="font-semibold text-gray-700">Atas Abertas</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-4xl font-extrabold">Atas Abertas</h1>
        <p className="text-gray-600 mt-3">Lista de atas e documentos públicos relacionados à Tecassistiva.</p>
      </header>

      <section>
        <p className="text-gray-700">Neste espaço serão disponibilizadas as atas de reuniões, assembleias e documentos oficiais. Por enquanto este é um espaço reservado para futuras publicações.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded bg-white">
            <h3 className="font-semibold">Ata - 01/2024</h3>
            <p className="text-sm text-gray-500 mt-2">Reunião ordinária realizada em 01/01/2024 — link para download.</p>
          </div>
          <div className="p-4 border rounded bg-white">
            <h3 className="font-semibold">Ata - 12/2023</h3>
            <p className="text-sm text-gray-500 mt-2">Reunião extraordinária — link para download.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
