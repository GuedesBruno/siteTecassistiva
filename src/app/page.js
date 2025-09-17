import BannerSlider from "@/components/BannerSlider";
import FeaturedProductsSlider from "@/components/FeaturedProductsSlider";
import { getBanners, getFeaturedProducts } from "@/lib/api";

export default async function Home() {
  // Busca os dados da API em paralelo para otimizar o tempo de build
  const [bannersData, featuredProductsData] = await Promise.all([
    getBanners(),
    getFeaturedProducts(),
  ]);

  return (
    <main>
      <BannerSlider banners={bannersData?.data || []} />
      <FeaturedProductsSlider products={featuredProductsData?.data || []} />
    </main>
  );
}