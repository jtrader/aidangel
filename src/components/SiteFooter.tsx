import { Link } from "react-router-dom";
import { Heart, Phone } from "lucide-react";

const SiteFooter = () => {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="container max-w-6xl mx-auto py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="font-display font-bold text-lg">Aid Angel</div>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">
            A warm light on the path to recovery. Helping Victorians find financial aid
            and recovery support after disaster.
          </p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Navigate</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/assessment" className="hover:text-primary transition-colors">Start your relief path</Link></li>
            <li><Link to="/resources" className="hover:text-primary transition-colors">All resources</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">In an emergency</div>
          <a
            href="tel:000"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emergency text-emergency-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Phone className="h-4 w-4" /> Call 000
          </a>
          <p className="text-xs text-muted-foreground mt-3">
            For life-threatening situations, always call <a href="tel:000" className="underline font-semibold">000</a> first.
          </p>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="container max-w-6xl mx-auto py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p className="flex items-center gap-1">
            © 2026 Aid Angel — part of the Love Key family <Heart className="h-3 w-3 inline text-primary" />
          </p>
          <p>No login. No tracking. Free to use.</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
