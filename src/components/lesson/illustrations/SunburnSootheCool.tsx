const OUTLINE = "#333333";
const SILVER = "#E5E7EB";
const SLATE = "#94A3B8";
const SLATE_2 = "#475569";
const RED = "#F20822";
const RED_LIGHT = "#FF4D5A";

export default function SunburnSootheCool({ className }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <title>Sunburn Soothe and Cool</title>
      <defs>
        <marker
          id="cool-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <polygon points="0 0, 8 4, 1 7" fill={RED} />
        </marker>
      </defs>

      {/* Background track */}
      <rect x="40" y="210" width="320" height="2" rx="1" fill={SLATE} opacity="0.3" />
      <line x1="60" y1="210" x2="340" y2="210" stroke={OUTLINE} strokeWidth="2" strokeDasharray="6 4" opacity="1" />

      {/* Cooling radiant waves - slate grey, radiating outward from sunburn zone */}
      {/* Left waves */}
      <path d="M 110 130 Q 80 120 60 110" fill="none" stroke={SLATE} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <path d="M 105 145 Q 70 140 50 135" fill="none" stroke={SLATE} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M 105 160 Q 75 165 55 170" fill="none" stroke={SLATE} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      {/* Right waves */}
      <path d="M 290 130 Q 320 120 340 110" fill="none" stroke={SLATE} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <path d="M 295 145 Q 330 140 350 135" fill="none" stroke={SLATE} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M 295 160 Q 325 165 345 170" fill="none" stroke={SLATE} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      {/* Top waves */}
      <path d="M 170 90 Q 180 70 190 55" fill="none" stroke={SLATE} strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
      <path d="M 200 85 Q 210 65 220 50" fill="none" stroke={SLATE} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      <path d="M 230 90 Q 240 70 250 55" fill="none" stroke={SLATE} strokeWidth="2" strokeLinecap="round" opacity="0.55" />

      {/* Upper body / shoulder and neck silhouette */}
      {/* Torso / shoulders */}
      <path
        d="M 80 210 
           C 80 190 90 165 110 155 
           L 140 145 
           C 160 140 170 125 180 115 
           L 220 115 
           C 230 125 240 140 260 145 
           L 290 155 
           C 310 165 320 190 320 210 
           Z"
        fill={SILVER}
        stroke={OUTLINE}
        strokeWidth="3"
      />

      {/* Neck */}
      <path
        d="M 180 115 L 220 115 L 220 80 L 180 80 Z"
        fill={SILVER}
        stroke={OUTLINE}
        strokeWidth="3"
      />

      {/* Head base */}
      <path
        d="M 175 80 
           C 175 50 190 40 200 40 
           C 210 40 225 50 225 80 
           Z"
        fill={SILVER}
        stroke={OUTLINE}
        strokeWidth="3"
      />

      {/* Sunburn zone - Emergency Red patch on shoulder and upper neck area */}
      <path
        d="M 130 175 
           C 140 155 160 145 180 145 
           L 220 145 
           C 240 145 260 155 270 175 
           C 265 185 250 195 230 200 
           L 170 200 
           C 150 195 135 185 130 175 Z"
        fill={RED}
        fillOpacity="0.55"
        stroke={RED}
        strokeWidth="2.5"
      />

      {/* Sunburn zone texture dots */}
      <circle cx="160" cy="165" r="2" fill={RED_LIGHT} opacity="0.7" />
      <circle cx="180" cy="158" r="2.5" fill={RED_LIGHT} opacity="0.6" />
      <circle cx="200" cy="155" r="3" fill={RED_LIGHT} opacity="0.7" />
      <circle cx="220" cy="158" r="2.5" fill={RED_LIGHT} opacity="0.6" />
      <circle cx="240" cy="165" r="2" fill={RED_LIGHT} opacity="0.7" />
      <circle cx="170" cy="180" r="2" fill={RED_LIGHT} opacity="0.5" />
      <circle cx="190" cy="185" r="2.5" fill={RED_LIGHT} opacity="0.6" />
      <circle cx="210" cy="185" r="2.5" fill={RED_LIGHT} opacity="0.6" />
      <circle cx="230" cy="180" r="2" fill={RED_LIGHT} opacity="0.5" />

      {/* Bottle dispenser - silver-grey, above and to the right of the sunburn zone */}
      {/* Bottle body */}
      <rect
        x="240"
        y="30"
        width="40"
        height="70"
        rx="6"
        fill={SLATE_2}
        stroke={OUTLINE}
        strokeWidth="2.5"
      />
      {/* Bottle neck */}
      <rect
        x="252"
        y="15"
        width="16"
        height="20"
        rx="3"
        fill={SLATE}
        stroke={OUTLINE}
        strokeWidth="2.5"
      />
      {/* Pump head */}
      <path
        d="M 245 15 L 275 15 L 275 8 L 265 8 L 260 2 L 260 8 L 245 8 Z"
        fill={SILVER}
        stroke={OUTLINE}
        strokeWidth="2"
      />
      {/* Nozzle pointing down/left toward sunburn zone */}
      <path
        d="M 245 8 L 240 8 L 235 18 L 240 28 L 245 15 Z"
        fill={SILVER}
        stroke={OUTLINE}
        strokeWidth="2"
      />

      {/* Soothing liquid drops / flow from nozzle toward sunburn zone */}
      {/* Drop 1 - falling */}
      <path
        d="M 238 32 Q 235 50 230 65 Q 238 75 245 65 Q 242 50 240 32 Z"
        fill={RED_LIGHT}
        stroke={RED}
        strokeWidth="1.5"
        opacity="0.9"
      />
      {/* Drop 2 - falling */}
      <path
        d="M 232 58 Q 228 78 220 95 Q 228 105 236 95 Q 234 78 234 58 Z"
        fill={RED_LIGHT}
        stroke={RED}
        strokeWidth="1.5"
        opacity="0.8"
      />
      {/* Drop 3 - landing / spreading on sunburn zone */}
      <ellipse
        cx="215"
        cy="145"
        rx="14"
        ry="5"
        fill={RED_LIGHT}
        stroke={RED}
        strokeWidth="1.5"
        opacity="0.85"
      />

      {/* Soothing layer spread over sunburn zone */}
      <path
        d="M 145 185 
           C 160 180 180 178 200 180 
           C 220 182 240 186 255 192 
           C 245 200 220 205 200 203 
           C 180 201 160 195 145 185 Z"
        fill={SLATE}
        fillOpacity="1"
        stroke={OUTLINE}
        strokeWidth="2"
        opacity="0.85"
      />

      {/* Cooling wave arrow indicators on soothing layer */}
      <path d="M 180 188 L 195 188" stroke={RED} strokeWidth="2.5" markerEnd="url(#cool-arrow)" opacity="0.9" />
      <path d="M 170 190 L 160 185" stroke={RED} strokeWidth="2" markerEnd="url(#cool-arrow)" opacity="1" />
      <path d="M 205 190 L 220 190" stroke={RED} strokeWidth="2" markerEnd="url(#cool-arrow)" opacity="1" />

      {/* Red action target dot on sunburn zone */}
      <circle cx="200" cy="165" r="5" fill={RED} stroke={OUTLINE} strokeWidth="1.5" />
      <circle cx="200" cy="165" r="10" fill="none" stroke={RED} strokeWidth="2" strokeDasharray="4 3" opacity="0.8" />

      {/* Hidden text for screen readers */}
      <text x="200" y="250" textAnchor="middle" fill="none" fontSize="1">
        A sunburned shoulder and neck area being treated with cooling soothing lotion from a bottle dispenser, with cooling waves radiating outward.
      </text>
    </svg>
  );
}
