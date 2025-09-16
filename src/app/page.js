import { fetchAPI } from '@/lib/api';
import BannerSlider from '@/components/BannerSlider';
import FeaturedProductsSlider from '@/components/FeaturedProductsSlider';

async function getBanners() {
  try {
    const banners = await fetchAPI("/banner-sites", { populate: "imagem" });
    return banners || [];
  } catch (error) {
    console.error("Erro ao buscar banners:", error);
    return [];
  }
}

async function getFeaturedProducts() {
  try {
    // CORREÇÃO: O filtro foi alterado de 'em_destaque' para 'destaque'
    const products = await fetchAPI("/produtos", {
      filters: { destaque: true },
      populate: {
        imagem_principal: true,
        categoria: true
      },
    });
    return products || [];
  } catch (error) {
    console.error("Erro ao buscar produtos em destaque:", error);
    return [];
  }
}

export default async function Home() {
  const banners = await getBanners();
  const featuredProducts = await getFeaturedProducts();

  return (
    <main className="flex flex-col items-center justify-between">
      <div className="w-full">
        {banners.length > 0 ? (
          <BannerSlider banners={banners} />
        ) : (
          <p className="text-center py-10">Não foi possível carregar os banners.</p>
        )}
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Produtos em Destaque</h2>
        {featuredProducts.length > 0 ? (
          <FeaturedProductsSlider products={featuredProducts} />
        ) : (
          <p className="text-center">Não há produtos em destaque no momento.</p>
        )}
      </div>
    </main>
  );
}