import { Mail, Phone, AlertTriangle } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";

const Contact = () => {
  return (
    <SiteLayout>
      <section className="container max-w-3xl mx-auto px-4 pt-16 pb-12">
        <h1 className="font-display font-bold text-4xl sm:text-5xl">Get in touch</h1>
        <p className="text-muted-foreground mt-4 text-lg">
          For partnerships, feedback, or to suggest a support program we should add.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-10">
          <a
            href="mailto:hello@aidangel.org"
            className="rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <div className="font-display font-semibold mt-4">Email us</div>
            <div className="text-sm text-muted-foreground mt-1">hello@aidangel.org</div>
          </a>

          <a
            href="tel:131114"
            className="rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
              <Phone className="h-5 w-5" />
            </div>
            <div className="font-display font-semibold mt-4">Lifeline</div>
            <div className="text-sm text-muted-foreground mt-1">13 11 14 — 24/7 crisis support</div>
          </a>
        </div>

        <div className="mt-10 rounded-2xl border border-emergency/30 bg-emergency/5 p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emergency text-emergency-foreground flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display font-semibold">In an emergency</div>
              <p className="text-sm text-muted-foreground mt-1">
                If you or someone you love is in immediate danger, call{" "}
                <a href="tel:000" className="font-semibold text-emergency underline">000</a>{" "}
                straight away.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Contact;
