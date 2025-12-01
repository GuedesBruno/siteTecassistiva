import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// --- Internal Fetch Logic for Build Stability ---
// We duplicate this here to ensure generateStaticParams never crashes the build
// even if api.js has issues or env vars are missing during the build phase.

async function internalFetchAPI(endpoint) {
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
    const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

    if (!STRAPI_URL || !STRAPI_TOKEN) {
        console.warn("[Imersão] Variáveis de ambiente não definidas. Retornando dados vazios.");
        return null;
    }

    try {
        let base = STRAPI_URL.replace(/\/+$/g, '');
        if (base.endsWith('/api')) {
            base = base.replace(/\/api$/, '');
        }
        const path_ep = endpoint.replace(/^\/+/, '');
        const url = `${base}/${path_ep}`;

        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` },
            next: { revalidate: 60 } // Cache for 60 seconds
        });

        if (!res.ok) {
            console.error(`[Imersão] API Error: ${res.status}`);
            return null;
        }

        return await res.json();
    } catch (error) {
        console.error(`[Imersão] Erro ao fazer fetch: ${error.message}`);
        return null;
    }
}

function normalizeDataArray(response) {
    if (!response) return [];
    const data = response.data || [];
    return data;
}

async function getImersaoBySlugInternal(slug) {
    const populateQuery = 'populate[personalizado]=*&populate[produto][fields][0]=nome&populate[produto][fields][1]=descricao_curta&populate[produto][populate][0]=imagem_principal&populate[produto][populate][1]=categorias&populate[produto][populate][2]=relacao_fabricante&fields[0]=genero_descricao&fields[1]=curso&fields[2]=guia&fields[3]=manual&fields[4]=botoes_padrao';
    const res = await internalFetchAPI(`/api/imersaos?filters[slug][$eq]=${slug}&${populateQuery}`);
    const data = normalizeDataArray(res);
    if (data.length === 0) return null;

    const item = data[0];
    if (item.attributes) {
        return item;
    }
    const { id, ...attributes } = item;
    return { id, attributes };
}

async function getAllImersaoSlugsInternal() {
    const res = await internalFetchAPI('/api/imersaos?fields[0]=slug&pagination[limit]=1000');
    const items = normalizeDataArray(res);
    return items.map(i => ({
        slug: i.attributes?.slug || i.slug,
    })).filter(i => i.slug);
}

// --- Page Functions ---

export async function generateStaticParams() {
    try {
        const imersoes = await getAllImersaoSlugsInternal();

        if (!imersoes || imersoes.length === 0) {
            console.log('[imersao] Nenhuma imersão encontrada (ou erro de API) para gerar páginas estáticas.');
            return [];
        }

        return imersoes.map((imersao) => ({
            slug: imersao.attributes?.slug || imersao.slug,
        }));
    } catch (error) {
        console.error('[imersao] Error generating static params:', error);
        return [];
    }
}

export async function generateMetadata({ params }) {
    const { slug } = params;
    const imersao = await getImersaoBySlugInternal(slug);

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
    console.log(`📄 Renderizando página de imersão: ${slug}`);

    const imersao = await getImersaoBySlugInternal(slug);

    if (!imersao || !imersao.attributes) {
        console.error(`❌ ERRO: Imersão não encontrada para slug: ${slug}`);
        notFound();
    }

    const { produto: productData, curso, guia, manual, botoes_padrao = true, personalizado, genero_descricao } = imersao.attributes;

    if (!productData) {
        console.error(`❌ ERRO: Imersão "${slug}" não tem produto vinculado`);
        notFound();
    }

    console.log(`✅ Imersão renderizada com sucesso: ${slug}`);

    const imageUrl = productData.imagem_principal?.url;

    // Extract manufacturer name safely
    const fabricanteData = productData.relacao_fabricante?.data?.attributes || productData.relacao_fabricante?.data;
    const fabricanteNome = fabricanteData?.nome || '';

    const buttonClassName = "bg-[#002554] text-white py-3 px-6 font-bold text-lg hover:bg-tec-blue-light transition-colors duration-300";

    return (
        <div className="bg-gray-50 text-black min-h-screen flex flex-col items-center justify-center p-4 font-sans py-12">
            <main className="w-full max-w-2xl bg-white p-8 shadow-lg flex flex-col items-center text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-8">{productData.nome}</h1>
                {imageUrl && (
                    <Image
                        src={imageUrl}
                        alt={productData.nome}
                        width={200}
                        height={200}
                        className="mb-10 object-cover"
                    />
                )}
                <p className="text-xl md:text-2xl mb-10">
                    Sua IMERSÃO com {genero_descricao === 'feminino' ? 'a' : 'o'}{' '}
                    <strong>{fabricanteNome} {productData.nome}</strong> começa aqui!
                </p>

                <div className="flex flex-col space-y-4 w-full max-w-sm mt-8">
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

                <div className="flex space-x-6 mt-10">
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
