import { getOpenAtas } from '@/lib/api';
import Breadcrumbs from '@/components/Breadcrumbs';
import AtaCard from '@/components/AtaCard';
import ContactForm from '@/components/ContactForm';
import AdvantagesSection from '@/components/AdvantagesSection';
import SocialMediaSection from '@/components/SocialMediaSection';

export const metadata = {
  title: 'Atas Abertas | Tecassistiva',
  description: 'Consulte as Atas de Registro de Preços (ARP) disponíveis e saiba como fazer a adesão.',
};

export default async function AtasAbertasPage() {
  const atas = await getOpenAtas();

  const breadcrumbs = [
    { name: 'Página Inicial', path: '/' },
    { name: 'Atas Abertas', path: '/atas-abertas' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbs} />

      {/* 1. Seção de Título e Introdução */}
      <section className="my-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Atas Abertas</h1>
        <div className="prose max-w-4xl mx-auto text-center text-gray-700 mb-10">
          <p className="text-lg">
            Você sabe o que é um Sistema de Registro de Preço (SRP)? <br />
            Se você já conhece, <a href="#lista-atas" className="text-blue-600 hover:underline font-semibold">clique aqui e acesse as ATAS abertas</a>.
          </p>
        </div>
        <div className="prose max-w-4xl mx-auto text-gray-700">
            <h2 className="text-2xl font-bold text-center">O que é o Sistema de Registro de Preços – SRP?</h2>
            <p className="text-justify">Placeholder: O Sistema de Registro de Preços (SRP) é um procedimento especial de licitação que seleciona a proposta mais vantajosa para futuras e eventuais contratações governamentais. Em vez de realizar uma licitação para cada compra, o órgão público registra os preços de produtos e serviços de fornecedores qualificados, que se comprometem a manter a oferta por um período determinado (geralmente 12 meses).</p>
            <h2 className="text-2xl font-bold text-center mt-8">O que é uma Ata de Registro de Preços – ARP?</h2>
            <p className="text-justify">Placeholder: A Ata de Registro de Preços (ARP) é o documento que formaliza o resultado do SRP. Nela, são registrados os preços, os fornecedores, os produtos e as condições de fornecimento. Essa ata funciona como um "cardápio" de produtos e serviços que os órgãos públicos podem adquirir de forma ágil e sem a necessidade de um novo processo licitatório completo, bastando apenas emitir uma ordem de compra.</p>
            <div className="text-center mt-8">
                    <a href="#vantagens-carona" className="bg-blue-600 text-white font-bold py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-[11px] sm:text-sm md:text-base whitespace-nowrap">Queremos te contar mais, clique aqui.</a>
            </div>
        </div>
      </section>

      {/* 2. Seção da Lista de Atas */}
      <section id="lista-atas" className="my-16 scroll-mt-20">
        <h2 className="text-3xl font-bold text-gray-800 text-center border-b-2 border-gray-200 pb-4 mb-10">
            Lista de ATAS disponíveis para você:
        </h2>
        <div>
          {atas && atas.length > 0 ? (
            atas.map((ata) => <AtaCard key={ata.id} ata={ata} />)
          ) : (
            <div className="text-center py-12">
                <p className="text-lg text-gray-600">Nenhuma ata aberta encontrada no momento.</p>
                <p className="text-md text-gray-500 mt-2">Por favor, verifique novamente mais tarde ou entre em contato para mais informações.</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Seção do Formulário de Contato */}
      <section id="contact-form" className="my-16 scroll-mt-20">
        <ContactForm 
          title="Queremos diminuir o seu trabalho"
          subtitle="Preencha o formulário abaixo com o seu contato:"
          formName="Página de Atas Abertas" 
        />
      </section>

      {/* 4. Seção de Vantagens */}
      <section id="vantagens-carona" className="my-16 scroll-mt-20">
        <AdvantagesSection />
      </section>
    </div>
  );
}