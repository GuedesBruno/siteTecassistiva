// Arquivo: src/app/page.js
import BannerSlider from "@/components/BannerSlider";
import FeaturedProductsSlider from "@/components/FeaturedProductsSlider";
import { staticBanners, staticProducts } from "@/lib/static-data";

export default function Home() {
  // Filtra apenas os produtos marcados como destaque
  const featuredProducts = staticProducts.filter(p => p.attributes.Destaque);

  return (
    <main>
      <BannerSlider banners={staticBanners} />
      <FeaturedProductsSlider products={featuredProducts} />
    </main>
  );
}