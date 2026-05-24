import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import { remarkLessonDirectives } from "@/lib/remarkLessonDirectives";
import Callout from "./Callout";
import Steps from "./Steps";
import Checklist from "./Checklist";
import KnowledgeCheck from "./KnowledgeCheck";
import Scenario from "./Scenario";

interface Props {
  children: string;
}

export default function LessonContent({ children }: Props) {
  return (
    <div className="prose prose-sm md:prose-base max-w-none prose-headings:font-display prose-headings:text-foreground prose-h2:mt-8 prose-h2:mb-3 prose-h3:mt-6 prose-h3:mb-2 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:bg-accent/40 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-li:marker:text-primary">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkDirective, remarkLessonDirectives]}
        components={{
          callout: Callout as any,
          steps: Steps as any,
          checklist: Checklist as any,
          quiz: KnowledgeCheck as any,
          scenario: Scenario as any,
        } as any}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
