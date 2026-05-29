import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Info,
  ShieldCheck,
  BookOpen,
  WifiOff,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
import HamburgerMenu from "@/components/HamburgerMenu";
import NetworkFooter from "@/components/NetworkFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizedPath } from "@/lib/i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";

const SOURCES = [
  {
    name: "Australian First Aid Manual (5th Edition)",
    detail:
      "Primary clinical reference for our guidance, aligned with the Australian Resuscitation Council (ARC).",
  },
  {
    name: "Australian Resuscitation Council (ARC) Guidelines",
    detail:
      "CPR ratios, AED use and basic life support steps follow current ARC consensus guidelines.",
  },
  {
    name: "International Liaison Committee on Resuscitation (ILCOR)",
    detail:
      "Global consensus on resuscitation science that underpins ARC and international protocols.",
  },
  {
    name: "World Health Organization (WHO)",
    detail:
      "Public health framing for prevention, injury reduction and emergency preparedness.",
  },
  {
    name: "Red Cross / Red Crescent & St John Ambulance",
    detail:
      "Cross-referenced for community-level first aid education and best-practice training.",
  },
];

const APP_VS_NO_TRAINING = [
  {
    label: "Offline-capable phone app (First Aid Angel)",
    pros: [
      "Available in the pocket of anyone with a phone — no class booking required",
      "Works without signal once installed, so it helps in remote, rural and disaster scenarios",
      "Step-by-step prompts reduce panic and decision paralysis",
      "Always up to date with current guidelines via app updates",
      "Multilingual — 48+ languages so bystanders can help across language barriers",
    ],
    icon: CheckCircle2,
    tone: "positive" as const,
  },
  {
    label: "No or limited first aid education",
    pros: [
      "Bystanders often freeze or do nothing for fear of making things worse",
      "Critical actions (CPR, bleeding control, recovery position) may be skipped entirely",
      "Higher risk of preventable death in the first 10 minutes before paramedics arrive",
      "No prompt to call emergency services early",
      "Misinformation from memory or social media can cause harm",
    ],
    icon: XCircle,
    tone: "negative" as const,
  },
];

const AI_VS_TRADITIONAL = [
  {
    label: "AI-assisted first aid (First Aid Angel)",
    points: [
      "Conversational — ask in your own words, even under stress",
      "Adapts to the specific situation you describe",
      "Available 24/7, instantly, in your language",
      "Combines step-by-step guidance, CPR metronome, AED finder and learning in one app",
      "Cannot replace a trained responder, but bridges the gap until help arrives",
    ],
  },
  {
    label: "Traditional first aid resources (books, courses, posters)",
    points: [
      "Hands-on courses build muscle memory and confidence that an app cannot fully replicate",
      "Certified training is essential for workplace, school and community roles",
      "Printed manuals don't adapt — you have to find the right page under pressure",
      "Courses can be expensive, time-consuming or unavailable in remote areas",
      "Best used together with First Aid Angel as a refresher and in-the-moment guide",
    ],
  },
];

const FAQS = [
  {
    q: "Is First Aid Angel a substitute for calling emergency services?",
    a: "No. In any emergency, call your local emergency number first (000 in Australia, 911 in the US, 112 across Europe and the UK). First Aid Angel helps you act in the critical minutes before professional help arrives — it does not replace paramedics, doctors or emergency dispatchers.",
  },
  {
    q: "Is First Aid Angel a substitute for accredited first aid training?",
    a: "No. We strongly encourage everyone to complete a hands-on, accredited first aid course (Red Cross, St John Ambulance or equivalent). First Aid Angel is designed to support trained responders and guide untrained bystanders when no other help is immediately available.",
  },
  {
    q: "Where does the medical guidance come from?",
    a: "Our guidance is based on the Australian First Aid Manual (5th Edition), the Australian Resuscitation Council guidelines and ILCOR consensus science, cross-referenced with WHO, Red Cross and St John Ambulance materials.",
  },
  {
    q: "Does the app work offline?",
    a: "Yes. Once installed to your home screen, the core first aid guidance, CPR guide and knowledge base work without an internet connection — critical for remote areas, disasters or any time signal drops out.",
  },
  {
    q: "Is my data private?",
    a: "We do not sell personal data. Chat queries are used to give you guidance and improve safety. Location is only used when you explicitly ask features like the AED Finder to locate the nearest defibrillator.",
  },
  {
    q: "Is First Aid Angel free?",
    a: "Yes. The app is free to use. We support our work through optional donations to partner first aid charities and an affiliated first aid kit shop — all clearly marked.",
  },
  {
    q: "What languages are supported?",
    a: "First Aid Angel is available in 48+ languages with medical-safety-aware translation, so bystanders can help across language barriers.",
  },
  {
    q: "How accurate is the AI?",
    a: "The AI is grounded in vetted first aid sources and conservative safety prompts — it will always recommend calling emergency services for anything serious. It is not a diagnostic tool and does not give medical advice beyond established first aid practice.",
  },
];

