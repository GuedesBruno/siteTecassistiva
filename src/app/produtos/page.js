// Arquivo: src/app/produtos/page.js
import ProductListClient from "@/components/ProductListClient";
import { staticProducts, staticCategories } from "@/lib/static-data";

export default function ProdutosPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center my-10">Nossos Produtos</h1>
      <ProductListClient
        products={staticProducts}
        categories={staticCategories}
      />
    </div>
  );
}