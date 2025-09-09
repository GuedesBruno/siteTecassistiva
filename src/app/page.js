import { getFeaturedProducts } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

// --- SUB-COMPONENTES PARA ORGANIZAÇÃO ---

// Componente para o Card de Produto
function ProductCard({ product }) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const { nome, slug, descricao_curta, imagem_principal } = product;
  const imageUrl = imagem_principal?.url;
  const fullImageUrl = imageUrl ? `${STRAPI_URL}${imageUrl}` : null;
  const imageAlt = imagem_principal?.alternativeText || `Imagem de ${nome}`;

  if (!slug) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col text-center">
      <div className="bg-blue-900 p-4 text-white rounded-t-lg">
        <h3 className="text-xl font-bold">{nome}</h3>
      </div>
      <div className="p-5 flex-grow flex flex-col items-center">
        <div className="relative h-48 w-full mb-4">
          {fullImageUrl ? (
            <Image
              src={fullImageUrl}
              alt={imageAlt}
              fill
              className="object-contain"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
              <p className="text-gray-400">Sem imagem</p>
            </div>
          )}
        </div>
        <p className="text-gray-600 text-sm flex-grow mb-4">{descricao_curta}</p>
        <Link href={`/produtos/${slug}`} className="text-blue-600 hover:underline mt-auto self-center font-semibold">
          Saiba mais...
        </Link>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL DA PÁGINA ---

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {/* Seção 1: Hero Principal "Brinca Braille" */}
      <section className="relative h-[60vh] text-white flex items-center bg-gray-800">
        <div className="absolute inset-0">
          {/* ============================================================
            ATUALIZAÇÃO: O nome do arquivo foi corrigido para o que você informou. 
            Adicione a extensão do arquivo (.jpg, .png, .webp).
            ============================================================
          */}
          <Image 
            src="/heroSectionBrincaBraille.jpg" // Assumindo que é .jpg, ajuste se for outro formato
            alt="Criança utilizando um brinquedo em braille"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">Brinca Braille</h1>
            <p className="text-xl md:text-2xl mb-6 drop-shadow-md">Aprender Braille nunca foi tão divertido, interativo e fácil!</p>
            <Link href="#" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105">
              Veja mais sobre Brinca Braille
            </Link>
          </div>
        </div>
      </section>

      {/* Seção 2: Sobre a Tecassistiva */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Tecassistiva</h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            A Tecassistiva foi fundada em 2007, visando atender a grande demanda reprimida de produtos e serviços de qualidade com preços competitivos, que impediam há muitos anos que as pessoas com deficiência no Brasil, tivessem acesso ao grande desenvolvimento tecnológico que vinha acontecendo em outros paises. O desenvolvimento de projetos inovadores para pessoas com deficiência, com sustentabilidade, tem sido o principal objetivo da Tecassistiva.
          </p>
          <Link href="#" className="text-blue-600 hover:underline font-semibold text-lg">
            Conheça a nossa história
          </Link>
        </div>
      </section>

      {/* Seção 3: Nossos Produtos em Destaque */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Nossos Produtos</h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
              Veja abaixo nossos destaques, a TECA possui mais de 50 produtos, as melhores tecnologias da acessibilidade hoje no mercado nacional e internacional!
            </p>
          </div>
          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Nenhum produto em destaque encontrado.</p>
          )}
          <div className="text-center mt-12">
            <Link href="/produtos" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 text-lg">
              Todos nossos produtos aqui
            </Link>
          </div>
        </div>
      </section>

      {/* Seção 4: Vídeos */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Vídeos</h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
               Abaixo temos alguns videos selecionados para que você possa conhecer um pouco mais do trabalho da TECA e dos produtos que possam te atender. Confira!
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                <div className="bg-gray-300 h-40 flex items-center justify-center">Vídeo {i}</div>
                <div className="p-4 bg-white">
                  <p className="font-semibold text-gray-800">Lorem ipsum dolor sit amet consecteu</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="#" className="inline-block bg-red-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-red-700">
              Nosso canal do Youtube
            </Link>
          </div>
        </div>
      </section>

      {/* Seção 5: Fornecedores */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Fornecedores</h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
              Trabalhamos com as melhores fabricantes de tecnologia assistiva do mercado mundial.
            </p>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-8 items-center">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex justify-center grayscale hover:grayscale-0 transition-all">
                <div className="w-24 h-12 bg-gray-300 rounded flex items-center justify-center text-gray-500">LOGO</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Seção 6: Depoimentos */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Depoimentos</h2>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg shadow-md">
            <blockquote className="text-center text-gray-700 text-xl italic leading-loose">
              <p>"{/* */}A Tecassistiva mais uma vez está de parabéns! já ouvi aulas de Excel, porém com tanta acessibilidade como neste curso, não. Tenho certeza que, quando encontrar uma tabela no formato de leitura do Excel agora posso acessar com autonomia..."</p>
            </blockquote>
            <footer className="mt-6 text-center">
              <p className="font-bold text-gray-900">Paulo Jose da Silva</p>
              <p className="text-gray-500">Aluno do Curso Domine Excel com JAWS</p>
            </footer>
          </div>
        </div>
      </section>
    </>
  );
}