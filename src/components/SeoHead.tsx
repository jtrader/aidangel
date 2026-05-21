// Per-route SEO head — sets <title>, description, canonical, hreflang alternates,
// <html lang/dir>, and og tags. Crawlers (Googlebot) read these post-hydration.
import { Helmet } from "react-helmet-async";
import type { Lang } from "@/lib/i18n";
import { alternates, canonicalUrl, dirFor, HREFLANG } from "@/lib/i18n";

type Props = {
  lang: Lang;
  /** English-equivalent base path, e.g. "/", "/kb", "/kb/cpr". */
  basePath: string;
  title: string;
  description?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function SeoHead({ lang, basePath, title, description, jsonLd }: Props) {
  const canonical = canonicalUrl(lang, basePath);
  const alts = alternates(basePath);
  const ogLocale = HREFLANG[lang].replace("-", "_");

  return (
    <Helmet>
      <html lang={HREFLANG[lang]} dir={dirFor(lang)} />
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      <link rel="canonical" href={canonical} />
      {alts.map((a) => (
        <link key={a.hreflang} rel="alternate" hrefLang={a.hreflang} href={a.href} />
      ))}
      <meta property="og:title" content={title} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={title} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      {jsonLd ? (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : { ...jsonLd, inLanguage: HREFLANG[lang] })}
        </script>
      ) : null}
    </Helmet>
  );
}
