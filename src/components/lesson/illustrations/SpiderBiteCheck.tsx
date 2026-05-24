const OUTLINE = "#333333";
const SILVER = "#E5E7EB";
const SILVER_2 = "#CBD5E1";
const SLATE = "#94A3B8";
const SLATE_2 = "#475569";
const RED = "#F20822";
const RED_LIGHT = "#FF4D5A";

export default function SpiderBiteCheck({ className }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 1 400 260"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <title>Spider Bite Check</title>
      <defs>
        <marker
          id="swell-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <polygon points="0 0, 8 4, 0 8" fill={RED} />
        </marker>
      </defs>

      {/* Outer skin boundary - large rounded skin patch */}
      <rect
        x="60"
        y="30"
        width="280"
        height="200"
        rx="24"
        fill={SILVER}
        stroke={OUTLINE}
        strokeWidth="3"
      />

      {/* Skin texture subtle lines */}
      <line x1="80" y1="60" x2="320" y2="60" stroke={SLATE} strokeWidth="1" opacity="0.25" />
      <line x1="80" y1="100" x2="320" y2="100" stroke={SLATE} strokeWidth="1" opacity="0.2" />
      <line x1="80" y1="140" x2="320" y2="140" stroke={SLATE} strokeWidth="1" opacity="1" opacity="0.15" />
      <line x1="80" y1="180" x2="320" y2="180" stroke={SLATE} strokeWidth="1" opacity="0.2" />
      <line x1="110" y1="50" x2="110" y2="210" stroke={SLATE} strokeWidth="1" opacity="0.15" />
      <line x1="200" y1="50" x2="200" y2="210" stroke={SLATE} strokeWidth="1" opacity="0.2" />
      <line x1="290" y1="50" x2="290" y2="210" stroke={SLATE} strokeWidth="1" opacity="0.15" />

      {/* Swelling zone - slightly darker / inflamed skin area around bite */}
      <ellipse
        cx="200"
        cy="130"
        rx="75"
        ry="60"
        fill={SILVER_2}
        fillOpacity="0.6"
        stroke={SLATE_2}
        strokeWidth="2"
        strokeDasharray="6 4"
        opacity="0.7"
      />

      {/* Slate-grey radial swelling lines — indicating inflammation spreading outward */}
      {/* Radial dash lines emanating from bite center */}
      <line x1="200" y1="130" x2="155" y2="90" stroke={SLATE} strokeWidth="2" strokeDasharray="5 3" opacity="0.6" />
      <line x1="200" y1="130" x2="140" y2="130" stroke={SLATE} strokeWidth="2" strokeDasharray="5 3" opacity="0.6" />
      <line x1="200" y1="130" x2="155" y2="170" stroke={SLATE} strokeWidth="2" strokeDasharray="5 3" opacity="0.6" />
      <line x1="200" y1="130" x2="200" y2="190" stroke={SLATE} strokeWidth="2" strokeDasharray="5 3" opacity="0.6" />
      <line x1="200" y1="130" x2="245" y2="170" stroke={SLATE} strokeWidth="2" strokeDasharray="5 3" opacity="0.6" />
      <line x1="200" y1="130" x2="260" y2="130" stroke={SLATE} strokeWidth="2" strokeDasharray="5 3" opacity="0.6" />
      <line x1="200" y1="130" x2="245" y2="90" stroke={SLATE} strokeWidth="2" strokeDasharray="5 3" opacity="0.6" />
      <line x1="200" y1="130" x2="200" y2="70" stroke={SLATE} strokeWidth="2" strokeDasharray="5 3" opacity="0.6" />

      {/* Additional outer radial swelling arcs */}
      <path d="M 170 80 Q 200 65 230 80" fill="none" stroke={SLATE} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
      <path d="M 145 105 Q 130 130 145 155" fill="none" stroke={SLATE} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
      <path d="M 255 105 Q 270 130 255 155" fill="none" stroke={SLATE} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
      <path d="M 170 180 Q 200 195 230 180" fill="none" stroke={SLATE} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />

      {/* Emergency Red circular target ripple — expanding rings from bite site */}
      {/* Outermost ring */}
      <circle cx="200" cy="130" r="65" fill="none" stroke={RED} strokeWidth="2.5" opacity="0.35" />
      {/* Second ring */}
      <circle cx="200" cy="130" r="48" fill="none" stroke={RED} strokeWidth="3" opacity="0.5" />
      {/* Third ring */}
      <circle cx="200" cy="130" r="32" fill="none" stroke={RED} strokeWidth="3.5" opacity="0.65" />
      {/* Innermost ring */}
      <circle cx="200" cy="130" r="18" fill="none" stroke={RED_LIGHT} strokeWidth="4" opacity="0.8" />

      {/* Red highlight glow zone around punctures */}
      <circle cx="200" cy="130" r="14" fill={RED} fillOpacity="0.15" stroke="none" />

      {/* The two puncture pinpricks — tiny dark charcoal dots, slightly angled as fang marks */}
      <circle cx="194" cy="128" r="2.5" fill={OUTLINE} stroke={OUTLINE} strokeWidth="1" />
      <circle cx="206" cy="128" r="2.5" fill={OUTLINE} stroke={OUTLINE} strokeWidth="1" />

      {/* Tiny red irritation dots around punctures */}
      <circle cx="190" cy="124" r="1.5" fill={RED_LIGHT} opacity="0.6" />
      <circle cx="210" cy="124" r="1.5" fill={RED_LIGHT} opacity="0.6" />
      <circle cx="192" cy="136" r="1.5" fill={RED_LIGHT} opacity="0.5" />
      <circle cx="208" cy="136" r="1.5" fill={RED_LIGHT} opacity="0.5" />

      {/* Red action target brackets pointing inward toward the bite */}
      <line x1="175" y1="115" x2="190" y2="125" stroke={RED} strokeWidth="2.5" markerEnd="url(#swell-arrow)" opacity="0.9" />
      <line x1="225" y1="115" x2="210" y2="125" stroke={RED} strokeWidth="2.5" markerEnd="url(#swell-arrow)" opacity="0.9" />
      <line x1="175" y1="145" x2="190" y2="135" stroke={RED} strokeWidth="2.5" markerEnd="url(#swell-arrow)" opacity="0.85" />
      <line x1="225" y1="145" x2="210" y2="135" stroke={RED} strokeWidth="2.5" markerEnd="url(#swell-arrow)" opacity="0.85" />

      {/* Central red crosshair / target dot */}
      <circle cx="200" cy="130" r="5" fill={RED} stroke={OUTLINE} strokeWidth="1.5" />

      {/* Callout label */}
      <text
        x="200"
        y="245"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="11"
        fontWeight="700"
        fill={SLATE_2}
        letterSpacing="0.06em"
      >
        CHECK FOR PUNCTURE MARKS
      </text>

      {/* Hidden text for screen readers */}
      <text x="200" y="250" textAnchor="middle" fill="none" fontSize="1">
        A close-up view of skin showing a spider bite with two puncture marks, surrounded by red target rings indicating the bite zone and radial lines showing swelling and inflammation.
      </text>
    </svg>
  );
}
