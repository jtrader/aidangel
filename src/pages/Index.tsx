import { useState, useRef, useEffect } from "react";
import { Loader2, RotateCcw, HandHeart, MapPin, ShoppingBag } from "lucide-react";
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

const Index = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async (input: string) => {
    const userMsg: Msg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
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
        onDone: () => setIsLoading(false),
        onError: (err) => {
          toast.error(err);
          setIsLoading(false);
        },
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to get a response. Please try again.");
      setIsLoading(false);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-screen bg-background">
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
            <a
              href="https://www.stjohnvic.com.au/support-us/donations-2016-12/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              aria-label="Donate to St John Ambulance"
            >
              <HandHeart className="h-4 w-4" />
              Donate
            </a>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
              <div className="text-center space-y-3">
                <img src={aidAngelLogo} alt="First Aid Angel" className="w-20 h-20 rounded-2xl object-cover mx-auto" />
                <h2 className="font-display font-bold text-2xl text-foreground">
                  {t("welcomeHeading")}
                </h2>
                <p className="text-muted-foreground text-sm max-w-md">
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
                  <a
                    href="https://shop.stjohn.org.au/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    aria-label="St John First Aid Shop"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    St John First Aid Shop
                  </a>
                </div>
              </div>
              <QuickActions onSelect={send} />
              <DRSABCDPanel onSelect={send} />
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} onAction={send} />
              ))}
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
                  </div>
                  <div className="chat-bubble-assistant px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card px-4 py-4">
        <div className="max-w-3xl mx-auto">
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
      </div>

      <NetworkFooter currentApp="First Aid Angel" />
    </div>
  );
};

export default Index;
