import { useState, useRef, useEffect } from "react";
import { Cross, Loader2 } from "lucide-react";
import { toast } from "sonner";
import EmergencyBanner from "@/components/EmergencyBanner";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import QuickActions from "@/components/QuickActions";
import { streamChat } from "@/lib/chat-stream";

type Msg = { role: "user" | "assistant"; content: string };

const Index = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-lg">+</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-foreground leading-tight">
              First Aid Assistant
            </h1>
            <p className="text-xs text-muted-foreground">
              Powered by Australian First Aid 5th Edition • St John Ambulance
            </p>
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
                <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto">
                  <span className="text-3xl">🩺</span>
                </div>
                <h2 className="font-display font-bold text-2xl text-foreground">
                  How can I help?
                </h2>
                <p className="text-muted-foreground text-sm max-w-md">
                  Ask me about any first aid situation. I'll provide step-by-step
                  guidance based on the Australian First Aid manual.
                </p>
              </div>
              <QuickActions onSelect={send} />
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
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
            Not a substitute for professional medical advice. Always call 000 in emergencies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
