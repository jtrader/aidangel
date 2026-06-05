## Goal

Fetch the current retail price for each **St John Ambulance** product listed in `products-2.md` (44 entries across AU, UK, US, CA, IE, DE, FR, NL, SE, AE, BE). Output a single deliverable summarising id, country, URL, price, and currency.

## Approach

1. Extract the 44 `*-stjohn-*` entries (id + sourceUrl) from `/mnt/user-uploads/products-2.md`.
2. For each URL, fetch the rendered page and extract the price:
   - **Primary tool**: Firecrawl scrape with `formats: [{ type: 'json', prompt: 'Extract the current retail price as { price: number, currency: ISO-4217 string }' }]`. Firecrawl handles JS rendering, anti-bot, and structured extraction reliably across the ~10 different storefronts.
   - **Fallback**: if Firecrawl is unavailable, use `code--fetch_website` (markdown) and regex the price + infer currency from the country prefix.
3. Run requests in parallel (concurrency ~5) to keep runtime reasonable.
4. Some sites (e.g. sja.org.uk, redcross.org, amazon.com.au) may block or require login; failures are recorded as `price: null, note: "<reason>"`.

## Deliverable

`/mnt/documents/stjohn-prices.md` — a markdown table:

| ID | Country | Price | Currency | URL |
|---|---|---|---|---|

Plus a CSV mirror at `/mnt/documents/stjohn-prices.csv` for spreadsheet use.

## Prereq

Firecrawl connector must be linked. If not, I'll prompt to connect it before running, or fall back to `code--fetch_website` (lower reliability on JS-rendered storefronts).

## Out of scope

Non-St-John brands (Red Cross, J&J, etc.) in the same document — skipped per the request.
