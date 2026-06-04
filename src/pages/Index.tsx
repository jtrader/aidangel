import { useState, useRef, useEffect } from "react";
import { Loader2, RotateCcw, MapPin, Phone, HeartPulse, Stethoscope, FlaskConical, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { EmergencyBanner } from "@/components/shared";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ChatDisclaimer from "@/components/ChatDisclaimer";
import QuickActions from "@/components/QuickActions";
import DRSABCDPanel from "@/components/DRSABCDPanel";

import NetworkFooter from "@/components/NetworkFooter";
import SupportUsBar from "@/components/SupportUsBar";
import KbSuggestionCard from "@/components/KbSuggestionCard";
import EmergencyCallButton from "@/components/EmergencyCallButton";
import HamburgerMenu from "@/components/HamburgerMenu";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import { findBestTopic } from "@/lib/kb";

const URGENT_SLUGS = new Set([
  "cpr", "choking", "anaphylaxis", "snake-bite", "severe-bleeding",
  "stroke", "heart-attack", "drsabcd", "unconscious",
]);

import { SeoHead } from "@/components/SeoHead";
import { streamChat } from "@/lib/chat-stream";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCountry } from "@/hooks/useCountry";
import { emergencyNumberForCountry } from "@/lib/donations";
import aidAngelLogo from "@/assets/aidangel-logo.png";

type Msg = { role: "user" | "assistant"; content: string };
type ChatStatus = "idle" | "thinking" | "guiding";

