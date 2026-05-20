import { useState, useRef, useEffect } from "react";
import { Loader2, RotateCcw, MapPin } from "lucide-react";
import { toast } from "sonner";
import EmergencyBanner from "@/components/EmergencyBanner";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import QuickActions from "@/components/QuickActions";
import DRSABCDPanel from "@/components/DRSABCDPanel";
import LanguageSelector from "@/components/LanguageSelector";
import NetworkFooter from "@/components/NetworkFooter";
import { streamChat } from "@/lib/chat-stream";
import { useLanguage } from "@/contexts/LanguageContext";
import aidAngelLogo from "@/assets/aidangel-logo.png";

type Msg = { role: "user" | "assistant"; content: string };
type ChatStatus = "idle" | "thinking" | "guiding";

const Index = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <EmergencyBanner />

      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3">
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
              <img src={aidAngelLogo} alt="First Aid Angel logo" className="w-10 h-10 rounded-xl object-cover" />
              <div className="flex-1">
                <h1 className="font-display font-bold text-lg text-foreground leading-tight">
                  First Aid Angel
                </h1>
                <p className="text-xs text-muted-foreground">
                  {t("appSubtitle")}
                </p>
              </div>
            </a>
          </div>
          <div className="flex justify-center sm:justify-end items-center gap-2">
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main ref={scrollRef} className="flex-1 px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {isEmpty ? (
            <>
              <div className="text-center space-y-3">
                <img src={aidAngelLogo} alt="First Aid Angel" className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover mx-auto" />
                <h2 className="font-display font-bold text-xl sm:text-2xl text-foreground px-2">
                  {t("welcomeHeading")}
                </h2>
              </div>

              {/* Input directly below the welcome heading */}
              <div className="max-w-2xl mx-auto w-full">
                <ChatInput onSend={send} disabled={isLoading} />
                <p className="text-center text-xs text-muted-foreground mt-2">
                  {t("disclaimer").split("000").map((part, i, arr) =>
                    i < arr.length - 1 ? (
                      <span key={i}>{part}<a href="tel:000" className="underline font-semibold hover:text-foreground transition-colors">000</a></span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </p>
              </div>

              <div className="text-center space-y-3">
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  {t("welcomeDescription")}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <a
                    href="https://www.goodsamapp.org/locatorMap"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    aria-label="Find nearest AED"
                  >
                    <MapPin className="h-4 w-4" />
                    AED Finder
                  </a>
                </div>
              </div>

              <QuickActions onSelect={send} />
              <DRSABCDPanel onSelect={send} />
            </>
          ) : (
            <>
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <ChatMessage key={i} message={msg} onAction={send} />
                ))}
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

              <div className="text-center">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-foreground px-2">
                  {t("welcomeHeading")}
                </h2>
              </div>

              <div className="max-w-2xl mx-auto w-full">
                {(() => {
                  const last = messages[messages.length - 1];
                  if (isLoading || last?.role !== "assistant") return null;
                  const isTriage = /\[\[TRIAGE\]\]/.test(last.content);
                  const inWalkthrough =
                    /\[\[STEP\]\]/.test(last.content) &&
                    !/\[\[STEP_END\]\]/.test(last.content);
                  if (isTriage) {
                    return (
                      <div className="flex flex-wrap items-center justify-center gap-2 mb-3 animate-fade-in">
                        <button
                          type="button"
                          onClick={() => send("This is happening right now")}
                          className="px-3 py-1.5 rounded-full bg-destructive text-destructive-foreground text-xs font-semibold hover:bg-destructive/90 transition-colors"
                        >
                          🚨 Happening now
                        </button>
                        <button
                          type="button"
                          onClick={() => send("I'm just brushing up for later")}
                          className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors"
                        >
                          📚 Just learning
                        </button>
                      </div>
                    );
                  }
                  if (!inWalkthrough) return null;
                  return (
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-3 animate-fade-in">
                      <span className="text-xs text-muted-foreground mr-1">Walk-through:</span>
                      <button
                        type="button"
                        onClick={() => send("next")}
                        className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                      >
                        Next →
                      </button>
                      <button
                        type="button"
                        onClick={() => send("back")}
                        className="px-3 py-1.5 rounded-full bg-muted text-foreground text-xs font-medium hover:bg-muted/80 transition-colors"
                      >
                        Repeat
                      </button>
                      <button
                        type="button"
                        onClick={() => send("done")}
                        className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
                      >
                        Done ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => send("stop")}
                        className="px-3 py-1.5 rounded-full border border-border text-muted-foreground text-xs font-medium hover:bg-muted transition-colors"
                      >
                        Stop
                      </button>
                    </div>
                  );
                })()}
                <ChatInput onSend={send} disabled={isLoading} />
                <p className="text-center text-xs text-muted-foreground mt-2">
                  {t("disclaimer").split("000").map((part, i, arr) =>
                    i < arr.length - 1 ? (
                      <span key={i}>{part}<a href="tel:000" className="underline font-semibold hover:text-foreground transition-colors">000</a></span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      <NetworkFooter currentApp="First Aid Angel" />
    </div>
  );
};

export default Index;
