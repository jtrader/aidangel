import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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
import { useCountry } from "@/hooks/useCountry";
import { emergencyNumberForCountry } from "@/lib/donations";
import { useMetronome } from "@/hooks/useMetronome";
import { speakCpr, stopCprVoice, prefetchCprVoice } from "@/lib/cprVoice";
import { CPR_LANGUAGES, type CprLangCode } from "@/data/cprTranslations";

type StepKey = "D" | "R" | "S" | "A" | "B" | "C" | "AED";

interface Step {
  key: StepKey;
  label: string;
  title: string;
  icon: typeof ShieldAlert;
  spoken: string;
  detail: string;
}

const STEPS: Step[] = [
  {
    key: "D",
    label: "Danger",
    title: "Check for Danger",
    icon: ShieldAlert,
    spoken: "Check for danger. Make sure the scene is safe for you, bystanders, and the casualty before approaching.",
    detail: "Look for traffic, fire, electricity, water or violence. Don't become a second casualty.",
  },
  {
    key: "R",
    label: "Response",
    title: "Check Response",
    icon: MessageCircle,
    spoken: "Check for response. Squeeze the shoulders firmly and ask loudly: Can you hear me? Open your eyes!",
    detail: "Use the COWS check — Can you hear me? Open your eyes! What's your name? Squeeze my hand.",
  },
  {
    key: "S",
    label: "Send",
    title: "Send for Help — Call now",
    icon: Phone,
    spoken: "Send for help. Call emergency services immediately. Put your phone on speaker.",
    detail: "Call 000 (or local emergency number). Ask a bystander to find an AED.",
  },
  {
    key: "A",
    label: "Airway",
    title: "Open the Airway",
    icon: Wind,
    spoken: "Open the airway. Tilt the head back gently and lift the chin. Clear any visible obstruction.",
    detail: "If you suspect a spinal injury, lift the jaw without tilting the head.",
  },
  {
    key: "B",
    label: "Breathing",
    title: "Check Breathing",
    icon: Activity,
    spoken: "Check for normal breathing. Look, listen and feel for up to ten seconds. Gasping is not normal breathing.",
    detail: "If breathing normally — recovery position. If not — start CPR immediately.",
  },
  {
    key: "C",
    label: "CPR",
    title: "Start CPR — 30:2",
    icon: HeartPulse,
    spoken: "Start CPR now. Push hard and fast in the centre of the chest. I will keep the rhythm. Thirty compressions, then two breaths.",
    detail: "Centre of chest, two hands, 5 cm deep, 100–120 per minute. Allow full chest recoil between compressions.",
  },
  {
    key: "AED",
    label: "Defib",
    title: "Attach the AED",
    icon: Zap,
    spoken: "Attach the defibrillator as soon as it arrives. Turn it on and follow the voice prompts. Don't stop CPR until it tells you to stand clear.",
    detail: "Bare the chest, dry if wet, apply pads — upper right and lower left. Stand clear when it analyses or shocks.",
  },
];

function StepBadge({ icon: Icon, active, done }: { icon: typeof ShieldAlert; active: boolean; done: boolean }) {
  return (
    <div
      className={[
        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
        active
          ? "bg-destructive text-destructive-foreground shadow-md scale-110"
          : done
          ? "bg-primary/15 text-primary"
          : "bg-muted text-muted-foreground",
      ].join(" ")}
    >
      {done && !active ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
    </div>
  );
}

export default function CprGuide() {
  const { code: countryCode } = useCountry();
  const emergency = emergencyNumberForCountry(countryCode);
  const [stepIdx, setStepIdx] = useState(0);
  const [voiceOn, setVoiceOn] = useState(true);
  const [muted, setMuted] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const voiceOnRef = useRef(voiceOn);
  useEffect(() => { voiceOnRef.current = voiceOn; }, [voiceOn]);

  const handleBreath = useCallback(() => {
    if (!voiceOnRef.current) return;
    speak("Two breaths. Then continue compressions.", { rate: 1.05, interrupt: true });
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

  useEffect(() => () => { stopSpeaking(); }, []);

  const step = STEPS[stepIdx];
  const isCpr = step.key === "C";

  const goToStep = useCallback(async (idx: number) => {
    const next = Math.max(0, Math.min(STEPS.length - 1, idx));
    setStepIdx(next);
    const s = STEPS[next];
    if (voiceOnRef.current) {
      speak(s.spoken, { rate: 1.03, interrupt: true });
    }
    if (s.key !== "C") {
      metronome.stop();
    }
  }, [metronome]);

  const startCpr = useCallback(async () => {
    if (voiceOnRef.current) {
      await speak("Push hard and fast. Follow the beat.", { rate: 1.05, interrupt: true });
    }
    metronome.start();
  }, [metronome]);

  const resetAll = useCallback(() => {
    metronome.stop();
    stopSpeaking();
    setStepIdx(0);
  }, [metronome]);

  const mm = String(Math.floor(metronome.elapsedSec / 60)).padStart(2, "0");
  const ss = String(metronome.elapsedSec % 60).padStart(2, "0");

  const pulseDurMs = Math.round((60 / metronome.bpm) * 1000);

  const inBreathPhase = isCpr && metronome.isRunning && metronome.cyclePos === 29;

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
          <a
            href={`tel:${emergency}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-destructive hover:underline"
          >
            <Phone className="h-4 w-4" /> Call {emergency}
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-5">
        <div className="text-center mb-5">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold">Live CPR Guide</h1>
          <p className="text-sm text-muted-foreground">Voice-guided DRSABCD with a 100–120 bpm metronome</p>
        </div>

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
            <button
              onClick={() => setVoiceOn((v) => { if (v) stopSpeaking(); return !v; })}
              aria-label={voiceOn ? "Mute voice" : "Unmute voice"}
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent shrink-0"
            >
              {voiceOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
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
                      metronome.isRunning ? "animate-ping" : "",
                    ].join(" ")}
                    style={metronome.isRunning ? { animationDuration: `${pulseDurMs}ms` } : undefined}
                  />
                  <div
                    className={[
                      "relative h-full w-full rounded-full flex flex-col items-center justify-center text-destructive-foreground shadow-xl transition-transform",
                      inBreathPhase ? "bg-primary" : "bg-destructive",
                    ].join(" ")}
                    style={
                      metronome.isRunning
                        ? { animation: `cpr-beat ${pulseDurMs}ms ease-in-out infinite` }
                        : undefined
                    }
                  >
                    <HeartPulse className="h-9 w-9 mb-1" />
                    <div className="text-5xl font-bold tabular-nums leading-none">
                      {inBreathPhase ? "🫁" : (metronome.cyclePos + (metronome.isRunning ? 1 : 0)) || "—"}
                    </div>
                    <div className="text-[11px] uppercase tracking-wider mt-1 opacity-90">
                      {inBreathPhase ? "Give 2 breaths" : `of 30 · cycle ${metronome.cycle + (metronome.isRunning ? 1 : 0)}`}
                    </div>
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

        {!isSpeechSupported() && (
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Voice guidance isn't supported in this browser — visual cues still work.
          </p>
        )}

        <aside className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
          <strong>Emergency reminder:</strong> This guide is for learning and assistance — it doesn't replace
          professional help. Always call <a href={`tel:${emergency}`} className="underline font-semibold">{emergency}</a> first.
        </aside>
      </main>
    </div>
  );
}
