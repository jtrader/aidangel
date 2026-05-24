interface DentalStabilizationProps {
  className?: string;
  title?: string;
}

const OUTLINE = "#333333";
const SILVER = "#E5E7EB";
const SLATE = "#475569";
const RED = "#F20822";

export default function DentalStabilization({
  className,
  title = "Dental stabilization: store knocked or chipped tooth in milk",
}: DentalStabilizationProps) {
  return (
    <svg
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>

      {/* Background panel */}
      <rect x="0" y="0" width="400" height="260" fill="#FFFFFF" />

      {/* ===== Left: Front-on view of teeth ===== */}
      {/* Upper gum arch */}
      <path
        d="M30 70 Q105 50 180 70 L180 100 Q105 88 30 100 Z"
        fill={SLATE}
        stroke={OUTLINE}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Upper teeth row */}
      {/* Tooth 1 (molar-ish) */}
      <rect x="34" y="98" width="22" height="34" rx="4" fill={SILVER} stroke={OUTLINE} strokeWidth="3" />
      {/* Tooth 2 */}
      <rect x="58" y="98" width="22" height="38" rx="4" fill={SILVER} stroke={OUTLINE} strokeWidth="3" />
      {/* Tooth 3 (lateral incisor) */}
      <rect x="82" y="98" width="22" height="42" rx="4" fill={SILVER} stroke={OUTLINE} strokeWidth="3" />

      {/* Tooth 4 - CENTRAL INCISOR (chipped) - focus on root */}
      {/* Root portion shown above as extending upward visually represented */}
      <path
        d="M106 98 L128 98 L128 132 L122 142 L118 134 L114 144 L110 134 L106 138 Z"
        fill={SILVER}
        stroke={OUTLINE}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Red laceration / chip indicator on central incisor */}
      <path
        d="M114 144 L118 134 L122 142"
        fill="none"
        stroke={RED}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="117" y1="118" x2="119" y2="132" stroke={RED} strokeWidth="2.5" strokeLinecap="round" />

      {/* Tooth 5 (central incisor right) */}
      <rect x="130" y="98" width="22" height="42" rx="4" fill={SILVER} stroke={OUTLINE} strokeWidth="3" />
      {/* Tooth 6 */}
      <rect x="154" y="98" width="22" height="38" rx="4" fill={SILVER} stroke={OUTLINE} strokeWidth="3" />

      {/* Tooth root focus callout (around the chipped incisor) */}
      <line
        x1="117"
        y1="98"
        x2="117"
        y2="78"
        stroke={SLATE}
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <text
        x="117"
        y="68"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui"
        fontSize="10"
        fontWeight="700"
        fill={SLATE}
      >
        ROOT
      </text>

      {/* Red focus ring around chipped tooth */}
      <ellipse
        cx="117"
        cy="120"
        rx="22"
        ry="32"
        fill="none"
        stroke={RED}
        strokeWidth="3"
        strokeDasharray="5 4"
      />

      {/* ===== Transfer arrow from teeth to storage ===== */}
      <path
        d="M200 130 Q230 110 260 130"
        fill="none"
        stroke={RED}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <polygon points="260,130 252,124 254,134" fill={RED} stroke={RED} strokeWidth="1" />

      {/* ===== Right: Milk carton + silver bracket ===== */}
      {/* Silver bracket / storage stand */}
      <rect
        x="278"
        y="200"
        width="100"
        height="14"
        rx="3"
        fill={SILVER}
        stroke={OUTLINE}
        strokeWidth="3"
      />
      <rect x="286" y="190" width="6" height="14" fill={SILVER} stroke={OUTLINE} strokeWidth="2.5" />
      <rect x="364" y="190" width="6" height="14" fill={SILVER} stroke={OUTLINE} strokeWidth="2.5" />

      {/* Milk carton body */}
      <path
        d="M298 100 L358 100 L358 200 L298 200 Z"
        fill={SLATE}
        stroke={OUTLINE}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Carton roof / fold */}
      <path
        d="M298 100 L328 78 L358 100 Z"
        fill={SLATE}
        stroke={OUTLINE}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Carton top crease */}
      <line x1="328" y1="78" x2="328" y2="70" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" />
      <line x1="316" y1="74" x2="340" y2="74" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" />

      {/* Light label panel on carton */}
      <rect x="306" y="130" width="44" height="40" rx="3" fill={SILVER} stroke={OUTLINE} strokeWidth="2.5" />
      {/* Drop icon on label (milk) */}
      <path
        d="M328 140 C322 148 322 156 328 160 C334 156 334 148 328 140 Z"
        fill={SLATE}
        stroke={OUTLINE}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Red action circle around the milk carton */}
      <circle
        cx="328"
        cy="140"
        r="60"
        fill="none"
        stroke={RED}
        strokeWidth="3.5"
      />

      {/* Downward indicator arrow pointing into carton */}
      <line
        x1="328"
        y1="30"
        x2="328"
        y2="68"
        stroke={RED}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <polygon
        points="328,76 320,64 336,64"
        fill={RED}
        stroke={RED}
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Ground baseline */}
      <line x1="20" y1="232" x2="380" y2="232" stroke={OUTLINE} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
