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
    const fabricanteData = productData.relacao_fabricante?.data?.attributes ||
        productData.relacao_fabricante?.data ||
        productData.relacao_fabricante;

    const fabricanteNome = fabricanteData?.nome || '';

    return (
        <div className="h-screen bg-[#002554] font-sans text-white selection:bg-blue-500 selection:text-white relative overflow-hidden flex flex-col items-center justify-center p-4">

            {/* Background Logo Watermark */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5 pointer-events-none z-0">
                <Image
                    src="/logo-tecassistiva.svg"
                    alt="Background Logo"
                    fill
                    className="object-contain brightness-0 invert"
                />
            </div>

            {/* Glassmorphism Card */}
            <main className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-6 relative z-10 flex flex-col items-center max-h-[95vh] overflow-hidden">

                {/* Product Image (Rounded) */}
                <div
                    className="relative w-36 h-36 mb-6 mt-12 group overflow-hidden border-4 border-white/10 shadow-lg shrink-0"
                    style={{ borderRadius: '50%' }}
                >
                    <div className="absolute inset-0 bg-blue-400 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={productData.nome}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                            <span className="text-white/50 text-sm">Sem imagem</span>
                        </div>
                    )}
                </div>

                {/* Welcome Text */}
                <p className="text-center text-lg mb-6 text-blue-100 leading-relaxed font-light shrink-0">
                    Sua IMERSÃO com {genero_descricao === 'feminino' ? 'a' : 'o'}{' '}
                    <strong className="font-bold text-white block text-xl mt-1">
                        {fabricanteNome} {productData.nome}
                    </strong>
                    começa aqui!
                </p>

                {/* Action Buttons (Linktree Style) */}
                <div className="w-full space-y-2 mb-4">
                    {botoes_padrao ? (
                        <>
                            {curso && (
                                <Link
                                    href={curso}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-300 group"
                                >
                                    <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                        </svg>
                                    </div>
                                    <span className="font-semibold text-white tracking-wide text-xs">Curso Completo</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white/50 ml-auto group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            )}
                            {guia && (
                                <Link
                                    href={guia}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-300 group"
                                >
                                    <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <span className="font-semibold text-white tracking-wide text-xs">Guia do Usuário</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white/50 ml-auto group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            )}
                            {manual && (
                                <Link
                                    href={manual}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-300 group"
                                >
                                    <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <span className="font-semibold text-white tracking-wide text-xs">Manual</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white/50 ml-auto group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            )}
                        </>
                    ) : (
                        personalizado && personalizado.map((botao) => (
                            <Link
                                key={botao.id}
                                href={botao.link_do_botao}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-300 group"
                            >
                                <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                </div>
                                <span className="font-semibold text-white tracking-wide text-xs">{botao.texto_do_botao}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white/50 ml-auto group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        ))
                    )}

                    {/* Secondary Button */}
                    <Link
                        href="/produtos"
                        className="flex items-center justify-center p-3 mt-2 border border-white/30 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 text-sm font-medium tracking-wider uppercase shrink-0"
                    >
                        Ver Catálogo Completo
                    </Link>
                </div>

                {/* Social Media Icons */}
                <div className="flex space-x-6 mt-auto pt-4 shrink-0">
                    <Link href="https://www.instagram.com/tecassistiva/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all transform hover:scale-110 border border-white/10">
                        <Image src="/logo_instagram.svg" alt="Instagram" width={20} height={20} className="brightness-0 invert" />
                    </Link>
                    <Link href="https://www.youtube.com/c/tecassistiva" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all transform hover:scale-110 border border-white/10">
                        <Image src="/logo_youtube.svg" alt="YouTube" width={20} height={20} className="brightness-0 invert" />
                    </Link>
                    <Link href="mailto:teca@tecassistiva.com.br" aria-label="Email" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all transform hover:scale-110 border border-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </Link>
                </div>

                <footer className="mt-4 text-center text-white/30 text-[10px] shrink-0">
                    © {new Date().getFullYear()} Tecassistiva
                </footer>
            </main>
        </div>
    );
}
