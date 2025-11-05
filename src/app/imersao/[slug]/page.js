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

    if (!imersao || !imersao.attributes) {
        return { title: 'Página de Imersão não encontrada' };
    }

    const { produto: productData } = imersao.attributes;

    if (!productData) {
        return { title: 'Página de Imersão não encontrada' };
    }

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

    const { produto: productData, curso, guia, manual, botoes_padrao = true, personalizado } = imersao.attributes;

    if (!productData) {
        notFound();
    }

    const imageUrl = productData.imagem_principal?.url;

    const buttonClassName = "bg-[#002554] text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-blue-900 transition-colors duration-300";

    return (
        <div className="bg-white text-black min-h-screen flex flex-col items-center justify-center text-center p-4 font-sans">
            <main className="flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{productData.nome}</h1>
                {imageUrl && (
                    <Image
                        src={imageUrl}
                        alt={productData.nome}
                        width={50}
                        height={50}
                        className="mb-6 rounded-lg shadow-lg object-cover"
                    />
                )}
                <p className="text-xl md:text-2xl mb-8">
                    Sua IMERSÃO com o(a) <strong>{productData.descricao_curta}</strong> começa aqui!
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
                        personalizado && personalizado.map((botao) => (
                            <Link key={botao.id} href={botao.link_do_botao} target="_blank" rel="noopener noreferrer" className={buttonClassName}>
                                {botao.texto_do_botao}
                            </Link>
                        ))
                    )}
                </div>

                <div className="flex space-x-6 my-10">
                    <Link href="https://www.instagram.com/tecassistiva/" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Tecassistiva" className="bg-[#002554] rounded-full w-12 h-12 flex items-center justify-center transition-opacity hover:opacity-80">
                        <Image src="/logo_instagram.svg" alt="Instagram" width={32} height={32} />
                    </Link>
                    <Link href="https://www.youtube.com/c/tecassistiva" target="_blank" rel="noopener noreferrer" aria-label="Canal no YouTube da Tecassistiva" className="bg-[#002554] rounded-full w-12 h-12 flex items-center justify-center transition-opacity hover:opacity-80">
                        <Image src="/logo_youtube.svg" alt="YouTube" width={32} height={32} />
                    </Link>
                    <Link href="mailto:teca@tecassistiva.com.br" aria-label="Enviar email para Tecassistiva" className="bg-[#002554] rounded-full w-12 h-12 flex items-center justify-center transition-opacity hover:opacity-80">
                         <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </Link>
                </div>
            </main>
        </div>
    );
}
