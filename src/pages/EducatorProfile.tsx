import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, MapPin, Globe, Heart, BadgeCheck, Clock, CheckCircle2, XCircle, Users, Wrench, BookOpen, Sparkles, HelpCircle, Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ClaimListingDialog from "@/components/ClaimListingDialog";
import EditListingDialog from "@/components/EditListingDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { SeoHead } from "@/components/SeoHead";
import { EducatorFull, getEducatorBySlug, citySlug } from "@/lib/educators";
import { getCountry } from "@/lib/donations";
import NetworkFooter from "@/components/NetworkFooter";
import LanguageSelector from "@/components/LanguageSelector";
import { trackLearnClick } from "@/lib/giveAnalytics";
import { useCountry } from "@/hooks/useCountry";
import { Favicon } from "@/components/Favicon";
import { supabase } from "@/integrations/supabase/client";

type ClaimStatus = "pending" | "approved" | "rejected";

interface MyClaim {
  id: string;
  status: ClaimStatus;
  created_at: string;
  review_notes: string | null;
  reviewed_at: string | null;
}

function ClaimStatusCard({ claim }: { claim: MyClaim }) {
  const config: Record<
    ClaimStatus,
    { label: string; icon: React.ReactNode; color: string; bg: string }
  > = {
    pending: {
      label: "Pending review",
      icon: <Clock className="h-4 w-4" />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    approved: {
      label: "Approved",
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    rejected: {
      label: "Declined",
      icon: <XCircle className="h-4 w-4" />,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  };
  const style = config[claim.status];
  return (
    <div className={`rounded-lg border border-border p-3 ${style.bg}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${style.color}`}>
          {style.icon} {style.label}
        </span>
        <span className="text-xs text-muted-foreground ml-auto">
          Submitted {new Date(claim.created_at).toLocaleDateString()}
        </span>
      </div>
      {claim.status === "pending" && (
        <p className="text-xs text-muted-foreground">We'll review your claim and email you within a few business days.</p>
      )}
      {claim.review_notes && (
        <p className="text-xs text-muted-foreground mt-1">Note: {claim.review_notes}</p>
      )}
    </div>
  );
}

export default function EducatorProfile() {
  const { language } = useLanguage();
  const { country } = useCountry();
  const { slug } = useParams<{ slug: string }>();
  const [ed, setEd] = useState<EducatorFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [myClaims, setMyClaims] = useState<MyClaim[]>([]);
  const [profile, setProfile] = useState<{
    who_text: string | null;
    how_text: string | null;
    what_text: string | null;
    why_text: string | null;
    qas: Array<{ question: string; answer: string }>;
  } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const trackOutbound = (url: string, variant: "booking" | "website") => {
    if (!ed) return;
    trackLearnClick({
      ngoId: ed.slug,
      countryCode: ed.hq_country_code ?? country.code,
      countryName: (ed.hq_country_code ? getCountry(ed.hq_country_code)?.name : country.name) ?? country.name,
      destinationUrl: url,
      isNational: (ed.hq_country_code ?? "").toUpperCase() === country.code.toUpperCase(),
      language,
      variant,
    });
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getEducatorBySlug(slug ?? "").then((data) => {
      if (cancelled) return;
      setEd(data);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [slug]);

  // Fetch claim statuses for this educator from localStorage
  useEffect(() => {
    if (!ed) return;
    const stored = JSON.parse(localStorage.getItem("faa_claims") ?? "[]") as Array<{ educatorId: string; claimId: string; claimantEmail: string }>;
    const mine = stored.filter((c) => c.educatorId === ed.id);
    if (mine.length === 0) return;
    const ids = mine.map((c) => c.claimId);
    supabase.rpc("get_claim_statuses", { claim_ids: ids }).then(({ data, error }) => {
      if (error || !data) return;
      setMyClaims(data as MyClaim[]);
    });
  }, [ed]);

  // Load (and if missing, generate) the AI-enriched profile
  useEffect(() => {
    if (!ed) return;
    let cancelled = false;
    setProfileError(null);
    (async () => {
      const { data: existing } = await supabase
        .from("educator_profiles")
        .select("who_text,how_text,what_text,why_text,qas")
        .eq("educator_id", ed.id)
        .maybeSingle();
      if (cancelled) return;
      if (existing) {
        setProfile({ ...existing, qas: (existing.qas as Array<{ question: string; answer: string }>) ?? [] });
        return;
      }
      if (!ed.website && !ed.booking_url) return;
      setProfileLoading(true);
      const { data, error } = await supabase.functions.invoke("generate-educator-profile", {
        body: { educator_id: ed.id },
      });
      if (cancelled) return;
      setProfileLoading(false);
      if (error || data?.error) {
        setProfileError(data?.error ?? error?.message ?? "Could not generate profile");
        return;
      }
      const p = data?.profile;
      if (p) setProfile({ ...p, qas: p.qas ?? [] });
    })();
    return () => { cancelled = true; };
  }, [ed]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }
  if (!ed) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 max-w-3xl mx-auto px-4 py-12 text-center">
          <h1 className="font-heading text-2xl font-bold mb-2">Provider not found</h1>
          <Link to="/learn" className="text-primary underline">Back to Learn First Aid</Link>
        </main>
      </div>
    );
  }

  const title = `${ed.name} — First Aid Courses`;
  const desc = ed.blurb ?? `${ed.name} first aid and CPR training provider profile.`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SeoHead lang={language} title={title} description={desc} basePath={`/learn/provider/${ed.slug}`} />
      <header className="border-b border-border px-4 py-3 flex items-center justify-between bg-background">
        <Link to="/learn" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Learn
        </Link>
        <LanguageSelector />
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <div className="mb-6 flex items-start gap-4">
          <Favicon url={ed.website ?? ed.booking_url} logoUrl={ed.logo_url} alt={`${ed.name} logo`} size={56} className="rounded-lg border border-border bg-card p-1" />
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wide text-primary font-semibold mb-1">
              First aid training provider
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h1 className="font-heading text-3xl font-bold">{ed.name}</h1>
              {ed.is_claimed && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified
                </span>
              )}
            </div>
            {ed.blurb && <p className="text-muted-foreground">{ed.blurb}</p>}
          </div>
        </div>


        {myClaims.length > 1 && (
          <section className="mb-6 -mt-2 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Your claims</h3>
            {myClaims.map((claim) => (
              <ClaimStatusCard key={claim.id} claim={claim} />
            ))}
          </section>
        )}
        {myClaims.length === 1 && (
          <section className="mb-6 -mt-2">
            <ClaimStatusCard claim={myClaims[0]} />
          </section>
        )}

        {(() => {
          const approved = myClaims.find((c) => c.status === "approved");
          if (!approved || !ed) return null;
          return (
            <div className="mb-6 -mt-2 flex items-center gap-2">
              <EditListingDialog
                educatorId={ed.id}
                claimId={approved.id}
                initial={{
                  blurb: ed.blurb,
                  website: ed.website,
                  booking_url: ed.booking_url,
                  logo_url: ed.logo_url,
                }}
                onSaved={(next) => setEd({ ...ed, ...next })}
              />
              <span className="text-xs text-muted-foreground">You manage this listing.</span>
            </div>
          );
        })()}

        <div className="flex flex-wrap gap-2 mb-8">
          {ed.booking_url && (
            <a
              href={ed.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackOutbound(ed.booking_url!, "booking")}
              data-analytics-event="learn_click"
              data-analytics-educator={ed.slug}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
            >
              <Favicon url={ed.booking_url} size={16} />
              Book a course <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {ed.website && (
            <a
              href={ed.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackOutbound(ed.website!, "website")}
              data-analytics-event="learn_click"
              data-analytics-educator={ed.slug}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm hover:bg-accent"
            >
              <Favicon url={ed.website} size={16} />
              Website <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {profileLoading && (
          <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground p-4 rounded-lg border border-dashed border-border bg-card">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Generating a detailed profile from {ed.name}'s website…
          </div>
        )}
        {profileError && !profile && (
          <div className="mb-8 text-xs text-muted-foreground p-3 rounded-lg border border-border bg-card">
            Could not auto-generate an enriched profile yet.
          </div>
        )}

        {profile && (
          <section className="mb-8 grid sm:grid-cols-2 gap-3">
            {[
              { key: "who", label: "Who they are", icon: Users, text: profile.who_text },
              { key: "what", label: "What they offer", icon: BookOpen, text: profile.what_text },
              { key: "how", label: "How they deliver", icon: Wrench, text: profile.how_text },
              { key: "why", label: "Why choose them", icon: Sparkles, text: profile.why_text },
            ]
              .filter((b) => b.text)
              .map((b) => (
                <div key={b.key} className="bg-card border border-border rounded-xl p-4">
                  <h3 className="font-heading text-sm font-semibold mb-2 inline-flex items-center gap-2 text-primary">
                    <b.icon className="h-4 w-4" /> {b.label}
                  </h3>
                  <p className="text-sm text-foreground/90 leading-relaxed">{b.text}</p>
                </div>
              ))}
          </section>
        )}

        {profile && profile.qas.length > 0 && (
          <section className="mb-8">
            <h2 className="font-heading text-lg font-semibold mb-3 inline-flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" /> Frequently asked
            </h2>
            <Accordion type="single" collapsible className="bg-card border border-border rounded-xl px-4">
              {profile.qas.map((qa, i) => (
                <AccordionItem key={i} value={`qa-${i}`} className="border-b last:border-b-0">
                  <AccordionTrigger className="text-sm text-left font-medium">{qa.question}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {qa.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <p className="mt-2 text-[10px] text-muted-foreground">
              Auto-summarised from {ed.name}'s website. Always confirm details with the provider before booking.
            </p>
          </section>
        )}


        {ed.service_areas.length > 0 && (
          <section className="mb-8">
            <h2 className="font-heading text-lg font-semibold mb-3 inline-flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" /> Service areas
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {ed.service_areas.map((area) => {
                const country = getCountry(area.country_code);
                return (
                  <li key={area.id} className="bg-card border border-border rounded-lg px-3 py-2 text-sm">
                    <Link to={`/learn/${area.country_code.toLowerCase()}`} className="font-medium hover:text-primary">
                      {country?.flag} {country?.name ?? area.country_code}
                    </Link>
                    {(area.city || area.region) && (
                      <span className="text-muted-foreground"> — {[area.city, area.region].filter(Boolean).join(", ")}</span>
                    )}
                    {area.notes && <div className="text-xs text-muted-foreground">{area.notes}</div>}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {ed.locations.length > 0 && (
          <section className="mb-8">
            <h2 className="font-heading text-lg font-semibold mb-3 inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Training venues
            </h2>
            <ul className="grid gap-2">
              {ed.locations.map((loc) => {
                const country = getCountry(loc.country_code);
                return (
                  <li key={loc.id} className="bg-card border border-border rounded-lg p-3 text-sm">
                    <div className="font-medium">{loc.address ?? loc.city}</div>
                    <div className="text-xs text-muted-foreground">
                      {loc.city && (
                        <Link
                          to={`/learn/${loc.country_code.toLowerCase()}/${citySlug(loc.city)}`}
                          className="hover:text-primary"
                        >
                          {loc.city}
                        </Link>
                      )}
                      {loc.region && <>, {loc.region}</>}
                      {country && <> — {country.flag} {country.name}</>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {ed.languages.length > 0 && (
          <section className="mb-8">
            <h2 className="font-heading text-lg font-semibold mb-3">Languages taught</h2>
            <ul className="flex flex-wrap gap-2">
              {ed.languages.map((l) => (
                <li key={l} className="px-3 py-1 rounded-full bg-card border border-border text-xs uppercase">
                  {l}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-4 p-5 bg-accent/40 rounded-xl">
          <h2 className="font-heading text-base font-semibold mb-1 inline-flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" /> Find an AED near you
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            Defibrillator access is as important as training. Map your nearest AED before you need it.
          </p>
          <Link
            to="/aed-finder"
            className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Find an AED near me
          </Link>
        </section>

        {!ed.is_claimed && (
          <div className="mt-6 text-center">
            <ClaimListingDialog educatorId={ed.id} educatorName={ed.name} />
            <span className="ml-2 text-xs text-muted-foreground">Are you {ed.name}?</span>
          </div>
        )}
      </main>

      <NetworkFooter currentApp="First Aid Angel" />
    </div>
  );
}