const Index = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const { code: countryCode } = useCountry();
  const emergencyNumber = emergencyNumberForCountry(countryCode);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  const send = async (input: string) => {
    const userMsg: Msg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setStatus("thinking");

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setStatus("guiding");
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        language,
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => {
          setIsLoading(false);
          setStatus("idle");
        },
        onError: (err) => {
          toast.error(err);
          setIsLoading(false);
          setStatus("idle");
        },
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to get a response. Please try again.");
      setIsLoading(false);
      setStatus("idle");
    }
  };

  const isEmpty = messages.length === 0;

  // Derive walk-through state from the latest assistant message
  const lastAssistant = !isLoading && messages[messages.length - 1]?.role === "assistant"
    ? messages[messages.length - 1]
    : null;
  const walkStepMatch = lastAssistant?.content.match(/\[\[STEP(?::(\d+)\/(\d+))?\]\]/);
  const walkEnded = !!lastAssistant && /\[\[STEP_END\]\]/.test(lastAssistant.content);
  const inWalkthrough = !!walkStepMatch && !walkEnded;
  const walkX = walkStepMatch?.[1] ? parseInt(walkStepMatch[1], 10) : null;
  const walkY = walkStepMatch?.[2] ? parseInt(walkStepMatch[2], 10) : null;
  const walkPct = walkX && walkY ? Math.min(100, Math.round((walkX / walkY) * 100)) : null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SeoHead
        lang={language}
        basePath="/"
        title="First Aid Angel — AI First Aid Assistant"
        description="AI first aid assistant for Australia. Plain-language steps for CPR, choking, burns, bleeding and anaphylaxis — St John Australian First Aid 5th Ed."
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "First Aid Angel",
            url: "https://firstaidangel.org",
            logo: "https://firstaidangel.org/apple-touch-icon.png",
            description:
              "AI first aid assistant for Australia, based on St John Australian First Aid 5th Edition.",
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "First Aid Angel",
            url: "https://firstaidangel.org",
            inLanguage: "en-AU",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://firstaidangel.org/kb?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          },
        ]}
      />
      <EmergencyBanner />

      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-4">
        <div className="max-w-3xl mx-auto flex flex-row items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            {!isEmpty && (
              <button
                onClick={() => setMessages([])}
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Back to home"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            )}
            <a href="/" className="flex items-center gap-3 flex-1" onClick={(e) => { e.preventDefault(); setMessages([]); }}>
              <img src={aidAngelLogo} alt="First Aid Angel logo" width={40} height={40} fetchPriority="high" className="w-10 h-10 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-bold text-lg text-foreground leading-tight">
                    First Aid Angel
                    <span className="sr-only"> — AI First Aid Assistant for Australia</span>
                  </h1>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("appSubtitle")}
                </p>
              </div>
            </a>
          </div>
          <div className="flex items-center justify-end">
            <HamburgerMenu />
          </div>
        </div>
      </header>
      <SupportUsBar />

      {/* Walk-through nav is rendered inline after the latest step message */}




      {/* Main content */}
      <main ref={scrollRef} className="flex-1 px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {isEmpty ? (
            <CmsPageRenderer
              slug="home"
              fallback={
                <>
                  <div className="text-center space-y-3">
                    <img src={aidAngelLogo} alt="First Aid Angel" width={80} height={80} fetchPriority="high" className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover mx-auto" />
                    <h2 className="font-display font-bold text-xl sm:text-2xl text-foreground px-2">
                      {t("welcomeHeading")}
                    </h2>
                  </div>

                  {/* Input directly below the welcome heading */}
                  <div className="max-w-2xl mx-auto w-full">
                    <ChatInput onSend={send} disabled={isLoading} />
                    <ChatDisclaimer />
                  </div>

                  <div className="text-center space-y-3">
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                      {t("welcomeDescription")}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <Link
                        to="/cpr"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-bold hover:bg-secondary/80 transition-colors border border-border"
                        aria-label="Open live CPR guide with metronome"
                      >
                        <HeartPulse className="h-4 w-4" />
                        Live CPR Guide
                      </Link>
                      <Link
                        to="/aed-finder"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors border border-border"
                        aria-label="Find nearest AED"
                      >
                        <MapPin className="h-4 w-4" />
                        AED Finder
                      </Link>
                      <Link
                        to="/symptoms"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors border border-border"
                        aria-label="Find first aid by symptom"
                      >
                        <Search className="h-4 w-4" />
                        Symptom Finder
                      </Link>
                    </div>
                  </div>

                  <QuickActions onSelect={send} />
                  <DRSABCDPanel onSelect={send} />
                </>
              }
            />
          ) : (
            <>
              <div className="space-y-4">
                {messages.map((msg, i) => {
                  const isLast = i === messages.length - 1;
                  const streaming = isLast && isLoading;
                  const stepMatch = msg.role === "assistant" ? msg.content.match(/\[\[STEP(?::(\d+)\/(\d+))?\]\]/) : null;
                  const ended = msg.role === "assistant" && /\[\[STEP_END\]\]/.test(msg.content);
                  const showWalkNav = !!stepMatch && !ended && !streaming && isLast;
                  const sx = stepMatch?.[1] ? parseInt(stepMatch[1], 10) : null;
                  const sy = stepMatch?.[2] ? parseInt(stepMatch[2], 10) : null;
                  const sp = sx && sy ? Math.min(100, Math.round((sx / sy) * 100)) : null;
                  const suggestion = (() => {
                    if (msg.role !== "assistant" || streaming) return null;
                    const prevUser = i > 0 && messages[i - 1].role === "user" ? messages[i - 1].content : "";
                    const combined = `${prevUser}\n${msg.content}`;
                    const topic = findBestTopic(combined);
                    return topic ? { slug: topic.slug, urgent: URGENT_SLUGS.has(topic.slug) } : null;
                  })();
                  return (
                    <div key={i} className="space-y-2">
                      <ChatMessage message={msg} onAction={send} />
                      {suggestion && (
                        <KbSuggestionCard slug={suggestion.slug} urgent={suggestion.urgent} />
                      )}
                      {showWalkNav && (
                        <div className="ml-11 animate-fade-in space-y-2">
                          {sx && sy && (
                            <div className="space-y-1 max-w-sm">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-foreground">
                                  Step {sx} of {sy}
                                </span>
                                <span className="text-muted-foreground">{sp}%</span>
                              </div>
                              <div
                                className="h-1.5 w-full rounded-full bg-muted overflow-hidden"
                                role="progressbar"
                                aria-valuemin={0}
                                aria-valuemax={sy}
                                aria-valuenow={sx}
                                aria-label={`Step ${sx} of ${sy}`}
                              >
                                <div
                                  className="h-full bg-primary transition-all duration-300 ease-out"
                                  style={{ width: `${sp}%` }}
                                />
                              </div>
                            </div>
                          )}
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => send("next")}
                              disabled={isLoading}
                              className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                              Next →
                            </button>
                            <button
                              type="button"
                              onClick={() => send("back")}
                              disabled={isLoading}
                              className="px-3 py-1.5 rounded-full bg-muted text-foreground text-xs font-medium hover:bg-muted/80 transition-colors disabled:opacity-50"
                            >
                              Repeat
                            </button>
                            <button
                              type="button"
                              onClick={() => send("done")}
                              disabled={isLoading}
                              className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50"
                            >
                              Done ✓
                            </button>
                            <button
                              type="button"
                              onClick={() => send("stop")}
                              disabled={isLoading}
                              className="px-3 py-1.5 rounded-full border border-border text-muted-foreground text-xs font-medium hover:bg-muted transition-colors disabled:opacity-50"
                            >
                              Stop
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}


                {isLoading && (
                  <div
                    className="flex gap-3 justify-start animate-fade-in"
                    role="status"
                    aria-live="polite"
                    aria-label={status === "guiding" ? "First Aid Angel is guiding you" : "First Aid Angel is thinking"}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
                    </div>
                    <div className="chat-bubble-assistant px-4 py-3 flex items-center gap-2">
                      <div className="flex gap-1" aria-hidden="true">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        {status === "guiding" ? "Guiding you…" : "Thinking…"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {!isLoading && messages[messages.length - 1]?.role === "assistant" && !inWalkthrough && (
                <div className="text-center space-y-2 animate-fade-in">
                  <p className="text-sm font-medium text-muted-foreground">Am I helping?</p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => send("Yes, that's helpful — keep going.")}
                      className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => send("Not quite — can you try a different approach?")}
                      className="px-4 py-1.5 rounded-full border border-border text-foreground text-xs font-semibold hover:bg-muted transition-colors"
                    >
                      No
                    </button>
                  </div>
                </div>
              )}


              <div className="max-w-2xl mx-auto w-full">
                {(() => {
                  const last = messages[messages.length - 1];
                  if (isLoading || last?.role !== "assistant") return null;
                  const isUrgent = /\[\[URGENT\]\]/.test(last.content);
                  return (
                    <>
                      {isUrgent && (
                        <div className="mb-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-3 animate-fade-in">
                          <p className="text-xs font-semibold uppercase tracking-wide text-destructive mb-2 text-center">
                            Emergency resources
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <a
                              href={`tel:${emergencyNumber}`}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-destructive text-destructive-foreground text-xs font-semibold hover:bg-destructive/90 transition-colors"
                            >
                              <Phone className="h-3.5 w-3.5" />
                              Call {emergencyNumber}
                            </a>
                            <Link
                              to="/cpr"
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                            >
                              <HeartPulse className="h-3.5 w-3.5" />
                              DRSABCD
                            </Link>
                            <a
                              href="https://www.goodsamapp.org/locatorMap"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border text-foreground text-xs font-semibold hover:bg-muted transition-colors"
                            >
                              <MapPin className="h-3.5 w-3.5" />
                              Nearest AED
                            </a>
                            <a
                              href="tel:131126"
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border text-foreground text-xs font-semibold hover:bg-muted transition-colors"
                            >
                              <FlaskConical className="h-3.5 w-3.5" />
                              Poisons 13 11 26
                            </a>
                            <a
                              href="tel:1800022222"
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border text-foreground text-xs font-semibold hover:bg-muted transition-colors"
                            >
                              <Stethoscope className="h-3.5 w-3.5" />
                              Healthdirect
                            </a>
                            <button
                              type="button"
                              onClick={() => send("Talk me through this one step at a time")}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors"
                            >
                              Step-by-step
                            </button>
                          </div>
                        </div>
                      )}
                      {/* Walk-through panel is rendered sticky above messages — see top of layout */}
                    </>
                  );
                })()}
                <ChatInput onSend={send} disabled={isLoading} />
                <ChatDisclaimer />
              </div>
            </>
          )}
        </div>
      </main>

      <EmergencyCallButton />
      <NetworkFooter currentApp="First Aid Angel" />
    </div>
  );
};

export default Index;
