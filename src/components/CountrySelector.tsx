import { Globe2, Check } from "lucide-react";
import { useCountry } from "@/hooks/useCountry";
import { COUNTRIES, CountryCode } from "@/lib/donations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CountrySelectorProps {
  variant?: "compact" | "full";
}

export default function CountrySelector({ variant = "full" }: CountrySelectorProps) {
  const { code, country, setCountry } = useCountry();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-foreground hover:bg-muted/80 transition-colors text-xs font-medium"
        aria-label="Select country"
        title="Select your country"
      >
        <Globe2 className="h-3.5 w-3.5" />
        <span aria-hidden="true" className="text-sm leading-none">{country.flag}</span>
        {variant === "full" && (
          <span className="truncate max-w-[140px]">{country.name}</span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-60 bg-popover max-h-80 overflow-y-auto">
        <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Country / Region
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {COUNTRIES.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onSelect={() => setCountry(c.code as CountryCode)}
            className="cursor-pointer"
          >
            <span aria-hidden="true" className="mr-2">{c.flag}</span>
            <span className="flex-1">{c.name}</span>
            {code === c.code && <Check className="h-3.5 w-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
