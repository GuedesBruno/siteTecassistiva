import { getImersaoBySlug, getAllImersaoSlugs } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const imersoes = await getAllImersaoSlugs();
    if (!imersoes) return [];
    return imersoes.map((imersao) => ({
        slug: imersao.attributes.slug,
    }));
}

export async function generateMetadata({ params }) {
    const { slug } = params;
    const imersao = await getImersaoBySlug(slug);

    if (!imersao || !imersao.attributes.produto || !imersao.attributes.produto.data) {
        return {
            title: 'Página de Imersão não encontrada',
        };
    }

    const productData = imersao.attributes.produto.data.attributes;
    return {
        title: `Imersão: ${productData.nome}`,
    };
}


export default async function ImersaoPage({ params }) {
    const { slug } = params;
    const imersao = await getImersaoBySlug(slug);

    if (!imersao || !imersao.attributes) {
        notFound();
    }

    const { produto } = imersao.attributes;

    if (!produto || typeof produto.data === 'undefined') {
        notFound();
    }

    // Handle single vs. multiple relation: take the first entry if it's an array.
    const productEntry = Array.isArray(produto.data) ? produto.data[0] : produto.data;

    if (!productEntry || !productEntry.attributes) {
        notFound();
    }

    const productData = productEntry.attributes;
    const { curso, guia, manual, botoes_padrao = true, botoes_personalizados } = imersao.attributes;
    const imageUrl = productData.imagem_principal?.data?.attributes?.url;
    const category = productData.categorias?.data[0]?.attributes?.nome || 'produto';

    const buttonClassName = "bg-[#002554] text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-blue-900 transition-colors duration-300";

    return (
        <div className="bg-white text-black min-h-screen flex flex-col items-center justify-center text-center p-4 font-sans">
            <main className="flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{productData.nome}</h1>
                {imageUrl && (
                    <Image
                        src={imageUrl}
                        alt={productData.nome}
                        width={400}
                        height={400}
                        className="mb-6 rounded-lg shadow-lg object-cover"
                    />
                )}
                <p className="text-xl md:text-2xl mb-8">
                    Sua IMERSÃO com o(a) <strong>{category}</strong> começa aqui!
                </p>

                <div className="flex flex-col space-y-4 w-full max-w-sm">
                    {botoes_padrao ? (
                        <>
                            {curso && (
                                <Link href={curso} target="_blank" rel="noopener noreferrer" className={buttonClassName}>
                                    Curso Completo
                                </Link>
                            )}
                            {guia && (
                                <Link href={guia} target="_blank" rel="noopener noreferrer" className={buttonClassName}>
                                    Guia do Usuário
                                </Link>
                            )}
                            {manual && (
                                <Link href={manual} target="_blank" rel="noopener noreferrer" className={buttonClassName}>
                                    Manual
                                </Link>
                            )}
                            <Link href="/produtos" className={buttonClassName}>
                                Catálogo Teca
                            </Link>
                        </>
                    ) : (
                        botoes_personalizados && botoes_personalizados.map((botao) => (
                            <Link key={botao.id} href={botao.link_do_botao} target="_blank" rel="noopener noreferrer" className={buttonClassName}>
                                {botao.texto_do_botao}
                            </Link>
                        ))
                    )}
                </div>

                <div className="flex space-x-6 my-10">
                    <Link href="https://www.instagram.com/tecassistiva/" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Tecassistiva">
                        <Image src="/logo_instagram.svg" alt="Instagram" width={32} height={32} />
                    </Link>
                    <Link href="https://www.youtube.com/c/tecassistiva" target="_blank" rel="noopener noreferrer" aria-label="Canal no YouTube da Tecassistiva">
                        <Image src="/logo_youtube.svg" alt="YouTube" width={32} height={32} />
                    </Link>
                    <Link href="mailto:contato@tecassistiva.com.br" aria-label="Enviar email para Tecassistiva">
                         <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </Link>
                </div>

                <footer className="mt-4">
                    <p className="text-sm text-gray-600">Tecassistiva – Tecnologia Assistiva</p>
                </footer>
            </main>
        </div>
    );
}
