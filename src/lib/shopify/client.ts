import { supabase } from "@/integrations/supabase/client";

type Api = "storefront" | "admin";

export interface ShopifyResponse<T> {
  data?: T;
  errors?: Array<{ message: string; [k: string]: unknown }>;
}

async function gatewayFetch<T>(
  api: Api,
  query: string,
  variables?: Record<string, unknown>,
): Promise<ShopifyResponse<T> | null> {
  try {
    const { data, error } = await supabase.functions.invoke("shopify-gateway", {
      body: { api, query, variables },
    });
    if (error) {
      console.error(`shopify ${api} error`, error);
      return null;
    }
    return data as ShopifyResponse<T>;
  } catch (err) {
    console.error(`shopify ${api} exception`, err);
    return null;
  }
}

/** Storefront API (safe to call from client). */
export function storefrontFetch<T>(args: {
  query: string;
  variables?: Record<string, unknown>;
}) {
  return gatewayFetch<T>("storefront", args.query, args.variables);
}

/**
 * Admin API. Requires the caller to be an authenticated admin user.
 * Do not invoke from public marketing pages.
 */
export function adminFetch<T>(args: {
  query: string;
  variables?: Record<string, unknown>;
}) {
  return gatewayFetch<T>("admin", args.query, args.variables);
}
