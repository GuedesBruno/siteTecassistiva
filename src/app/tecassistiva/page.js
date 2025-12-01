import Link from 'next/link';
import Image from 'next/image';
import TestimonialSection from '@/components/TestimonialSection';
import SocialMediaSection from '@/components/SocialMediaSection';

// Lazy load API functions to avoid compilation during SSG
async function getAllTestimonials() {
  const { getAllTestimonials: _getAllTestimonials } = await import('@/lib/api');
  return _getAllTestimonials();
}

// Componente da Página
export default async function TecassistivaPage() {
  const testimonials = await getAllTestimonials();

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
            <div>
              <p className="mb-6">
                A Tecassistiva é uma empresa brasileira especializada em soluções de tecnologia assistiva voltadas para a inclusão educacional e social de pessoas com deficiência.
              </p>
              <p className="mb-6">
                Atuamos há mais de duas décadas oferecendo equipamentos, softwares e serviços que ampliam a autonomia, o acesso à informação e as oportunidades de aprendizagem para estudantes, profissionais e instituições em todo o país.
              </p>
              <p>
                Nosso compromisso é entregar tecnologia que transforma vidas. Por isso desenvolvemos e representamos soluções de alto desempenho para pessoas com deficiência visual e outras necessidades específicas, atendendo escolas, secretarias de educação, universidades, empresas e órgãos públicos com excelência e responsabilidade.
              </p>
            </div>
            <div>
              <p className="mb-6">
                Trabalhamos lado a lado com educadores, gestores e equipes técnicas para garantir diagnósticos precisos, implementações eficientes e suporte contínuo. Mais do que fornecer produtos, construímos projetos completos que fortalecem políticas de inclusão, aprimoram processos e garantem resultados reais na prática.
              </p>
              <p>
                A Tecassistiva acredita que acessibilidade não é apenas um serviço, é um valor, uma causa e um compromisso permanente com um Brasil mais inclusivo, justo e conectado às necessidades de todos.
              </p>
            </div>
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
                    <h2 className="text-align: justify text-4xl font-extrabold mb-4">Missão</h2>
                    <p className="leading-relaxed">
                      Desenvolver e disseminar Tecnologia Assistiva no Brasil, por meio da oferta de produtos e serviços de excelência que contribuam para a melhoria da qualidade de vida das pessoas com deficiência e da comunidade em geral.
                    </p>
                </div>
                <div>
                    <h2 className="text-align: justify text-4xl font-extrabold mb-4">Visão</h2>
                    <p className="leading-relaxed">
                      Ser a empresa de referência em Tecnologia Assistiva, reconhecida pela comunidade, colaboradores, fornecedores e investidores, pela qualidade de seus produtos, serviços e apoio institucional.
                    </p>
                </div>

                <div>
                    <h2 className="text-4xl font-extrabold mb-4">Valores</h2>
                    <ul className="space-y-2 leading-relaxed">
                      <li>•Valorização da Pessoa com Deficiência</li>
                      <li>•Ética</li>
                      <li>•Inovação</li>
                      <li>•Trabalho em equipe</li>
                      <li>•Qualidade</li>
                      <li>•Sustentabilidade</li>
                    </ul>
                </div>
            </div>
        </section>

        <SocialMediaSection />

        <TestimonialSection depoimentos={testimonials || []} />

      </div>
    </div>
  );
}