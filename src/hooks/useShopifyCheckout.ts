import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type CheckoutOptions = {
  priceId: string;
  // The following are kept for call-site compatibility but are unused —
  // the edge function reads email from the JWT and quantity is encoded in priceId.
  quantity?: number;
  customerEmail?: string;
  customData?: Record<string, string>;
  successUrl?: string;
};

export function useShopifyCheckout() {
  const [loading, setLoading] = useState(false);

  const openCheckout = async (options: CheckoutOptions) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-credit-checkout",
        { body: { priceId: options.priceId } },
      );
      if (error) throw new Error(error.message);
      if (!data?.checkoutUrl) throw new Error("No checkout URL returned");
      // Open in a new tab so the user keeps their place in the marketing /
      // learning flow — matches the post-completion cert-checkout behaviour.
      const win = window.open(data.checkoutUrl, "_blank", "noopener,noreferrer");
      if (!win) {
        // Popup blocked → fall back to same-tab navigation so checkout still works.
        window.location.href = data.checkoutUrl;
        return;
      }
      setLoading(false);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Checkout failed";
      console.error("Shopify checkout error:", e);
      toast.error(message);
      setLoading(false);
    }
  };

  return { openCheckout, loading };
}
