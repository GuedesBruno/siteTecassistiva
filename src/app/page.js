// sitetecassistiva/src/app/page.js

import BannerSlider from "@/components/BannerSlider";
import FeaturedProductsSlider from "@/components/FeaturedProductsSlider";
import { fetchAPI } from "@/lib/api";

// Função para buscar os banners
async function getBanners() {
  try {
    return await fetchAPI("/banner-sites", { populate: "imagem" });
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return []; // Retorna array vazio em caso de erro
  }
}

// Função para buscar produtos em destaque
async function getFeaturedProducts() {
  try {
    return await fetchAPI("/produtos", {
      filters: { em_destaque: { $eq: true } },
      populate: "imagem_principal",
    });
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return []; // Retorna array vazio em caso de erro
  }
}

export default async function Home() {
  const banners = await getBanners();
  const featuredProducts = await getFeaturedProducts();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-7xl">
        <BannerSlider banners={banners} />
        <FeaturedProductsSlider products={featuredProducts} />
      </div>
    </main>
  );
}

async function getBanners() {
  try {
    // CORREÇÃO: Adicionado o parâmetro populate para a imagem
    return await fetchAPI("/banner-sites", { populate: "imagem" });
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return []; // Retorna array vazio em caso de erro
  }
}