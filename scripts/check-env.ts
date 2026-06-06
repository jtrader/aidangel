// simple env validator to help developers and CI catch missing env vars early
const required = [
  "VITE_SHOPIFY_STOREFRONT_TOKEN",
  "VITE_SHOPIFY_STORE_DOMAIN",
];

const missing = required.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error("Missing required environment variables:", missing.join(", "));
  console.error("Create a .env file or set these in your environment. See .env.example for details.");
  process.exit(2);
}
console.log("All required env vars present");
