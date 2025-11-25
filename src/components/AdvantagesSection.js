
const advantages = [
    {
        title: "Agilidade",
        description: "Elimine a complexidade e a demora dos processos licitatórios tradicionais. Com uma Ata de Registro de Preços, o caminho entre a necessidade e a aquisição é drasticamente encurtado. Uma vez que os fornecedores e as condições já estão definidos, a contratação torna-se uma simples ordem de fornecimento, permitindo que sua instituição responda rapidamente às demandas sem se prender à burocracia."
    },
    {
        title: "Economia de Tempo",
        description: "A Ata de Registro de Preços permite uma significativa economia de tempo nos processos de compra. Com a simplificação das etapas e a redução da burocracia, sua instituição pode realizar aquisições de forma mais ágil e eficiente, liberando recursos para outras atividades importantes."
    },
    {
        title: "Segurança Jurídica",
        description: "A Ata de Registro de Preços proporciona maior segurança jurídica para as instituições. Com um processo de contratação mais claro e definido, os riscos de questionamentos e impugnações são reduzidos. Isso garante que sua instituição possa realizar suas aquisições com mais tranquilidade e confiança."
    },
    {
        title: "Transparência",
        description: "A transparência é um dos pilares da contratação pública. Com a Ata de Registro de Preços, todos os fornecedores têm acesso às mesmas informações e condições, garantindo um processo justo e equitativo. Isso não apenas aumenta a confiança dos fornecedores, mas também assegura que sua instituição esteja em conformidade com as normas e regulamentos aplicáveis."
    },
    {
        title: "Preços Vantajosos",
        description: "A centralização das compras por meio da Ata de Registro de Preços permite que sua instituição se beneficie de condições comerciais mais favoráveis. Com o poder de compra consolidado, é possível negociar melhores preços e condições com os fornecedores, resultando em economia significativa para o seu orçamento."
    },
    {
        title: "Flexibilidade",
        description: "Diga adeus à necessidade de grandes estoques. A Ata de Registro de Preços não obriga a aquisição do quantitativo total registrado. Sua instituição ganha a liberdade de comprar apenas o que precisa, quando precisa, durante toda a vigência do contrato. Isso permite um melhor planejamento orçamentário, evita o desperdício de recursos."
    }
];

export default function AdvantagesSection() {
  return (
    <div className="py-16 bg-white">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">Vantagens de comprar por Carona:</h2>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-8">
                    {advantages.slice(0, 3).map((advantage, i) => (
                        <div key={i} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-l-4 border-tec-blue">
                            <h3 className="font-bold text-xl text-tec-blue mb-3">{advantage.title}</h3>
                            <p className="text-gray-600 text-justify">{advantage.description}</p>
                        </div>
                    ))}
                </div>
                <div className="space-y-8">
                    {advantages.slice(3, 6).map((advantage, i) => (
                        <div key={i} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-l-4 border-tec-blue">
                            <h3 className="font-bold text-xl text-tec-blue mb-3">{advantage.title}</h3>
                            <p className="text-gray-600 text-justify">{advantage.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <p className="text-justify text-gray-700 max-w-4xl mx-auto">Entendemos que a aquisição de tecnologia assistiva é um passo fundamental para garantir a inclusão, mas os processos de compra podem ser um desafio. É por isso que o sistema de "carona" em Atas de Registro de Preço se torna um poderoso facilitador. Ele simplifica cada etapa, oferecendo um caminho rápido, seguro e econômico para equipar sua instituição com as melhores soluções do mercado. Nosso compromisso é estar ao seu lado, transformando a burocracia em oportunidade e garantindo que os recursos de acessibilidade cheguem a quem mais precisa, sem demora.</p>
    </div>
  );
}
