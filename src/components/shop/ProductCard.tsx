import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";

export const ProductCard = ({ product }: { product: ShopifyProduct }) => {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const node = product.node;
  const variant = node.variants.edges[0]?.node;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <Link to={`/product/${node.handle}`} className="block aspect-square bg-muted overflow-hidden">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || node.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <Link to={`/product/${node.handle}`}>
          <h3 className="font-semibold line-clamp-2 hover:underline">{node.title}</h3>
        </Link>
        <p className="text-lg font-bold">
          {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
        </p>
        <Button
          onClick={handleAdd}
          disabled={isLoading || !variant || !variant.availableForSale}
          className="w-full mt-auto"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : !variant?.availableForSale ? (
            "Sold out"
          ) : (
            "Add to cart"
          )}
        </Button>
      </div>
    </Card>
  );
};
