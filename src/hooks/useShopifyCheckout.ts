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
      // Navigate away — do not reset loading on success
      window.location.href = data.checkoutUrl;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Checkout failed";
      console.error("Shopify checkout error:", e);
      toast.error(message);
      setLoading(false); // only reset loading on error
    }
  };

  return { openCheckout, loading };
}
