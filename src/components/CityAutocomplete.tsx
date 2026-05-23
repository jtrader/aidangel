import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, Search, X } from "lucide-react";
import { loadMapboxToken } from "@/lib/mapboxLoader";

export interface SelectedPlace {
  description: string;
  city: string | null;
  region: string | null;
  country: string | null;
  lat: number;
  lng: number;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSelect: (place: SelectedPlace) => void;
  countryCode?: string;
  placeholder?: string;
  disabled?: boolean;
}

type Suggestion = {
  id: string;
  main: string;
  secondary: string;
  city: string | null;
  region: string | null;
  country: string | null;
  lat: number;
  lng: number;
};

/**
 * City / place autocomplete backed by Mapbox Geocoding v6 (forward).
 * Filtered by ISO-2 country when provided. Debounced.
 */
export function CityAutocomplete({
  value,
  onChange,
  onSelect,
  countryCode,
  placeholder,
  disabled,
}: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const debounceRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSelectedRef = useRef<string>("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const q = value.trim();
    if (q.length < 2 || q === lastSelectedRef.current) {
      setSuggestions([]);
      return;
    }
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      try {
        setLoading(true);
        const token = await loadMapboxToken();
        abortRef.current?.abort();
        const ctrl = new AbortController();
        abortRef.current = ctrl;
        const params = new URLSearchParams({
          q,
          access_token: token,
          limit: "6",
          types: "place,locality,district,neighborhood,postcode",
          autocomplete: "true",
        });
        if (countryCode) params.set("country", countryCode.toLowerCase());
        const res = await fetch(
          `https://api.mapbox.com/search/geocode/v6/forward?${params.toString()}`,
          { signal: ctrl.signal },
        );
        const data = await res.json();
        const feats: any[] = data?.features ?? [];
        const mapped: Suggestion[] = feats
          .map((f) => {
            const [lng, lat] = f.geometry?.coordinates ?? [];
            if (typeof lat !== "number" || typeof lng !== "number") return null;
            const p = f.properties ?? {};
            const ctx = p.context ?? {};
            const main = (p.name as string) ?? (p.place_formatted as string) ?? "";
            const region = (ctx.region?.name as string) ?? null;
            const country = (ctx.country?.name as string) ?? null;
            const secondary =
              [region, country].filter(Boolean).join(", ") ||
              (p.place_formatted as string) ||
              "";
            return {
              id: (p.mapbox_id as string) ?? `${lat},${lng}`,
              main,
              secondary,
              city: main || null,
              region,
              country,
              lat,
              lng,
            } as Suggestion;
          })
          .filter(Boolean) as Suggestion[];
        setSuggestions(mapped);
        setOpen(true);
        setHighlight(0);
      } catch (e: any) {
        if (e?.name !== "AbortError") setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => window.clearTimeout(debounceRef.current);
  }, [value, countryCode]);

  const choose = (s: Suggestion) => {
    const desc = s.secondary ? `${s.main}, ${s.secondary}` : s.main;
    lastSelectedRef.current = desc;
    onChange(desc);
    setOpen(false);
    setSuggestions([]);
    onSelect({
      description: desc,
      city: s.city,
      region: s.region,
      country: s.country,
      lat: s.lat,
      lng: s.lng,
    });
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          lastSelectedRef.current = "";
          onChange(e.target.value);
        }}
        onFocus={() => {
          if (suggestions.length) setOpen(true);
        }}
        onKeyDown={(e) => {
          if (!open || suggestions.length === 0) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight((h) => Math.max(h - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            choose(suggestions[highlight]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        className="w-full rounded-lg border border-border bg-background pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      {loading ? (
        <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-muted-foreground" />
      ) : value ? (
        <button
          type="button"
          onClick={() => {
            onChange("");
            setSuggestions([]);
            setOpen(false);
            lastSelectedRef.current = "";
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}

      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-lg"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              role="option"
              aria-selected={i === highlight}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(s);
              }}
              onMouseEnter={() => setHighlight(i)}
              className={`flex items-start gap-2 px-3 py-2 text-sm cursor-pointer ${
                i === highlight ? "bg-accent" : ""
              }`}
            >
              <MapPin className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
              <div className="min-w-0">
                <div className="font-medium truncate">{s.main}</div>
                {s.secondary && (
                  <div className="text-xs text-muted-foreground truncate">{s.secondary}</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
