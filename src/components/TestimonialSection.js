export default function TestimonialSection({ depoimento }) {
  if (!depoimento) return null;

  // Adaptado para a estrutura de dados "flat" que a API está retornando.
  const { texto, autor, descricao_autor } = depoimento;

  return (
    <section className="bg-tec-blue-light py-20 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold">Depoimentos</h2>
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl italic leading-relaxed mb-8">
            <span className="text-4xl leading-none font-serif">&ldquo;</span>
            {texto}
            <span className="text-4xl leading-none font-serif">&rdquo;</span>
          </blockquote>
          <footer className="text-lg">
            <p className="font-bold">{autor}</p>
            <p className="opacity-80">{descricao_autor}</p>
          </footer>
        </div>
        {/* Indicadores de navegação estáticos para sugerir um futuro carrossel */}
        <div className="flex justify-center space-x-2 mt-12">
          <span className="block w-3 h-3 bg-white rounded-full"></span>
          <span className="block w-3 h-3 bg-white opacity-50 rounded-full"></span>
          <span className="block w-3 h-3 bg-white opacity-50 rounded-full"></span>
        </div>
      </div>
    </section>
  );
}