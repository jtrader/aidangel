import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, Search, X } from "lucide-react";
import { loadGoogleMaps } from "@/lib/googleMapsLoader";

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

/**
 * Google Places (New) autocomplete bound to a single country.
 * Loads the Places library lazily on first focus to keep initial bundle light.
 */
export function CityAutocomplete({
  value,
  onChange,
  onSelect,
  countryCode,
  placeholder,
  disabled,
}: Props) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const sessionTokenRef = useRef<any>(null);
  const placesLibRef = useRef<any>(null);
  const debounceRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSelectedRef = useRef<string>("");

  const ensureLib = async () => {
    if (placesLibRef.current) return placesLibRef.current;
    await loadGoogleMaps();
    const lib: any = await window.google.maps.importLibrary("places");
    placesLibRef.current = lib;
    sessionTokenRef.current = new lib.AutocompleteSessionToken();
    return lib;
  };

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Debounced fetch when value changes (skip if value matches a just-picked suggestion)
  useEffect(() => {
    const q = value.trim();
    if (q.length < 2 || q === lastSelectedRef.current) {
      setSuggestions([]);
      return;
    }
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      try {
        const lib = await ensureLib();
        setLoading(true);
        const req: any = {
          input: q,
          sessionToken: sessionTokenRef.current,
          includedPrimaryTypes: [
            "locality",
            "sublocality",
            "postal_code",
            "administrative_area_level_2",
            "neighborhood",
          ],
        };
        if (countryCode) req.includedRegionCodes = [countryCode.toLowerCase()];
        const { suggestions: sugg } =
          await lib.AutocompleteSuggestion.fetchAutocompleteSuggestions(req);
        setSuggestions(sugg ?? []);
        setOpen(true);
        setHighlight(0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => window.clearTimeout(debounceRef.current);
  }, [value, countryCode]);

  const choose = async (sugg: any) => {
    try {
      const pred = sugg?.placePrediction;
      if (!pred) return;
      const place = pred.toPlace();
      await place.fetchFields({
        fields: ["location", "displayName", "formattedAddress", "addressComponents"],
      });
      const components: any[] = place.addressComponents ?? [];
      const findComp = (type: string) =>
        components.find((c) => c.types?.includes(type))?.longText ?? null;
      const city =
        findComp("locality") ??
        findComp("postal_town") ??
        findComp("sublocality") ??
        pred.mainText?.text ??
        null;
      const region = findComp("administrative_area_level_1");
      const country = findComp("country");
      const lat = place.location?.lat?.();
      const lng = place.location?.lng?.();
      if (typeof lat !== "number" || typeof lng !== "number") return;
      const desc =
        pred.text?.text ??
        `${city ?? ""}${region ? `, ${region}` : ""}`.replace(/^,\s*/, "");
      lastSelectedRef.current = desc;
      onChange(desc);
      setOpen(false);
      setSuggestions([]);
      // Rotate session token after each selection (Places billing best practice)
      if (placesLibRef.current) {
        sessionTokenRef.current = new placesLibRef.current.AutocompleteSessionToken();
      }
      onSelect({ description: desc, city, region, country, lat, lng });
    } catch {
      /* ignore */
    }
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
          ensureLib().catch(() => {});
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
            void choose(suggestions[highlight]);
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
          {suggestions.map((s, i) => {
            const pred = s?.placePrediction;
            const main = pred?.mainText?.text ?? "";
            const secondary = pred?.secondaryText?.text ?? "";
            return (
              <li
                key={pred?.placeId ?? i}
                role="option"
                aria-selected={i === highlight}
                onMouseDown={(e) => {
                  e.preventDefault();
                  void choose(s);
                }}
                onMouseEnter={() => setHighlight(i)}
                className={`flex items-start gap-2 px-3 py-2 text-sm cursor-pointer ${
                  i === highlight ? "bg-accent" : ""
                }`}
              >
                <MapPin className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium truncate">{main}</div>
                  {secondary && (
                    <div className="text-xs text-muted-foreground truncate">{secondary}</div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
