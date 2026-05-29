import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import HamburgerMenu from "@/components/HamburgerMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import aidAngelLogo from "@/assets/aidangel-logo.png";

interface SiteHeaderProps {
  backTo?: string;
  backLabel?: string;
}

export default function SiteHeader({ backTo, backLabel }: SiteHeaderProps) {
  const { t } = useLanguage();
  return (
    <header className="border-b border-border bg-card px-4 py-4">
      <div className="max-w-4xl mx-auto flex flex-row items-center gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Link to="/" className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={aidAngelLogo}
              alt="First Aid Angel logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-lg text-foreground leading-tight truncate">
                  First Aid Angel
                </h1>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {t("appSubtitle")}
              </p>
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-end flex-shrink-0">
          <HamburgerMenu />
        </div>
      </div>
      {backTo && (
        <div className="max-w-4xl mx-auto mt-3">
          <Link
            to={backTo}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel ?? "Back"}
          </Link>
        </div>
      )}
    </header>
  );
}
