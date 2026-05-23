import { useState, useCallback, useEffect } from "react";
import { Map, Marker, NavigationControl, GeolocateControl, Popup } from "react-map-gl/mapbox";
import { MapPin, AlertCircle, Loader2, Navigation, X, Cross } from "lucide-react";
import type { Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { SeoHead } from "@/components/SeoHead";
import { useCountry } from "@/hooks/useCountry";
import { useLanguage } from "@/contexts/LanguageContext";
import { emergencyNumberForCountry } from "@/lib/donations";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// Sample AED data for Australia (sourced from public registries / approximated)
// In production this should be fetched from an API (e.g. GoodSAM, state ambulance services)
const SAMPLE_AEDS: Array<{
  id: string;
  lat: number;
  lng: number;
  name: string;
  address: string;
  access: "public" | "restricted" | "unknown";
}> = [
  { id: "1", lat: -33.8688, lng: 151.2093, name: "Martin Place", address: "Martin Place, Sydney NSW", access: "public" },
  { id: "2", lat: -33.8568, lng: 151.2153, name: "Circular Quay Station", address: "Circular Quay, Sydney NSW", access: "public" },
  { id: "3", lat: -33.8523, lng: 151.2108, name: "Wynyard Station", address: "Wynyard, Sydney NSW", access: "public" },
  { id: "4", lat: -33.8179, lng: 151.0051, name: "Parramatta Station", address: "Parramatta NSW", access: "public" },
  { id: "5", lat: -37.8136, lng: 144.9631, name: "Flinders Street Station", address: "Flinders St, Melbourne VIC", access: "public" },
  { id: "6", lat: -37.8175, lng: 144.9671, name: "Southern Cross Station", address: "Spencer St, Melbourne VIC", access: "public" },
  { id: "7", lat: -37.8114, lng: 144.9568, name: "Melbourne Central", address: "Melbourne Central, VIC", access: "public" },
  { id: "8", lat: -27.4698, lng: 153.0251, name: "Queen Street Mall", address: "Queen St, Brisbane QLD", access: "public" },
  { id: "9", lat: -27.4679, lng: 153.0270, name: "Brisbane Central Station", address: "Brisbane QLD", access: "public" },
  { id: "10", lat: -31.9505, lng: 115.8605, name: "Perth Station", address: "Perth WA", access: "public" },
  { id: "11", lat: -31.9558, lng: 115.8600, name: "Elizabeth Quay", address: "Elizabeth Quay, Perth WA", access: "public" },
  { id: "12", lat: -34.9285, lng: 138.6007, name: "Adelaide Station", address: "Adelaide SA", access: "public" },
  { id: "13", lat: -35.2809, lng: 149.1300, name: "Canberra Centre", address: "Canberra ACT", access: "public" },
  { id: "14", lat: -42.8821, lng: 147.3272, name: "Hobart CBD", address: "Hobart TAS", access: "public" },
  { id: "15", lat: -12.4634, lng: 130.8456, name: "Darwin CBD", address: "Darwin NT", access: "public" },
];

const DEFAULT_VIEW = {
  longitude: 133.7751,
  latitude: -25.2744,
  zoom: 4,
};

function accessLabel(access: string) {
  switch (access) {
    case "public": return "Public access";
    case "restricted": return "Restricted access";
    default: return "Access unknown";
  }
}

function accessColor(access: string) {
  switch (access) {
    case "public": return "bg-emerald-500";
    case "restricted": return "bg-amber-500";
    default: return "bg-slate-400";
  }
}

export default function AedFinder() {
  const { code: countryCode } = useCountry();
  const { language } = useLanguage();
  const emergencyNumber = emergencyNumberForCountry(countryCode);
  const [selected, setSelected] = useState<typeof SAMPLE_AEDS[number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [viewState, setViewState] = useState(DEFAULT_VIEW);

  const onMapLoad = useCallback((evt: { target: MapboxMap }) => {
    setMapLoaded(true);
  }, []);

  // Try to get user location and zoom to it
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({ lat, lng });
        setViewState({ longitude: lng, latitude: lat, zoom: 14 });
      },
      () => {
        // keep default view if geolocation fails
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, []);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h1 className="font-display font-bold text-xl text-foreground mb-2">Mapbox token missing</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Please add your Mapbox public access token as{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">VITE_MAPBOX_ACCESS_TOKEN</code>{" "}
          in your environment variables.
        </p>
        <a
          href="https://account.mapbox.com/access-tokens/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-primary underline text-sm"
        >
          Get a token from Mapbox
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SeoHead
        lang={language}
        basePath="/aed-finder"
        title="AED Finder — First Aid Angel"
        description="Find your nearest defibrillator (AED) on an interactive map."
      />

      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cross className="w-5 h-5 text-destructive" />
            <h1 className="font-display font-bold text-lg text-foreground">AED Finder</h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${emergencyNumber}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive text-destructive-foreground text-sm font-bold hover:bg-destructive/90 transition-colors"
            >
              Call {emergencyNumber}
            </a>
          </div>
        </div>
      </header>

      {/* Map */}
      <div className="relative flex-1 min-h-[500px]">
        {!mapLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm gap-2">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="text-sm text-muted-foreground">Loading map…</span>
          </div>
        )}

        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          style={{ width: "100%", height: "100%", minHeight: "500px" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
          onLoad={onMapLoad}
          attributionControl={true}
        >
          <NavigationControl position="top-right" />
          <GeolocateControl position="top-right" />

          {/* User location marker */}
          {userLocation && (
            <Marker longitude={userLocation.lng} latitude={userLocation.lat} anchor="bottom">
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-primary border-2 border-white shadow-md" />
                <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
              </div>
            </Marker>
          )}

          {/* AED markers */}
          {SAMPLE_AEDS.map((aed) => (
            <Marker
              key={aed.id}
              longitude={aed.lng}
              latitude={aed.lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelected(aed);
              }}
            >
              <button
                type="button"
                className="group relative"
                aria-label={`AED at ${aed.name}`}
              >
                <div className={`w-6 h-6 rounded-full ${accessColor(aed.access)} border-2 border-white shadow-md flex items-center justify-center`}>
                  <Cross className="w-3 h-3 text-white" />
                </div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[10px] font-semibold px-2 py-0.5 rounded whitespace-nowrap pointer-events-none">
                  {aed.name}
                </div>
              </button>
            </Marker>
          ))}

          {/* Selected AED popup */}
          {selected && (
            <Popup
              longitude={selected.lng}
              latitude={selected.lat}
              anchor="top"
              offset={[0, -10]}
              onClose={() => setSelected(null)}
              closeButton={false}
              className="aed-popup"
            >
              <div className="p-1 min-w-[200px]">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Cross className="w-4 h-4 text-destructive" />
                    <span className="font-semibold text-sm text-foreground">{selected.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="p-0.5 rounded hover:bg-muted"
                    aria-label="Close"
                  >
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{selected.address}</p>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className={`w-2 h-2 rounded-full ${accessColor(selected.access)}`} />
                  <span className="text-xs text-muted-foreground">{accessLabel(selected.access)}</span>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  <Navigation className="w-3 h-3" />
                  Directions
                </a>
              </div>
            </Popup>
          )}
        </Map>
      </div>

      {/* Footer info */}
      <div className="border-t border-border bg-card px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            Showing {SAMPLE_AEDS.length} sample AED locations across Australia.
          </p>
          <a
            href="https://www.goodsamapp.org/locatorMap"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary underline hover:text-primary/80 transition-colors"
          >
            View more on GoodSAM →
          </a>
        </div>
      </div>
    </div>
  );
}
