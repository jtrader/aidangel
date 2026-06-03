// Smoke test: verify Admin API token + version resolve against Shopify.
Deno.test("admin token reaches Shopify", async () => {
  const domain = (Deno.env.get("SHOPIFY_STORE_DOMAIN") ?? "")
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
  const version = "2025-07";
  const token = Deno.env.get("SHOPIFY_ADMIN_ACCESS_TOKEN") ?? "";

  console.log("domain:", domain, "version:", version, "token len:", token.length);

  const res = await fetch(
    `https://${domain}/admin/api/${version}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({
        query: "{ shop { name primaryDomain { url } } }",
      }),
    },
  );
  const text = await res.text();
  console.log("status:", res.status);
  console.log("body:", text.slice(0, 500));
});
