interface Props {
  className?: string;
  title?: string;
}

/**
 * Spinal Inline Stabilization
 * Overhead bird's-eye schematic: patient lying straight on a flat ground track,
 * first aider's hands flat on both sides of the head, with dense Emergency Red
 * constraint brackets flanking the head/neck/shoulder centerline axis to convey
 * absolute manual inline alignment restriction.
 */
export default function SpinalInlineStabilization({
  className,
  title = "Manual inline spinal stabilization, overhead view",
}: Props) {
  const OUTLINE = "#333333";
  const SILVER = "#E5E7EB";
  const SILVER_2 = "#CBD5E1";
  const SLATE = "#475569";
  const SLATE_2 = "#94A3B8";
  const RED = "#F20822";
  const RED_LT = "#FF4D5A";

  return (
    <svg
      className={className}
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="spinal-inline-title"
    >
      <title id="spinal-inline-title">{title}</title>

      <defs>
        <marker
          id="spinal-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={RED} />
        </marker>
      </defs>

      {/* Ground track / floor plane */}
      <rect x="20" y="40" width="360" height="180" rx="10"
        fill={SILVER} stroke={OUTLINE} strokeWidth="2.5" />
      {/* Track guide lines */}
      <line x1="20" y1="80" x2="380" y2="80" stroke={SILVER_2} strokeWidth="1.5" strokeDasharray="4 6" />
      <line x1="20" y1="180" x2="380" y2="180" stroke={SILVER_2} strokeWidth="1.5" strokeDasharray="4 6" />

      {/* Centerline axis (spine alignment) */}
      <line x1="60" y1="130" x2="360" y2="130"
        stroke={SLATE} strokeWidth="1.5" strokeDasharray="2 4" />

      {/* === Patient body, overhead view, lying straight === */}
      {/* Legs */}
      <rect x="240" y="118" width="120" height="24" rx="10"
        fill={SILVER_2} stroke={OUTLINE} strokeWidth="2.5" />
      {/* Feet */}
      <path d="M360 122 L372 126 L372 134 L360 138 Z"
        fill={SLATE_2} stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />

      {/* Torso */}
      <rect x="150" y="106" width="100" height="48" rx="12"
        fill={SILVER_2} stroke={OUTLINE} strokeWidth="2.5" />

      {/* Arms (straight along body) */}
      <rect x="158" y="150" width="80" height="14" rx="6"
        fill={SLATE_2} stroke={OUTLINE} strokeWidth="2.5" />
      <rect x="158" y="96" width="80" height="14" rx="6"
        fill={SLATE_2} stroke={OUTLINE} strokeWidth="2.5" />

      {/* Shoulders detail */}
      <line x1="150" y1="118" x2="150" y2="142" stroke={OUTLINE} strokeWidth="2" />

      {/* Neck */}
      <rect x="128" y="118" width="24" height="24"
        fill={SILVER_2} stroke={OUTLINE} strokeWidth="2.5" />

      {/* Head (top of head pointing left) */}
      <ellipse cx="100" cy="130" rx="34" ry="26"
        fill={SILVER} stroke={OUTLINE} strokeWidth="2.5" />
      {/* Nose pointing up (overhead view) */}
      <path d="M100 104 L96 96 L104 96 Z"
        fill={SLATE_2} stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />

      {/* === First aider's hands flat on both sides of the head === */}
      {/* Top hand */}
      <g>
        <rect x="72" y="60" width="56" height="36" rx="10"
          fill={SILVER} stroke={OUTLINE} strokeWidth="2.5" />
        {/* fingers */}
        <line x1="84" y1="60" x2="84" y2="96" stroke={OUTLINE} strokeWidth="1.5" />
        <line x1="96" y1="60" x2="96" y2="96" stroke={OUTLINE} strokeWidth="1.5" />
        <line x1="108" y1="60" x2="108" y2="96" stroke={OUTLINE} strokeWidth="1.5" />
        <line x1="120" y1="60" x2="120" y2="96" stroke={OUTLINE} strokeWidth="1.5" />
        {/* forearm */}
        <rect x="82" y="44" width="40" height="18" rx="8"
          fill={SLATE_2} stroke={OUTLINE} strokeWidth="2.5" />
      </g>
      {/* Bottom hand */}
      <g>
        <rect x="72" y="164" width="56" height="36" rx="10"
          fill={SILVER} stroke={OUTLINE} strokeWidth="2.5" />
        <line x1="84" y1="164" x2="84" y2="200" stroke={OUTLINE} strokeWidth="1.5" />
        <line x1="96" y1="164" x2="96" y2="200" stroke={OUTLINE} strokeWidth="1.5" />
        <line x1="108" y1="164" x2="108" y2="200" stroke={OUTLINE} strokeWidth="1.5" />
        <line x1="120" y1="164" x2="120" y2="200" stroke={OUTLINE} strokeWidth="1.5" />
        <rect x="82" y="198" width="40" height="18" rx="8"
          fill={SLATE_2} stroke={OUTLINE} strokeWidth="2.5" />
      </g>

      {/* === Dense Emergency Red constraint brackets ===
          Flank head, neck, shoulder axis — solid corner brackets top & bottom */}
      {/* Top constraint rail */}
      <rect x="62" y="98" width="200" height="6" rx="2" fill={RED} stroke={OUTLINE} strokeWidth="1.5" />
      {/* Top bracket end caps */}
      <path d="M62 104 L62 116 L74 116" fill="none" stroke={RED} strokeWidth="6" strokeLinecap="round" />
      <path d="M262 104 L262 116 L250 116" fill="none" stroke={RED} strokeWidth="6" strokeLinecap="round" />

      {/* Bottom constraint rail */}
      <rect x="62" y="156" width="200" height="6" rx="2" fill={RED} stroke={OUTLINE} strokeWidth="1.5" />
      <path d="M62 156 L62 144 L74 144" fill="none" stroke={RED} strokeWidth="6" strokeLinecap="round" />
      <path d="M262 156 L262 144 L250 144" fill="none" stroke={RED} strokeWidth="6" strokeLinecap="round" />

      {/* Inward constraint arrows showing alignment restriction */}
      <line x1="100" y1="110" x2="100" y2="120"
        stroke={RED} strokeWidth="3" markerEnd="url(#spinal-arrow)" />
      <line x1="100" y1="150" x2="100" y2="140"
        stroke={RED} strokeWidth="3" markerEnd="url(#spinal-arrow)" />
      <line x1="170" y1="110" x2="170" y2="120"
        stroke={RED} strokeWidth="3" markerEnd="url(#spinal-arrow)" />
      <line x1="170" y1="150" x2="170" y2="140"
        stroke={RED} strokeWidth="3" markerEnd="url(#spinal-arrow)" />
      <line x1="230" y1="110" x2="230" y2="120"
        stroke={RED} strokeWidth="3" markerEnd="url(#spinal-arrow)" />
      <line x1="230" y1="150" x2="230" y2="140"
        stroke={RED} strokeWidth="3" markerEnd="url(#spinal-arrow)" />

      {/* Action focus ring around head */}
      <circle cx="100" cy="130" r="44"
        fill="none" stroke={RED_LT} strokeWidth="2" strokeDasharray="3 5" opacity="0.85" />

      {/* Hidden caption for screen readers */}
      <text x="200" y="240" textAnchor="middle"
        fontSize="11" fill={SLATE} fontFamily="sans-serif">
        Hold the head still in line with the spine — do not twist or tilt.
      </text>
    </svg>
  );
}
