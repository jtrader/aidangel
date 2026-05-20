/// <reference types="vite/client" />

declare module "*.json?raw" {
  const content: string;
  export default content;
}

declare module "/kb/_meta.json" {
  const value: Array<{
    slug: string;
    title: string;
    category: string;
    section: string;
    summary: string;
    keywords: string[];
    related: string[];
  }>;
  export default value;
}
