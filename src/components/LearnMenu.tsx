import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { useCountry } from "@/hooks/useCountry";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { citySlug } from "@/lib/educators";
import { getCountry } from "@/lib/donations";

interface LearnMenuProps {
  variant?: "header" | "footer";
}

export default function LearnMenu({ variant = "header" }: LearnMenuProps) {
  const { country } = useCountry();
  const { geo } = useGeoLocation();

  // Prefer detected city/country when available
  const effectiveCountry = (geo?.country && getCountry(geo.country)) || country;
  const cc = effectiveCountry.code.toLowerCase();
  const href = geo?.city
    ? `/learn/${cc}/${citySlug(geo.city)}`
    : `/learn/${cc}`;

  const classes =
    "inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors";

  const label = geo?.city ?? effectiveCountry.name;

  return (
    <Link
      to={href}
      className={classes}
      aria-label={`Learn first aid — ${label}`}
      title={geo?.city ? `Courses near ${geo.city}` : `Courses in ${effectiveCountry.name}`}
    >
      <GraduationCap className="h-4 w-4" aria-hidden="true" />
      <span className="sm:hidden">Learn</span>
      <span className="hidden sm:inline truncate max-w-[140px]">
        Learn First Aid
      </span>
    </Link>
  );
}
