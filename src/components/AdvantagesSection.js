
const advantages = [
    {
        title: "Agilidade",
        description: "Placeholder para o texto sobre a vantagem da agilidade."
    },
    {
        title: "Economia de Tempo",
        description: "Placeholder para o texto sobre a vantagem da economia de tempo."
    },
    {
        title: "Segurança Jurídica",
        description: "Placeholder para o texto sobre a vantagem da segurança jurídica."
    },
    {
        title: "Transparência",
        description: "Placeholder para o texto sobre a vantagem da transparência."
    },
    {
        title: "Preços Vantajosos",
        description: "Placeholder para o texto sobre a vantagem dos preços vantajosos."
    }
];

export default function AdvantagesSection() {
  return (
    <div className="py-16 bg-white">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">Vantagens de comprar por 'carona':</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {advantages.map((advantage, i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <h3 className="font-bold text-xl text-tec-blue mb-3">{advantage.title}</h3>
                    <p className="text-gray-600">{advantage.description}</p>
                </div>
            ))}
        </div>
        <p className="text-center text-gray-700 max-w-4xl mx-auto">Placeholder para o parágrafo de conclusão. Este texto deve explicar resumidamente como o processo de carona pode ser um grande facilitador para a aquisição de tecnologia assistiva, reforçando o compromisso da empresa em ajudar.</p>
    </div>
  );
}
