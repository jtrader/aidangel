import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  HeartPulse,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Phone,
  CheckCircle2,
  ShieldAlert,
  MessageCircle,
  Wind,
  Activity,
  Zap,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
import { CprExplainerVideo } from "@/components/CprExplainerVideo";
import LanguageSelector from "@/components/LanguageSelector";
import EmergencyCallButton from "@/components/EmergencyCallButton";
import { useCountry } from "@/hooks/useCountry";
import { emergencyNumberForCountry } from "@/lib/donations";
import { useMetronome } from "@/hooks/useMetronome";
import DonateMenu from "@/components/DonateMenu";
import ShopMenu from "@/components/ShopMenu";
import LearnMenu from "@/components/LearnMenu";
import NetworkFooter from "@/components/NetworkFooter";
import HamburgerMenu from "@/components/HamburgerMenu";
import { speakCpr, stopCprVoice, prefetchCprVoice } from "@/lib/cprVoice";
import { CPR_LANGUAGES, type CprLangCode } from "@/data/cprTranslations";

type StepKey = "D" | "R" | "S" | "A" | "B" | "C" | "AED";

interface Step {
  key: StepKey;
  label: string;
  title: string;
  icon: typeof ShieldAlert;
  detail: string;
}

const STEPS: Step[] = [
  {
    key: "D",
    label: "Danger",
    title: "Check for Danger",
    icon: ShieldAlert,
    detail: "Look for traffic, fire, electricity, water or violence. Don't become a second casualty.",
  },
  {
    key: "R",
    label: "Response",
    title: "Check Response",
    icon: MessageCircle,
    detail: "Use the COWS check — Can you hear me? Open your eyes! What's your name? Squeeze my hand.",
  },
  {
    key: "S",
    label: "Send",
    title: "Send for Help — Call now",
    icon: Phone,
    detail: "Call 000 (or local emergency number). Ask a bystander to find an AED.",
  },
  {
    key: "A",
    label: "Airway",
    title: "Open the Airway",
    icon: Wind,
    detail: "If you suspect a spinal injury, lift the jaw without tilting the head.",
  },
  {
    key: "B",
    label: "Breathing",
    title: "Check Breathing",
    icon: Activity,
    detail: "If breathing normally — recovery position. If not — start CPR immediately.",
  },
  {
    key: "C",
    label: "CPR",
    title: "Start CPR — 30:2",
    icon: HeartPulse,
    detail: "Centre of chest, two hands, 5 cm deep, 100–120 per minute. Allow full chest recoil between compressions.",
  },
  {
    key: "AED",
    label: "Defib",
    title: "Attach the AED",
    icon: Zap,
    detail: "Bare the chest, dry if wet, apply pads — upper right and lower left. Stand clear when it analyses or shocks.",
  },
];

function StepBadge({ icon: Icon, active, done }: { icon: typeof ShieldAlert; active: boolean; done: boolean }) {
  return (
    <div
      className={[
        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
        active
          ? "bg-white text-foreground shadow-md scale-110"
          : done
          ? "bg-primary/15 text-primary"
          : "bg-muted text-muted-foreground",
      ].join(" ")}
    >
      {done && !active ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
    </div>
  );
}

function detectInitialLang(): { lang: CprLangCode; auto: boolean } {
  if (typeof window === "undefined") return { lang: "en", auto: false };
  const stored = window.localStorage.getItem("faa.cprLang") as CprLangCode | null;
  if (stored && CPR_LANGUAGES.some((l) => l.code === stored)) return { lang: stored, auto: false };

  // Check full BCP47 codes first, then fall back to base language codes
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language || "en"];
  for (const raw of prefs) {
    const full = raw.toLowerCase();
    const base = full.split("-")[0];
    const fullMatch = CPR_LANGUAGES.find((l) => l.bcp47.toLowerCase() === full || l.code === full);
    if (fullMatch) return { lang: fullMatch.code, auto: true };
    const baseMatch = CPR_LANGUAGES.find((l) => l.code === base);
    if (baseMatch) return { lang: baseMatch.code, auto: true };
  }
  return { lang: "en", auto: true };
}