function HardcodedAbout() {
  return (
    <>
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground mb-4 shadow-sm">
          <Info className="h-7 w-7" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
          About
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          First Aid Angel
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A free, offline-capable AI first aid companion — built to{" "}
          <strong className="text-foreground">educate</strong>,{" "}
          <strong className="text-foreground">prevent</strong> and{" "}
          <strong className="text-foreground">aid</strong> in emergency
          situations.
        </p>
      </div>

      {/* Purpose */}
      <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Our purpose
        </h2>
        <div className="space-y-4 text-foreground/90 leading-relaxed">
          <p>
            Every year, preventable deaths occur in the first few minutes of
            an emergency — before paramedics arrive — simply because the
            people on the scene don't know what to do. First Aid Angel exists
            to close that gap.
          </p>
          <ul className="space-y-2 pl-1">
            <li className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span>
                <strong>Educate</strong> — make trustworthy first aid
                knowledge available to anyone with a phone, in their own
                language.
              </span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span>
                <strong>Prevent</strong> — promote safe behaviour, hazard
                awareness and early action that stops emergencies escalating.
              </span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span>
                <strong>Aid</strong> — guide bystanders and trained
                responders through the critical minutes before professional
                help arrives.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Credentials & Sources */}
      <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Credentials &amp; sources
        </h2>
        <p className="text-foreground/90 leading-relaxed mb-5">
          First Aid Angel's guidance is grounded in established, peer-reviewed
          first aid and resuscitation literature. We do not invent medical
          advice — we present current best-practice steps in plain language.
        </p>
        <ul className="space-y-3">
          {SOURCES.map((s) => (
            <li
              key={s.name}
              className="border border-border rounded-xl p-4 bg-background/50"
            >
              <p className="font-semibold text-foreground flex items-start gap-2">
                <BookOpen className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                {s.name}
              </p>
              <p className="text-sm text-muted-foreground mt-1 pl-6">
                {s.detail}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground mt-5">
          First Aid Angel is an educational tool. It is not a registered
          medical device and does not provide medical diagnosis. In any
          emergency, call your local emergency number (in Australia,{" "}
          <a href="tel:000" className="text-primary font-semibold">
            Triple Zero (000)
          </a>
          ).
        </p>
      </section>

      {/* Offline app vs no training */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
          <WifiOff className="h-6 w-6 text-primary" />
          Offline app vs. no first aid education
        </h2>
        <p className="text-muted-foreground mb-5">
          Why having a first aid app on your phone matters — even if you've
          never taken a course.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {APP_VS_NO_TRAINING.map((col) => {
            const Icon = col.icon;
            const tone =
              col.tone === "positive"
                ? "border-primary/30 bg-primary/5"
                : "border-destructive/30 bg-destructive/5";
            const iconTone =
              col.tone === "positive" ? "text-primary" : "text-destructive";
            return (
              <div
                key={col.label}
                className={`border rounded-2xl p-5 ${tone}`}
              >
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${iconTone}`} />
                  {col.label}
                </h3>
                <ul className="space-y-2 text-sm text-foreground/90">
                  {col.pros.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className={`mt-1 ${iconTone}`}>•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI vs Traditional */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          AI first aid vs. traditional resources
        </h2>
        <p className="text-muted-foreground mb-5">
          The two work best together — here's how they compare.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {AI_VS_TRADITIONAL.map((col) => (
            <div
              key={col.label}
              className="border border-border rounded-2xl p-5 bg-card"
            >
              <h3 className="font-bold text-foreground mb-3">{col.label}</h3>
              <ul className="space-y-2 text-sm text-foreground/90">
                {col.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-1 text-primary">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-semibold">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/90 leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* JSON-LD FAQ schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.a,
              },
            })),
          }),
        }}
      />
    </>
  );
}

export default function About() {
  const { language } = useLanguage();
  const { page, loading } = useCmsPage("about");

  const seoTitle = page?.title ?? "About First Aid Angel · Sources, Purpose & FAQ";
  const seoDesc =
    page?.description ??
    "Learn about First Aid Angel — our credentials, sources, mission to educate and aid in emergencies, and how an offline AI first aid app compares to traditional resources.";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead
        lang={language}
        basePath="/about"
        title={seoTitle}
        description={seoDesc}
      />

      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <Link
            to={localizedPath(language, "/")}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            First Aid Angel
          </Link>
          <HamburgerMenu />
        </div>
      </header>

      <main className="flex-1 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {!loading && page?.is_published && page.blocks.length > 0 ? (
            <CmsBlocksRenderer page={page} />
          ) : (
            <HardcodedAbout />
          )}
        </div>
      </main>

      <NetworkFooter />
    </div>
  );
}
