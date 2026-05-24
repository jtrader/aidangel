import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/components/SeoHead";
import LessonContent from "@/components/lesson/LessonContent";
import { Copy, Check } from "lucide-react";

const SECTIONS = [
  { id: "colors", label: "Colours" },
  { id: "type", label: "Typography" },
  { id: "buttons", label: "Buttons" },
  { id: "callouts", label: "Callouts" },
  { id: "steps", label: "Steps" },
  { id: "checklist", label: "Checklists" },
  { id: "quiz", label: "Knowledge checks" },
  { id: "scenario", label: "Scenarios" },
  { id: "prose", label: "Prose" },
];

const PALETTE = [
  { name: "Primary (brand red)", token: "primary", hex: "#DC2626", hsl: "0 72% 51%" },
  { name: "Primary foreground", token: "primary-foreground", hex: "#FFFFFF", hsl: "0 0% 100%" },
  { name: "Accent (soft red)", token: "accent", hex: "#FDECEC", hsl: "0 72% 96%" },
  { name: "Background", token: "background", hex: "#F7F7F7", hsl: "0 0% 97%" },
  { name: "Card", token: "card", hex: "#FFFFFF", hsl: "0 0% 100%" },
  { name: "Foreground (text)", token: "foreground", hex: "#1D2433", hsl: "220 20% 14%" },
  { name: "Muted text", token: "muted-foreground", hex: "#6B7280", hsl: "220 9% 46%" },
  { name: "Border", token: "border", hex: "#E5E7EB", hsl: "220 13% 91%" },
  { name: "Emergency", token: "emergency", hex: "#DC2626", hsl: "0 72% 51%" },
  { name: "Safe (green)", token: "safe", hex: "#22C55E", hsl: "142 71% 45%" },
  { name: "Warning (amber)", token: "warning", hex: "#F59E0B", hsl: "38 92% 50%" },
];

function CopyChip({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 font-mono text-xs hover:bg-border"
    >
      {value}
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3 opacity-60" />}
    </button>
  );
}

const SAMPLE_MD = `
## Headings use DM Sans (display)
Body copy uses Nunito Sans. Keep paragraphs short — 2–3 sentences max for scanability under stress.

:::danger[Life-threatening signs]
Call **000** immediately if the person is unresponsive, not breathing normally, or has uncontrolled bleeding.
:::

:::warning[Take care]
Don't move someone with a suspected spinal injury unless they're in immediate danger.
:::

:::tip[Stay efficient]
Use the heel of your hand to find compression depth quickly — about one-third of the chest.
:::

:::remember[Key rule]
DRSABCD: **D**anger, **R**esponse, **S**end for help, **A**irway, **B**reathing, **C**PR, **D**efibrillation.
:::

:::did-you-know
Bystander CPR can double or triple a person's chance of survival.
:::

:::steps[How to give chest compressions]
1. Place the heel of one hand in the centre of the chest.
2. Place the other hand on top and interlock fingers.
3. Push hard and fast — 100–120 per minute.
4. Allow the chest to fully recoil between compressions.
:::

:::checklist[Before you start]
- Scene is safe (no traffic, fire, current)
- Wearing gloves if available
- Someone is calling 000
- DON'T: move the patient unnecessarily
- NEVER: put your face close to an unknown substance
:::

:::quiz{q="How fast should chest compressions be?" a="1" choices="60–80/min|100–120/min|150–180/min" explain="The Australian Resuscitation Council recommends 100–120 compressions per minute for all ages."}
:::

:::scenario[At the cafe]
You're having coffee when a man at the next table suddenly slumps forward and stops responding.
You shake his shoulder — no reaction. His breathing looks gasping and irregular.

---

1. **Shout for help** and ask someone to call **000** and find an AED.
2. **Place him on his back** on the floor and start **chest compressions** immediately.
3. Continue compressions until paramedics arrive or the AED is ready to use.
:::
`;

