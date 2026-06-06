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
  /** Absolute URL to social preview image. Defaults to site og-image. */
  ogImage?: string;
  /** og:type — defaults to "website". Use "article" for blog/KB pages. */
  ogType?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  /** When true, emit <meta name="robots" content="noindex,nofollow"> for admin/private routes. */
  noindex?: boolean;
};

const DEFAULT_OG_IMAGE = "https://firstaidangel.org/og-image.png";

/** Truncate a description to <=160 chars at a word boundary. */
function clampDesc(s?: string): string | undefined {
  if (!s) return s;
  if (s.length <= 160) return s;
  const cut = s.slice(0, 157);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 100 ? cut.slice(0, lastSpace) : cut) + "…";
}

export function SeoHead({ lang, basePath, title, description, ogImage, ogType, jsonLd, noindex }: Props) {
  const canonical = canonicalUrl(lang, basePath);
  const alts = alternates(basePath);
  const ogLocale = HREFLANG[lang].replace("-", "_");
  const desc = clampDesc(description);
  const image = ogImage ?? DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <html lang={HREFLANG[lang]} dir={dirFor(lang)} />
      <title>{title}</title>
      {desc ? <meta name="description" content={desc} /> : null}
      {noindex ? <meta name="robots" content="noindex,nofollow" /> : null}
      <link rel="canonical" href={canonical} />
      {alts.map((a) => (
        <link key={a.hreflang} rel="alternate" hrefLang={a.hreflang} href={a.href} />
      ))}
      <meta property="og:title" content={title} />
      {desc ? <meta property="og:description" content={desc} /> : null}
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={ogLocale} />
      <meta name="google-site-verification" content="e0mjhVCjf457Cy5PuZFPCkt9XFfepknYoJttXqBePok" />
      <meta property="og:type" content={ogType ?? "website"} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {desc ? <meta name="twitter:description" content={desc} /> : null}
      <meta name="twitter:image" content={image} />
      {jsonLd ? (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : { ...jsonLd, inLanguage: HREFLANG[lang] })}
        </script>
      ) : null}
    </Helmet>
  );
}
