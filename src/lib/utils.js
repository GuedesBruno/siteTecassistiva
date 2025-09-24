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