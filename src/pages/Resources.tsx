import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { programs, pillarMeta, type Pillar } from "@/data/programs";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const filterPillars: (Pillar | "all")[] = ["all", "immediate", "financial", "housing", "emotional", "business"];

const Resources = () => {
  const [filter, setFilter] = useState<Pillar | "all">("all");

  const visible = useMemo(
    () => (filter === "all" ? programs : programs.filter((p) => p.pillar === filter)),
    [filter]
  );

  return (
    <SiteLayout>
      <section className="container max-w-6xl mx-auto px-4 pt-12 pb-8">
        <h1 className="font-display font-bold text-4xl sm:text-5xl">All recovery resources</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          A complete directory of the support we track. For a personalised list,{" "}
          <Link to="/assessment" className="text-primary underline-offset-4 hover:underline font-medium">
            take the short assessment
          </Link>.
        </p>

        <div className="flex flex-wrap gap-2 mt-8">
          {filterPillars.map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm border transition-colors capitalize",
                filter === p
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              {p === "all" ? "All" : pillarMeta[p].label}
            </button>
          ))}
        </div>
      </section>

      <section className="container max-w-6xl mx-auto px-4 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => {
            const meta = pillarMeta[p.pillar];
            return (
              <a
                key={p.id}
                href={p.url}
                target={p.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-glow transition-all flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[11px] font-semibold uppercase tracking-widest px-2 py-1 rounded"
                    style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
                  >
                    {meta.label}
                  </span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="text-xs text-muted-foreground">{p.provider}</div>
                <h3 className="font-display font-semibold text-base mt-1 leading-snug">{p.name}</h3>
                <div className="text-sm font-medium text-primary mt-2">{p.amount}</div>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed flex-1">{p.description}</p>
                <div className="mt-4 inline-flex items-center text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  Learn more <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Resources;
