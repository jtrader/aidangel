import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles, ListChecks, ExternalLink, RotateCcw, Loader2 } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { cn } from "@/lib/utils";
import { matchPrograms, type Answers } from "@/lib/match";
import { pillarMeta, programs as allPrograms, type Program } from "@/data/programs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Mode = "choose" | "questionnaire" | "ai" | "results";

const disasters = [
  { v: "bushfire", label: "Bushfire" },
  { v: "flood", label: "Flood" },
  { v: "storm", label: "Storm" },
  { v: "cyclone", label: "Cyclone" },
  { v: "landslide", label: "Landslide" },
  { v: "other", label: "Other" },
] as const;

const homeImpacts = [
  { v: "none", label: "No damage to my home" },
  { v: "damaged", label: "Damaged but liveable" },
  { v: "uninhabitable", label: "Uninhabitable" },
  { v: "destroyed", label: "Destroyed" },
] as const;

const incomes = [
  { v: "any", label: "My income wasn't affected" },
  { v: "lost-income", label: "I lost income because of the disaster" },
] as const;

const audiences = [
  { v: "individual", label: "An individual" },
  { v: "family", label: "A family" },
  { v: "renter", label: "A renter" },
  { v: "homeowner", label: "A homeowner" },
  { v: "business", label: "A small business" },
] as const;

const needsList = [
  { v: "cash", label: "Emergency cash" },
  { v: "food", label: "Food / essentials" },
  { v: "shelter", label: "Somewhere to stay" },
  { v: "income", label: "Income support" },
  { v: "rebuild", label: "Repair or rebuild" },
  { v: "counselling", label: "Counselling / emotional support" },
  { v: "business", label: "Business recovery" },
  { v: "insurance", label: "Insurance help" },
] as const;

const initialAnswers: Answers = {
  disaster: "bushfire",
  homeImpact: "damaged",
  income: "any",
  audience: "individual",
  needs: [],
};

const totalSteps = 5;

const Assessment = () => {
  const [mode, setMode] = useState<Mode>("choose");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [results, setResults] = useState<Program[]>([]);
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [aiPrograms, setAiPrograms] = useState<Program[]>([]);

  const reset = () => {
    setMode("choose");
    setStep(0);
    setAnswers(initialAnswers);
    setResults([]);
    setAiText("");
    setAiSummary("");
    setAiPrograms([]);
  };

  const finishQuestionnaire = () => {
    const matched = matchPrograms(answers);
    setResults(matched);
    setMode("results");
  };

  const runAi = async () => {
    if (!aiText.trim()) {
      toast.error("Please describe your situation first.");
      return;
    }
    setAiLoading(true);
    setAiSummary("");
    setAiPrograms([]);
    try {
      const { data, error } = await supabase.functions.invoke("aid-match", {
        body: {
          description: aiText,
          programs: allPrograms.map((p) => ({
            id: p.id,
            provider: p.provider,
            name: p.name,
            amount: p.amount,
            description: p.description,
            pillar: p.pillar,
          })),
        },
      });
      if (error) throw error;
      const ids: string[] = data?.matchedIds ?? [];
      const summary: string = data?.summary ?? "";
      setAiSummary(summary);
      setAiPrograms(
        ids
          .map((id) => allPrograms.find((p) => p.id === id))
          .filter((p): p is Program => Boolean(p))
      );
      setMode("results");
    } catch (e) {
      console.error(e);
      toast.error("Couldn't run the AI match. Please try the questionnaire instead.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <SiteLayout>
      <section className="container max-w-3xl mx-auto px-4 py-12">
        {/* CHOOSE MODE */}
        {mode === "choose" && (
          <div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl">How would you like to start?</h1>
            <p className="text-muted-foreground mt-3">
              Either way, your answers stay on your device. No login. No tracking.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 mt-8">
              <button
                onClick={() => { setMode("questionnaire"); setStep(0); }}
                className="text-left rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-glow transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
                  <ListChecks className="h-5 w-5" />
                </div>
                <div className="font-display font-semibold text-lg mt-4">Guided questionnaire</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Five short questions. We match you against a curated list of recovery programs. Recommended.
                </p>
              </button>

              <button
                onClick={() => setMode("ai")}
                className="text-left rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-glow transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="font-display font-semibold text-lg mt-4">AI-powered match</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Describe what happened in your own words. Aid Angel's AI suggests programs that may fit.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* QUESTIONNAIRE */}
        {mode === "questionnaire" && (
          <Questionnaire
            step={step}
            setStep={setStep}
            answers={answers}
            setAnswers={setAnswers}
            onFinish={finishQuestionnaire}
            onCancel={reset}
          />
        )}

        {/* AI MODE */}
        {mode === "ai" && (
          <div>
            <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <h2 className="font-display font-bold text-3xl">Tell us, in your own words</h2>
            <p className="text-muted-foreground mt-2">
              Describe what happened, who was affected, and what you need most right now.
              The more detail, the better the match.
            </p>

            <textarea
              value={aiText}
              onChange={(e) => setAiText(e.target.value)}
              maxLength={2000}
              rows={8}
              placeholder="e.g. Our home was flooded last week. We're a family of four. The house is uninhabitable and we're staying with relatives. My partner's small cafe also flooded and we've lost income."
              className="mt-6 w-full rounded-2xl border border-border bg-card p-4 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <div className="text-xs text-muted-foreground mt-1 text-right">{aiText.length}/2000</div>

            <button
              onClick={runAi}
              disabled={aiLoading}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {aiLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Matching…</> : <>Match my situation <Sparkles className="h-4 w-4" /></>}
            </button>
          </div>
        )}

        {/* RESULTS */}
        {mode === "results" && (
          <Results
            programs={results.length ? results : aiPrograms}
            aiSummary={aiSummary}
            onReset={reset}
          />
        )}
      </section>
    </SiteLayout>
  );
};

/* ---------- Questionnaire ---------- */

const Questionnaire = ({
  step,
  setStep,
  answers,
  setAnswers,
  onFinish,
  onCancel,
}: {
  step: number;
  setStep: (n: number) => void;
  answers: Answers;
  setAnswers: (a: Answers) => void;
  onFinish: () => void;
  onCancel: () => void;
}) => {
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  const next = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else onFinish();
  };
  const back = () => {
    if (step > 0) setStep(step - 1);
    else onCancel();
  };

  return (
    <div>
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
        <span>Question {step + 1} of {totalSteps}</span>
        <span>{progress}% complete</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-10">
        {step === 0 && (
          <SingleSelect
            title="What type of disaster affected you?"
            value={answers.disaster}
            options={disasters}
            onChange={(v) => setAnswers({ ...answers, disaster: v as Answers["disaster"] })}
          />
        )}
        {step === 1 && (
          <SingleSelect
            title="What happened to your home?"
            value={answers.homeImpact}
            options={homeImpacts}
            onChange={(v) => setAnswers({ ...answers, homeImpact: v as Answers["homeImpact"] })}
          />
        )}
        {step === 2 && (
          <SingleSelect
            title="Did you lose income?"
            value={answers.income}
            options={incomes}
            onChange={(v) => setAnswers({ ...answers, income: v as Answers["income"] })}
          />
        )}
        {step === 3 && (
          <SingleSelect
            title="Who are you seeking help for?"
            value={answers.audience}
            options={audiences}
            onChange={(v) => setAnswers({ ...answers, audience: v as Answers["audience"] })}
          />
        )}
        {step === 4 && (
          <MultiSelect
            title="What do you need most right now?"
            subtitle="Choose as many as apply."
            values={answers.needs}
            options={needsList}
            onChange={(values) => setAnswers({ ...answers, needs: values as Answers["needs"] })}
          />
        )}
      </div>

      <div className="flex items-center justify-between mt-10">
        <button onClick={back} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={next}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-opacity"
        >
          {step === totalSteps - 1 ? "See my matches" : "Next"} <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">
        Need to stop? <Link to="/" className="underline">Your answers stay on this device.</Link>
      </p>
    </div>
  );
};

const SingleSelect = ({
  title,
  value,
  options,
  onChange,
}: {
  title: string;
  value: string;
  options: readonly { v: string; label: string }[];
  onChange: (v: string) => void;
}) => (
  <div>
    <h2 className="font-display font-bold text-2xl sm:text-3xl">{title}</h2>
    <div className="grid gap-3 sm:grid-cols-2 mt-6">
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={cn(
            "text-left rounded-xl border p-4 transition-all",
            value === o.v
              ? "border-primary bg-accent text-accent-foreground shadow-glow"
              : "border-border bg-card hover:border-primary/40"
          )}
        >
          <span className="font-medium">{o.label}</span>
        </button>
      ))}
    </div>
  </div>
);

