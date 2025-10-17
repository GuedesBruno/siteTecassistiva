import Link from 'next/link';

// Componente da Página
export default function TecassistivaPage() {
  return (
    <div className="bg-white">
      {/* O padding foi ajustado para ser responsivo */}
      <div className="container mx-auto px-4 md:px-12 lg:px-24 py-12">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:underline">Página Inicial</Link>
          <span className="mx-2">&gt;</span>
          <span className="font-semibold text-gray-700">A Tecassistiva</span>
        </div>

        {/* Seção Principal */}
        <section className="mb-5">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-8">Tecassistiva</h1>
          {/* Texto de apresentação em 2 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-lg text-justify text-gray-700 leading-relaxed">
            <p>
              A TECA foi fundada em 2007, visando atender a grande demanda reprimida de produtos e serviços de qualidade com preços competitivos, que impediam há muitos anos que as pessoas com deficiência no Brasil, tivessem acesso ao grande desenvolvimento tecnológico que vinha acontecendo em outros países.
            </p>
            <p>
              Atuando como fomentadora e alinhada com os projetos públicos, a TECA se tornou em poucos anos a lider do setor no Brasil e uma das maiores das distribuidoras internacionais de Tecnologia Assistiva.
            </p>
            <p>
              Esse crescimento exigiu o fortalecimento de seus canais de distribuição e de suporte, principalmente para o atendimento de milhares de escolas, bibliotecas, universidades e centros de pesquisa.
            </p>
            <p>
              Na área de desenvolvimento, além de localizar para o português do Brasil diversos programas de computador e equipamentos que distribui, a TECA está fazendo um investimento significativo, em conjunto com órgãos de fomento e parcerias internacionais, para que o Brasil em curto prazo, se torne também um desenvolvedor e produtor de Tecnologia Assistiva.
            </p>
          </div>
        </section>

        {/* Vídeo Institucional */}
        <section className="mb-0">
            <div className="w-full aspect-video bg-gray-300 shadow-lg flex items-center justify-center">
                <span className="text-gray-500">Vídeo Apresentação Teca</span>
            </div>
        </section>

        {/* Seção Missão, Visão e Valores com o novo layout */}
        <section className="bg-tec-blue-light text-white p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                    <h2 className="text-4xl font-extrabold mb-4">Missão</h2>
                    <p className="leading-relaxed">
                      Desenvolver e disseminar Tecnologia Assistiva no Brasil, por meio da oferta de produtos e serviços de excelência que contribuam para a melhoria da qualidade de vida das pessoas com deficiência e da comunidade em geral.
                    </p>
                </div>
                <div>
                    <h2 className="text-4xl font-extrabold mb-4">Visão</h2>
                    <p className="leading-relaxed">
                      Ser a empresa de referência em Tecnologia Assistiva, reconhecida pela comunidade, colaboradores, fornecedores e investidores, pela qualidade de seus produtos, serviços e apoio institucional.
                    </p>
                </div>

                <div>
                    <h2 className="text-4xl font-extrabold mb-4">Valores</h2>
                    <ul className="space-y-2 leading-relaxed">
                      <li>Valorização da Pessoa com Deficiência</li>
                      <li>Ética</li>
                      <li>Inovação</li>
                      <li>Trabalho em equipe</li>
                      <li>Qualidade</li>
                      <li>Sustentabilidade</li>
                    </ul>
                </div>
            </div>
        </section>

        {/* Seção de Depoimentos -  PRECISA TROCAR PARA O COMPONENTE */}
        <section className="bg-white py-8">
            <div>
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Depoimentos</h2>
                </div>
                <div className="bg-gray-100 p-8 rounded-lg shadow-md mx-auto">
                    <blockquote className="text-center text-gray-700 text-xl italic leading-loose">
                        <p>"E, na frente dos olhos incrédulos de Bianca, a linha braille transformou o texto de tinta para braille. “Peguei o livro que tinha acabado de comprar e coloquei sobre o Sara PC. Em segundos, a linha braille transformava letras em bolinhas! Eu comecei a viver de novo depois de comprar a linha braille", declara ela com alegria.” Agora, Bianca pede os livros didáticos da filha em formato PDF para as editoras e assim, Nicole lê-os na linha braille. Bianca calcula que, com a linha braille, ela economize por volta de 80% do tempo que dedicava à transcrição dos livros inteiros para filha".</p>
                    </blockquote>
                    <footer className="mt-6 text-center">
                        <p className="font-bold text-gray-900">Bianca Chaló Carlos Santos, mãe da Nicole Carlos Santos</p>
                        <p className="text-gray-500">Adquiriu a Linha Braille Focus 40.</p>
                    </footer>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
}