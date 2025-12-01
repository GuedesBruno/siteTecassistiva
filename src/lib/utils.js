/**
 * Constrói o breadcrumb para a página de um produto.
 * Lida com as relações de muitos-para-muitos para categorias e subcategorias.
 * @param {object} product - O objeto do produto vindo da API.
 * @returns {Array<object>} - Um array de objetos para o breadcrumb.
 */
export function buildBreadcrumbs(product) {
    const attrs = product.attributes || product;
    // Relação produto -> categorias (m2m, campo 'categorias')
    // Relação produto -> subcategoria (provavelmente m21, campo 'subcategoria')
    const { categorias, subcategoria } = attrs;

    // Pega a primeira categoria como principal para o breadcrumb
    const primaryCategory = categorias?.data?.[0];
    // Pega a subcategoria. A estrutura de uma relação m21 é { data: { ... } }.
    const primarySubcategory = subcategoria?.data;

    const crumbs = [
        { name: 'Página Inicial', path: '/' },
        { name: 'Produtos', path: '/produtos/categorias' }
    ];

    // Garante que catAttrs seja o objeto com os dados da categoria
    const catAttrs = primaryCategory?.attributes;
    if (catAttrs) {
        crumbs.push({ name: catAttrs.nome, path: `/produtos/categorias/${catAttrs.slug}` });
    }

    // Garante que subAttrs seja o objeto com os dados da subcategoria
    const subAttrs = primarySubcategory?.attributes;
    if (subAttrs && catAttrs) {
        crumbs.push({ name: subAttrs.nome, path: `/produtos/categorias/${catAttrs.slug}/${subAttrs.slug}` });
    }

    return crumbs;
}

/**
 * Ordena itens baseados no campo 'ordem'.
 * Itens com 'ordem' vêm primeiro (ascendente).
 * Itens sem 'ordem' vêm depois (alfabético por 'nome').
 * Suporta tanto objetos normalizados quanto estrutura { id, attributes }.
 * @param {Array} items - Lista de itens para ordenar.
 * @returns {Array} - Lista ordenada.
 */
export function sortItemsByOrder(items) {
    if (!Array.isArray(items)) return [];

    return [...items].sort((a, b) => { // Use spread to avoid mutating original array
        const getAttr = (item) => item.attributes || item;
        const attrA = getAttr(a);
        const attrB = getAttr(b);

        const orderA = attrA.ordem;
        const orderB = attrB.ordem;

        // Verifica se ordem existe e é válida (não nula/undefined/vazia)
        const hasOrderA = orderA !== null && orderA !== undefined && orderA !== '';
        const hasOrderB = orderB !== null && orderB !== undefined && orderB !== '';

        // Se ambos têm ordem, ordena numérico
        if (hasOrderA && hasOrderB) {
            return Number(orderA) - Number(orderB);
        }

        // Se apenas A tem ordem, A vem primeiro
        if (hasOrderA) return -1;

        // Se apenas B tem ordem, B vem primeiro
        if (hasOrderB) return 1;

        // Se nenhum tem ordem, ordena alfabético por nome
        const nameA = attrA.nome || '';
        const nameB = attrB.nome || '';
        return nameA.localeCompare(nameB, 'pt-BR', { sensitivity: 'base' });
    });
}