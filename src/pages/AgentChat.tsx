import { useState, useRef, useEffect } from "react";
import { Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { SeoHead } from "@/components/SeoHead";
import EmergencyBanner from "@/components/EmergencyBanner";
import ChatMessage from "@/components/ChatMessage";
import NetworkFooter from "@/components/NetworkFooter";

type Msg = { role: "user" | "assistant"; content: string };

const AGENT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-agent`;

async function streamGemini({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  onDelta: (t: string) => void;
  onDone: () => void;
  onError: (e: string) => void;
}) {
  const resp = await fetch(AGENT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });
  if (!resp.ok || !resp.body) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error || `Request failed (${resp.status})`);
    return;
  }
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (!json || json === "[DONE]") continue;
      try {
        const parsed = JSON.parse(json);
        const c = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (c) onDelta(c);
      } catch {
        /* ignore */
      }
    }
  }
  onDone();
}

const SUGGESTED = [
  "What should I do if someone is choking?",
  "How do I treat a severe burn?",
  "Signs of a stroke — what should I do?",
  "How do I perform CPR on an adult?",
];

export default function AgentChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = async (text: string) => {
    const userMsg: Msg = { role: "user", content: text };
    setMessages((p) => [...p, userMsg]);
    setIsLoading(true);

    let acc = "";
    const upsert = (chunk: string) => {
      acc += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: acc } : m));
        }
        return [...prev, { role: "assistant", content: acc }];
      });
    };

    await streamGemini({
      messages: [...messages, userMsg],
      onDelta: upsert,
      onDone: () => setIsLoading(false),
      onError: (e) => {
        setIsLoading(false);
        toast.error(e);
      },
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = input.trim();
    if (!v || isLoading) return;
    setInput("");
    send(v);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead
        title="Gemini Agent — First Aid Angel"
        description="Chat with a Gemini-powered first aid agent. Calm, practical, Australian-aligned guidance."
        basePath="/agent"
      />
      <EmergencyBanner />

      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="inline-flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-primary" />
            Gemini Agent
          </div>
          <span className="text-xs text-muted-foreground">Powered by Google Gemini</span>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 flex flex-col">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card p-4 mb-4 min-h-[50vh]"
        >
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold mb-2">Ask the First Aid Agent</h1>
              <p className="text-muted-foreground mb-6 text-sm">
                A Gemini-powered assistant for Australian first aid. In life-threatening emergencies, call{" "}
                <a href="tel:000" className="text-primary font-semibold underline">000</a>.
              </p>
              <div className="grid sm:grid-cols-2 gap-2 max-w-xl mx-auto">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left text-sm px-3 py-2 rounded-xl border border-border hover:bg-muted transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m, i) => (
                <ChatMessage key={i} message={m} />
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
                </div>
              )}
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the agent anything about first aid…"
            disabled={isLoading}
            className="flex-1 min-h-11 px-4 py-3 rounded-xl border border-input bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="min-h-11 px-5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </main>

      <NetworkFooter />
    </div>
  );
}
