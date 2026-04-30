import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";

const principles = [
  { title: "Calm.", body: "No flashing red banners. No urgency theatre." },
  { title: "Plain.", body: "One question at a time, in everyday language." },
  { title: "Honest.", body: "We point to official sources. We never pretend to be the government." },
  { title: "Private.", body: "No login, no sensitive documents, no tracking your identity." },
];

const About = () => {
  return (
    <SiteLayout>
      <section className="container max-w-3xl mx-auto px-4 pt-16 pb-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-card border border-border mb-6">
          <Heart className="h-6 w-6 text-primary" fill="currentColor" />
        </div>
        <h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight">
          A warm light, when life feels dark.
        </h1>
        <p className="text-muted-foreground mt-5 leading-relaxed text-lg">
          Aid Angel is a mobile-first recovery navigator built for people in Victoria,
          Australia who have been affected by bushfires, floods, storms, cyclones or
          landslides. We exist to make the maze of disaster support feel simple, human
          and reachable.
        </p>
      </section>

      <section className="container max-w-3xl mx-auto px-4 pb-12">
        <h2 className="font-display font-bold text-2xl">Our principles</h2>
        <ul className="mt-5 space-y-4">
          {principles.map((p) => (
            <li key={p.title} className="rounded-xl border border-border bg-card p-5">
              <span className="font-display font-semibold text-foreground">{p.title}</span>{" "}
              <span className="text-muted-foreground">{p.body}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="container max-w-3xl mx-auto px-4 pb-16">
        <h2 className="font-display font-bold text-2xl">The Love Key family</h2>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          Aid Angel sits alongside Guardian Guide, Crisis Compass and Love Link Victoria —
          a family of products built around one simple idea: technology should reach
          for the hand of the person who needs it most.
        </p>

        <Link
          to="/assessment"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-opacity"
        >
          Find help now <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </SiteLayout>
  );
};

export default About;
