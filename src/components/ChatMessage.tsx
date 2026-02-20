import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: Message;
  onAction?: (text: string) => void;
}

const ChatMessage = ({ message, onAction }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-3 ${
          isUser
            ? "chat-bubble-user"
            : "chat-bubble-assistant"
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-card-foreground prose-strong:text-foreground prose-li:text-card-foreground prose-ol:text-card-foreground prose-ul:text-card-foreground prose-a:text-primary prose-a:font-semibold prose-a:underline">
            <ReactMarkdown
              components={{
                a: ({ href, children, ...props }) => {
                  if (href === '#drsabcd') {
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
                  return (
                    <a href={href} className="text-primary underline font-semibold hover:text-foreground transition-colors" {...props}>{children}</a>
                  );
                },
              }}
            >
              {message.content
                .replace(/\b000\b/g, '[000](tel:000)')
                .replace(/\bDRSABCD\b/g, '[DRSABCD](#drsabcd)')
              }
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