const MultiSelect = ({
  title,
  subtitle,
  values,
  options,
  onChange,
}: {
  title: string;
  subtitle?: string;
  values: string[];
  options: readonly { v: string; label: string }[];
  onChange: (values: string[]) => void;
}) => {
  const toggle = (v: string) => {
    onChange(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);
  };
  return (
    <div>
      <h2 className="font-display font-bold text-2xl sm:text-3xl">{title}</h2>
      {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      <div className="grid gap-3 sm:grid-cols-2 mt-6">
        {options.map((o) => {
          const active = values.includes(o.v);
          return (
            <button
              key={o.v}
              onClick={() => toggle(o.v)}
              className={cn(
                "text-left rounded-xl border p-4 transition-all",
                active
                  ? "border-primary bg-accent text-accent-foreground shadow-glow"
                  : "border-border bg-card hover:border-primary/40"
              )}
            >
              <span className="font-medium">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- Results ---------- */

const Results = ({
  programs,
  aiSummary,
  onReset,
}: {
  programs: Program[];
  aiSummary?: string;
  onReset: () => void;
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-3xl sm:text-4xl">Your relief path</h1>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" /> Start over
        </button>
      </div>

      {aiSummary && (
        <div className="rounded-2xl border border-primary/30 bg-accent/40 p-5 mb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> AI summary
          </div>
          <p className="text-sm text-foreground mt-2 leading-relaxed whitespace-pre-line">{aiSummary}</p>
        </div>
      )}

      {programs.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            We couldn't find a clear match. Browse our{" "}
            <Link to="/resources" className="text-primary underline">full resource list</Link>{" "}
            or try again.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {programs.map((p) => {
            const meta = pillarMeta[p.pillar];
            return (
              <a
                key={p.id}
                href={p.url}
                target={p.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-glow transition-all flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[11px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded"
                      style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
                    >
                      {meta.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{p.provider}</span>
                  </div>
                  <h3 className="font-display font-semibold text-base mt-2">{p.name}</h3>
                  <div className="text-sm font-medium text-primary mt-1">{p.amount}</div>
                  <p className="text-sm text-muted-foreground mt-2">{p.description}</p>
                </div>
                <div className="inline-flex items-center gap-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  Apply <ExternalLink className="h-4 w-4" />
                </div>
              </a>
            );
          })}
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-8 text-center">
        Aid Angel is not the government. We point to official programs — eligibility is determined by the listed provider.
      </p>
    </div>
  );
};

export default Assessment;
