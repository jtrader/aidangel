import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { CartDrawer } from "@/components/shop/CartDrawer";

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [variantId, setVariantId] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    if (!handle) return;
    setLoading(true);
    fetchProductByHandle(handle)
      .then((p) => {
        setProduct(p);
        setVariantId(p?.variants.edges[0]?.node.id ?? null);
      })
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>Product not found.</p>
        <Link to="/shop" className="underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const variant = product.variants.edges.find((v) => v.node.id === variantId)?.node;
  const image = product.images.edges[0]?.node;

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{product.title} | First Aid Angel Shop</title>
        <meta name="description" content={product.description.slice(0, 160)} />
        <link rel="canonical" href={`https://firstaidangel.org/product/${product.handle}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description: product.description.slice(0, 5000),
            image: product.images.edges.map((e) => e.node.url),
            sku: product.variants.edges[0]?.node.id,
            brand: { "@type": "Brand", name: "First Aid Angel" },
            url: `https://firstaidangel.org/product/${product.handle}`,
            offers: product.variants.edges.map((v) => ({
              "@type": "Offer",
              price: v.node.price.amount,
              priceCurrency: v.node.price.currencyCode,
              availability: v.node.availableForSale
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              url: `https://firstaidangel.org/product/${product.handle}`,
            })),
          })}
        </script>
      </Helmet>
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/shop" className="text-sm underline">
            ← Back to shop
          </Link>
          <CartDrawer />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          {image && (
            <img
              src={image.url}
              alt={image.altText || product.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-2xl font-semibold">
            {variant?.price.currencyCode} {parseFloat(variant?.price.amount || "0").toFixed(2)}
          </p>
          {product.variants.edges.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {product.variants.edges.map((v) => (
                <Button
                  key={v.node.id}
                  variant={v.node.id === variantId ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVariantId(v.node.id)}
                  disabled={!v.node.availableForSale}
                >
                  {v.node.title}
                </Button>
              ))}
            </div>
          )}
          <Button
            size="lg"
            onClick={handleAdd}
            disabled={isLoading || !variant?.availableForSale}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : !variant?.availableForSale ? (
              "Sold out"
            ) : (
              "Add to cart"
            )}
          </Button>
          {product.description && (
            <div className="prose prose-sm max-w-none mt-4 whitespace-pre-wrap">
              {product.description}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