export default function StyleGuide() {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead lang="en" basePath="/style-guide" title="Style Guide | First Aid Angel" description="Visual style guide: colours, typography, and content blocks for First Aid Angel lessons." />
      <div className="container max-w-5xl mx-auto px-4 py-10">
        <header className="mb-10">
          <p className="font-display text-xs font-semibold uppercase tracking-widest text-primary mb-2">Style Guide</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">First Aid Angel — Design System</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            The visual language for lessons, content blocks, and authoring. Use these tokens and components everywhere — no custom colours in components.
          </p>
        </header>

        <nav className="sticky top-0 z-10 -mx-4 mb-10 flex flex-wrap gap-2 border-b bg-background/95 px-4 py-3 backdrop-blur">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium hover:border-primary hover:text-primary">
              {s.label}
            </a>
          ))}
        </nav>

        {/* COLOURS */}
        <section id="colors" className="mb-14 scroll-mt-20">
          <h2 className="font-display text-2xl font-bold mb-1">Colours</h2>
          <p className="text-sm text-muted-foreground mb-6">All colours use HSL semantic tokens. Never hardcode hex in components.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {PALETTE.map((c) => (
              <Card key={c.token} className="overflow-hidden">
                <div className="h-20" style={{ background: `hsl(${c.hsl})` }} />
                <div className="p-3 space-y-1">
                  <p className="font-display text-sm font-semibold">{c.name}</p>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <CopyChip value={`hsl(var(--${c.token}))`} />
                    <CopyChip value={c.hex} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* TYPE */}
        <section id="type" className="mb-14 scroll-mt-20">
          <h2 className="font-display text-2xl font-bold mb-1">Typography</h2>
          <p className="text-sm text-muted-foreground mb-6">Headings: <strong>DM Sans</strong> (font-display). Body: <strong>Nunito Sans</strong> (default). Max 2 type families.</p>
          <Card className="p-6 space-y-4">
            <div><p className="text-xs text-muted-foreground mb-1">H1 · display · 36–48px · 700</p><p className="font-display text-4xl md:text-5xl font-bold">Recognise the signs early</p></div>
            <div><p className="text-xs text-muted-foreground mb-1">H2 · display · 24–30px · 700</p><p className="font-display text-2xl md:text-3xl font-bold">Direct pressure & bandaging</p></div>
            <div><p className="text-xs text-muted-foreground mb-1">H3 · display · 18–20px · 600</p><p className="font-display text-lg md:text-xl font-semibold">When to call 000</p></div>
            <div><p className="text-xs text-muted-foreground mb-1">Lead · 18px · 400</p><p className="text-lg">A clear, calm first sentence sets the scene before any action.</p></div>
            <div><p className="text-xs text-muted-foreground mb-1">Body · 14–16px · 400</p><p>Use plain Australian English. Short sentences. Avoid jargon. If you must use a medical term, define it the first time.</p></div>
            <div><p className="text-xs text-muted-foreground mb-1">Caption · 12px · uppercase tracking</p><p className="font-display text-xs font-semibold uppercase tracking-widest text-primary">Emergency · Step 1 of 4</p></div>
          </Card>
        </section>

        {/* BUTTONS */}
        <section id="buttons" className="mb-14 scroll-mt-20">
          <h2 className="font-display text-2xl font-bold mb-1">Buttons</h2>
          <p className="text-sm text-muted-foreground mb-6">Primary = red. Use destructive sparingly. All buttons use the shared `Button` component.</p>
          <Card className="p-6 flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </Card>
        </section>

        {/* AUTHORING SYNTAX */}
        <section id="callouts" className="mb-14 scroll-mt-20">
          <h2 className="font-display text-2xl font-bold mb-1">Content blocks (authoring syntax)</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Lesson bodies are written in markdown extended with directive blocks (<code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">:::name[Title]</code>).
            Below is a single sample lesson body showing every block.
          </p>
          <Card className="p-6 md:p-8">
            <LessonContent>{SAMPLE_MD.trim()}</LessonContent>
          </Card>
        </section>

        {/* CHEATSHEET */}
        <section id="prose" className="mb-14 scroll-mt-20">
          <h2 className="font-display text-2xl font-bold mb-1">Authoring cheatsheet</h2>
          <Card className="p-6">
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-relaxed"><code>{`:::danger[Title]      life-threatening / call 000
:::warning[Title]     caution, don't do X
:::tip[Title]         helpful technique
:::remember[Title]    memorable rule (DRSABCD)
:::did-you-know       stat or fact

:::steps[Title]
1. Numbered list inside renders as step cards
:::

:::checklist[Title]
- Tickable item
- DON'T: items prefixed with DON'T render red
:::

:::quiz{q="…" a="0" choices="A|B|C" explain="…"}
:::

:::scenario[Title]
Situation paragraph in italics.

---

Reveal answer below the divider.
:::`}</code></pre>
          </Card>
        </section>
      </div>
    </div>
  );
}
