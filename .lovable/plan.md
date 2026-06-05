## Goal

Attach each of the 28 curated images in `/mnt/documents/product-images.zip` to its matching Shopify product, set as the primary image (replacing existing images).

## Matching

For each image file `{id}.{ext}` (e.g. `au-stjohn-leisure-small.jpg`):
1. Look up Shopify product where `handle == id` (primary).
2. If no handle match, try variant `sku == id` (fallback) and resolve its parent product.
3. If neither matches, skip and record in an unmatched report.

## Steps

1. Unzip `/mnt/documents/product-images.zip` to a working dir and list the 28 IDs.
2. For each ID, call `shopify--search_products` with `handle:{id}` (Shopify search supports the `handle:` field). If empty, try `sku:{id}`.
3. For each matched product, call `shopify--update_product` with `images: [{ file_path: "<local image>", alt: "<product title>" }]`. Providing `images` replaces all existing images, satisfying "set as primary (replace all)".
4. Throttle calls (small concurrency, e.g. 2 in parallel) to stay polite with the API.
5. Write a final report to `/mnt/documents/product-image-injection-report.txt` listing: matched + updated, matched-by-sku, and unmatched IDs.

## Confirmations needed before running

- Updates will modify the live connected Shopify store (`ty3mn0-c3.myshopify.com`) — replacing existing product images. OK to proceed?
- Country tag (e.g. `Country:au`) is informational only; it does not need to be added or modified — confirm.

## Deliverables

- 28 (or fewer, depending on matches) Shopify products updated with their curated primary image.
- `product-image-injection-report.txt` artifact summarising results.