export default function CprGuide() {
  const { code: countryCode } = useCountry();
  const emergency = emergencyNumberForCountry(countryCode);
  const [searchParams] = useSearchParams();
  // Allow deep-linking to a specific DRSABCD step via ?step=D|R|S|A|B|C|AED.
  // Default to CPR (C) so the metronome is one tap away.
  const initialStepIdx = (() => {
    const raw = searchParams.get("step");
    if (raw) {
      const key = raw.toUpperCase() === "DEFIB" ? "AED" : raw.toUpperCase();
      const idx = STEPS.findIndex((s) => s.key === key);
      if (idx >= 0) return idx;
    }
    return STEPS.findIndex((s) => s.key === "C");
  })();
  const [stepIdx, setStepIdx] = useState(initialStepIdx);
  const [voiceOn, setVoiceOn] = useState(true);
  const initial = detectInitialLang();
  const [lang, setLang] = useState<CprLangCode>(initial.lang);
  const [autoDetected, setAutoDetected] = useState(initial.auto);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const voiceOnRef = useRef(voiceOn);
  const langRef = useRef(lang);
  useEffect(() => { voiceOnRef.current = voiceOn; }, [voiceOn]);
  useEffect(() => {
    langRef.current = lang;
    try { window.localStorage.setItem("faa.cprLang", lang); } catch { /* ignore */ }
    prefetchCprVoice(lang);
  }, [lang]);

  const handleLangChange = (next: CprLangCode) => {
    setLang(next);
    setAutoDetected(false);
  };

  const handleBreath = useCallback(() => {
    if (!voiceOnRef.current) return;
    void speakCpr(langRef.current, "breath", { interrupt: true });
  }, []);

  const metronome = useMetronome({ bpm: 110, cycleLength: 30, onBreath: handleBreath });

  useEffect(() => {
    if (metronome.isRunning && "wakeLock" in navigator) {
      (navigator as Navigator & { wakeLock: { request: (t: "screen") => Promise<WakeLockSentinel> } })
        .wakeLock.request("screen")
        .then((lock) => { wakeLockRef.current = lock; })
        .catch(() => undefined);
    }
    return () => {
      wakeLockRef.current?.release().catch(() => undefined);
      wakeLockRef.current = null;
    };
  }, [metronome.isRunning]);

  useEffect(() => () => { stopCprVoice(); }, []);

  const step = STEPS[stepIdx];
  const isCpr = step.key === "C";

  const goToStep = useCallback(async (idx: number) => {
    const next = Math.max(0, Math.min(STEPS.length - 1, idx));
    setStepIdx(next);
    const s = STEPS[next];
    if (voiceOnRef.current) {
      void speakCpr(langRef.current, s.key, { interrupt: true });
    }
    if (s.key !== "C") {
      metronome.stop();
    }
  }, [metronome]);

  const startCpr = useCallback(async () => {
    if (voiceOnRef.current) {
      await speakCpr(langRef.current, "startCpr", { interrupt: true });
    }
    metronome.start();
  }, [metronome]);

  const resetAll = useCallback(() => {
    metronome.stop();
    stopCprVoice();
    setStepIdx(0);
  }, [metronome]);



  const mm = String(Math.floor(metronome.elapsedSec / 60)).padStart(2, "0");
  const ss = String(metronome.elapsedSec % 60).padStart(2, "0");

  const pulseDurMs = Math.round((60 / metronome.bpm) * 1000);

  const inBreathPhase = isCpr && metronome.inBreathPhase;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SeoHead
        lang="en"
        title="Live CPR Guide — Metronome & Voice-Guided DRSABCD | First Aid Angel"
        description="Hands-free CPR metronome at 100–120 bpm with voice-guided DRSABCD steps. Works offline. Free, no signup."
        basePath="/cpr"
      />
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <div className="flex items-center gap-2">
            <a
              href={`tel:${emergency}`}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-destructive hover:underline"
            >
              <Phone className="h-4 w-4" /> Call {emergency}
            </a>
            <LanguageSelector />
            <HamburgerMenu />
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 pb-3 flex items-center justify-center gap-2">
          <DonateMenu variant="header" />
          <ShopMenu variant="header" />
          <LearnMenu variant="header" />
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-5">
        <div className="text-center mb-5">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold">Live CPR Guide</h1>
          <p className="text-sm text-muted-foreground">Voice-guided DRSABCD with a 100–120 bpm metronome</p>
        </div>

        <CprExplainerVideo countryCode={countryCode} />

        <ol className="grid grid-cols-7 gap-1.5 mb-5">
          {STEPS.map((s, i) => (
            <li key={s.key}>
              <button
                onClick={() => goToStep(i)}
                aria-label={`${s.key} – ${s.label}`}
                className={[
                  "w-full flex flex-col items-center gap-1 py-2 rounded-xl transition-colors",
                  i === stepIdx ? "bg-destructive/10" : "hover:bg-accent",
                ].join(" ")}
              >
                <StepBadge icon={s.icon} active={i === stepIdx} done={i < stepIdx} />
                <span className="text-[10px] sm:text-[11px] font-semibold leading-tight text-center">
                  {s.label}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <section
          aria-live="polite"
          className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-destructive">
                Step {stepIdx + 1} of {STEPS.length} · {step.key}
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold mt-0.5">{step.title}</h2>
            </div>
            <div className="flex items-center gap-2 shrink-1">
              <div className="relative">
                <select
                  value={lang}
                  onChange={(e) => handleLangChange(e.target.value as CprLangCode)}
                  aria-label="Voice-over language"
                  className="h-10 rounded-full border border-border bg-background text-sm px-3 text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary pr-8"
                >
                  {CPR_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
                {autoDetected && (
                  <button
                    onClick={() => setAutoDetected(false)}
                    title="Language auto-detected from your browser"
                    className="absolute right-1 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full"
                  >
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-30" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setVoiceOn((v) => { if (v) stopCprVoice(); return !v; })}
                aria-label={voiceOn ? "Mute voice" : "Unmute voice"}
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent shrink-0"
              >
                {voiceOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <p className="text-sm sm:text-base text-card-foreground leading-relaxed mb-4">
            {step.detail}
          </p>

          {step.key === "S" && (
            <a
              href={`tel:${emergency}`}
              className="block w-full text-center py-4 rounded-xl bg-destructive text-destructive-foreground font-bold text-lg hover:bg-destructive/90 mb-3"
            >
              <Phone className="inline h-5 w-5 mr-2 -mt-0.5" />
              Call {emergency} now
            </a>
          )}

          {isCpr && (
            <div className="space-y-4">
              <div className="flex flex-col items-center py-4">
                <div className="relative h-44 w-44 sm:h-52 sm:w-52 flex items-center justify-center">
                  <div
                    className={[
                      "absolute inset-0 rounded-full bg-destructive/15",
                      metronome.isRunning && !metronome.inBreathPhase ? "animate-ping" : "",
                    ].join(" ")}
                    style={metronome.isRunning && !metronome.inBreathPhase ? { animationDuration: `${pulseDurMs}ms` } : undefined}
                  />
                  <div
                    className={[
                      "relative h-full w-full rounded-full flex flex-col items-center justify-center text-destructive-foreground shadow-xl transition-transform",
                      inBreathPhase ? "bg-primary" : "bg-destructive",
                    ].join(" ")}
                    style={
                      metronome.isRunning && !metronome.inBreathPhase
                        ? { animation: `cpr-beat ${pulseDurMs}ms ease-in-out infinite` }
                        : undefined
                    }
                  >
                    <HeartPulse className="h-9 w-9 mb-1" />
                    {inBreathPhase ? (
                      <div className="px-4 text-center">
                        <div className="text-xl sm:text-2xl font-bold leading-tight">
                          Give 2 breaths
                        </div>
                        <div className="text-xs uppercase tracking-wider mt-2 opacity-90 tabular-nums">
                          Resume in {metronome.breathCountdown}s
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-5xl font-bold tabular-nums leading-none">
                          {(metronome.cyclePos + (metronome.isRunning ? 1 : 0)) || "—"}
                        </div>
                        <div className="text-[11px] uppercase tracking-wider mt-1 opacity-90">
                          of 30 · cycle {metronome.cycle}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="tabular-nums">{mm}:{ss}</span>
                  <span>·</span>
                  <span>{metronome.count} total</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                {!metronome.isRunning ? (
                  <button
                    onClick={startCpr}
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-destructive text-destructive-foreground font-bold text-lg shadow-md hover:bg-destructive/90"
                  >
                    <Play className="h-5 w-5" /> Start CPR
                  </button>
                ) : (
                  <button
                    onClick={() => metronome.stop()}
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-muted text-foreground font-bold text-lg border border-border hover:bg-accent"
                  >
                    <Pause className="h-5 w-5" /> Pause
                  </button>
                )}
              </div>

              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  onClick={() => metronome.setBpm(metronome.bpm - 2)}
                  className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-accent"
                  aria-label="Decrease tempo"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="text-center min-w-[110px]">
                  <div className="text-2xl font-bold tabular-nums">{metronome.bpm}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">bpm · target 100–120</div>
                </div>
                <button
                  onClick={() => metronome.setBpm(metronome.bpm + 2)}
                  className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-accent"
                  aria-label="Increase tempo"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground text-center px-2">
                Two hands, centre of chest, push 5 cm deep. Let the chest recoil fully between compressions.
              </p>

              {/* Detailed CPR reference from the Knowledge Base */}
              <div className="mt-2 rounded-xl border border-border bg-muted/30 p-4 sm:p-5 space-y-4 text-sm leading-relaxed text-card-foreground">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-heading font-bold text-base">CPR — full technique</h3>
                  <Link
                    to="/kb/cpr"
                    className="text-xs font-semibold text-primary hover:underline shrink-0"
                  >
                    Open full KB article →
                  </Link>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-1">When to start CPR</h4>
                  <p>
                    Start CPR immediately if the person is <strong>unresponsive and not
                    breathing normally</strong>. Don't wait — every minute without CPR reduces
                    survival by about 10%. Agonal gasping is not normal breathing.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-1">Adult &amp; child (over 1 year)</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Lay the person flat on a firm surface and kneel beside their chest.</li>
                    <li>
                      Heel of one hand on the <strong>lower half of the sternum</strong> (centre
                      of chest). Other hand on top, fingers interlocked.
                    </li>
                    <li>Keep arms straight, shoulders directly above your hands.</li>
                    <li>
                      Push down <strong>one third of chest depth</strong> (about 5 cm in an adult).
                    </li>
                    <li>
                      Compress at <strong>100–120 per minute</strong> — about 2 per second.
                    </li>
                    <li>
                      Give <strong>30 compressions</strong>, then <strong>2 rescue breaths</strong>.
                    </li>
                    <li>
                      Continue 30:2 until they recover, an ambulance arrives, an AED instructs
                      you to stop, or you can't continue.
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-1">Infant (under 1 year)</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Place the infant on a firm surface.</li>
                    <li>Use <strong>two fingers</strong> on the lower half of the sternum.</li>
                    <li>Compress one third of chest depth at 100–120 per minute.</li>
                    <li>
                      For breaths, cover <strong>both mouth and nose</strong> with your mouth and
                      give gentle puffs — just enough to see the chest rise.
                    </li>
                    <li>Continue 30:2.</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-1">Compression-only CPR</h4>
                  <p>
                    If you can't or won't give rescue breaths, do{" "}
                    <strong>continuous chest compressions</strong> at 100–120 per minute.
                    Compression-only CPR is much better than no CPR.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-1">When to stop</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>The person starts breathing normally.</li>
                    <li>A paramedic or doctor takes over.</li>
                    <li>An AED tells you to stand clear (resume immediately if prompted).</li>
                    <li>You are physically exhausted and no one can take over.</li>
                  </ul>
                </div>

                <p className="text-xs text-muted-foreground pt-1 border-t border-border">
                  Source: First Aid Angel Knowledge Base · Australian First Aid 5th Edition.
                  CPR is step <strong>C</strong> of{" "}
                  <Link to="/kb/drsabcd" className="text-primary hover:underline">DRSABCD</Link>.
                  Apply an <Link to="/kb/aed" className="text-primary hover:underline">AED</Link>{" "}
                  as soon as it arrives — do not stop CPR to wait for it.
                </p>
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between gap-2">
            <button
              onClick={() => goToStep(stepIdx - 1)}
              disabled={stepIdx === 0}
              className="text-sm px-3 py-2 rounded-full border border-border hover:bg-accent disabled:opacity-40"
            >
              ← Back
            </button>
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-border text-muted-foreground hover:bg-accent"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
            <button
              onClick={() => goToStep(stepIdx + 1)}
              disabled={stepIdx === STEPS.length - 1}
              className="text-sm px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 font-semibold"
            >
              Next step →
            </button>
          </div>
        </section>

        <p className="text-xs text-muted-foreground mt-3 text-center">
          Voice-over by ElevenLabs · available in 10 major world languages.
        </p>

        <aside className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
          <strong>Emergency reminder:</strong> This guide is for learning and assistance — it doesn't replace
          professional help. Always call <a href={`tel:${emergency}`} className="underline font-semibold">{emergency}</a> first.
        </aside>
      </main>
      <EmergencyCallButton />
      <NetworkFooter currentApp="First Aid Angel" />
    </div>
  );
}
