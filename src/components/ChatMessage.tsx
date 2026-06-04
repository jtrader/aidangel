import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";
import { Link } from "react-router-dom";
import { findTopicBySection } from "@/lib/kb";
import { useCountry } from "@/hooks/useCountry";
import { emergencyNumberForCountry } from "@/lib/donations";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: Message;
  onAction?: (text: string) => void;
}

/**
 * Replace `(AFA5 — Section Name)` (or `AFA5 - Section Name`, with em/en/hyphen dashes)
 * with a markdown link to the matching knowledge-base topic, when one exists.
 * Falls back to a link to the KB index when no specific match is found.
 */
function linkAfaCitations(text: string): string {
  return text.replace(
    /\(?\bAFA5\s*[—–-]\s*([^)\n.]+?)\)?(?=[\s.,;:!?\n]|$)/g,
    (match, sectionName: string) => {
      const clean = sectionName.trim().replace(/[.,;:!?)\]]+$/, "");
      const topic = findTopicBySection(clean);
      const href = topic ? `/kb/${topic.slug}` : `/kb`;
      const label = `AFA5 — ${clean}`;
      // Preserve surrounding parens if they were in the source.
      const wrapped = match.trim().startsWith("(") ? `([${label}](${href}))` : `[${label}](${href})`;
      return wrapped;
    },
  );
}

const ChatMessage = ({ message, onAction }: ChatMessageProps) => {
  const isUser = message.role === "user";
  const { code: countryCode } = useCountry();
  const emergencyNumber = emergencyNumberForCountry(countryCode);

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-3 ${
          isUser ? "chat-bubble-user" : "chat-bubble-assistant"
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-card-foreground prose-strong:text-foreground prose-li:text-card-foreground prose-ol:text-card-foreground prose-ul:text-card-foreground prose-a:text-primary prose-a:font-semibold prose-a:underline">
            <ReactMarkdown
              components={{
                a: ({ href, children, ...props }) => {
                  if (href === "#drsabcd") {
                    return (
                      <button
                        type="button"
                        onClick={() => onAction?.("What is DRSABCD?")}
                        className="text-primary underline font-semibold hover:text-foreground transition-colors cursor-pointer"
                      >
                        {children}
                      </button>
                    );
                  }
                  if (href?.startsWith("/")) {
                    return (
                      <Link
                        to={href}
                        className="text-primary underline font-semibold hover:text-foreground transition-colors"
                      >
                        {children}
                      </Link>
                    );
                  }
                  return (
                    <a
                      href={href}
                      className="text-primary underline font-semibold hover:text-foreground transition-colors"
                      {...props}
                    >
                      {children}
                    </a>
                  );
                },
              }}
            >
              {linkAfaCitations(
                message.content
                  .replace(/\[\[(?:STEP(?::\d+\/\d+)?(?:_END)?|URGENT)\]\]/g, "")
                  .trim()
                  .replace(/\b000\b/g, `[${emergencyNumber}](tel:${emergencyNumber})`)
                  .replace(/\bDRSABCD\b/g, "[DRSABCD](#drsabcd)"),
              )}
            </ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
