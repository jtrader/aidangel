import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/shop/ProductCard";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { Loader2 } from "lucide-react";

export default function Shop() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts(24)
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Shop | First Aid Angel</title>
        <meta
          name="description"
          content="Shop First Aid Angel certificates, keyrings, and supplies."
        />
      </Helmet>
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Shop</h1>
          <CartDrawer />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="text-center text-destructive py-16">Failed to load products: {error}</p>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold mb-2">No products found</h2>
            <p className="text-muted-foreground">
              Your Shopify store is empty. Ask the assistant to create a product (tell it the
              name and price).
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
