/**
 * Rewrites a Supabase public storage URL to use the image transformation
 * endpoint, which serves a resized + recompressed variant (and negotiates
 * webp/avif automatically based on the Accept header).
 *
 * Falls back to the original URL for non-Supabase or already-transformed URLs.
 */
export function optimizeSupabaseImage(
  url: string | null | undefined,
  width: number,
  quality = 70
): string | undefined {
  if (!url) return undefined;
  if (!url.includes("/storage/v1/object/public/")) return url;
  if (url.includes("/storage/v1/render/image/")) return url;

  const [base, query = ""] = url.split("?");
  const transformed = base.replace(
    "/storage/v1/object/public/",
    "/storage/v1/render/image/public/"
  );
  const params = new URLSearchParams(query);
  params.set("width", String(width));
  params.set("quality", String(quality));
  params.set("resize", "cover");
  return `${transformed}?${params.toString()}`;
}
