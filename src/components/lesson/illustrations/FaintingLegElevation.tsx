interface FaintingLegElevationProps {
  className?: string;
  title?: string;
}

export default function FaintingLegElevation({ className, title }: FaintingLegElevationProps) {
  return (
    <svg
      viewBox="0 2 400 260"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={title || "Elevating the legs of a fainting patient"}
    >
      {title && <title>{title}</title>}

      <defs>
        <marker
          id="flow-arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 1.5, 0 5.5, 7 3.5" fill="#F20822" />
        </marker>
        <marker
          id="up-arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 1.5, 0 5.5, 7 3.5" fill="#F20822" />
        </marker>
      </defs>

      {/* Floor plane */}
      <rect x="20" y="215" width="360" height="8" rx="2" fill="#CBD5E1" stroke="#333333" strokeWidth="3" />

      {/* Elevated support block frame beneath legs */}
      <rect x="255" y="175" width="110" height="40" rx="4" fill="#475569" stroke="#333333" strokeWidth="3" strokeLinejoin="round" />
      {/* Support block top surface */}
      <rect x="258" y="172" width="104" height="6" rx="2" fill="#64748B" stroke="#333333" strokeWidth="2" />
      {/* Block legs / frame detail */}
      <rect x="265" y="215" width="12" height="6" rx="1" fill="#334155" stroke="#333333" strokeWidth="2" />
      <rect x="343" y="215" width="12" height="6" rx="1" fill="#334155" stroke="#333333" strokeWidth="2" />

      {/* Patient silhouette lying flat on back */}
      {/* Head */}
      <ellipse cx="75" cy="145" rx="28" ry="24" fill="#E5E7EB" stroke="#333333" strokeWidth="3.5" />
      {/* Face profile detail — simple closed eyes / resting */}
      <path d="M 62 140 Q 70 138 78 140" fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
      <path d="M 62 148 Q 70 146 78 148" fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
      {/* Mouth — neutral */}
      <path d="M 68 155 Q 74 157 80 155" fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" />

      {/* Neck */}
      <rect x="95" y="138" width="18" height="14" rx="4" fill="#E5E7EB" stroke="#333333" strokeWidth="3" />

      {/* Torso */}
      <rect x="113" y="120" width="110" height="50" rx="14" fill="#E5E7EB" stroke="#333333" strokeWidth="3.5" strokeLinejoin="round" />
      {/* Chest line */}
      <path d="M 130 140 Q 168 145 206 140" fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

      {/* Arms — resting at sides */}
      <rect x="125" y="172" width="14" height="38" rx="6" fill="#E5E7EB" stroke="#333333" strokeWidth="3" transform="rotate(-8 132 191)" />
      <rect x="197" y="172" width="14" height="38" rx="6" fill="#E5E7EB" stroke="#333333" strokeWidth="3" transform="rotate(8 204 191)" />

      {/* Hips / upper legs */}
      <rect x="218" y="128" width="42" height="34" rx="10" fill="#E5E7EB" stroke="#333333" strokeWidth="3.5" strokeLinejoin="round" />

      {/* Thighs angled upward onto block */}
      <rect x="252" y="125" width="48" height="22" rx="10" fill="#E5E7EB" stroke="#333333" strokeWidth="3" transform="rotate(-6 276 136)" />

      {/* Lower legs resting on block */}
      <rect x="285" y="148" width="52" height="20" rx="9" fill="#E5E7EB" stroke="#333333" strokeWidth="3" transform="rotate(2 311 158)" />

      {/* Feet */}
      <ellipse cx="350" cy="158" rx="14" ry="10" fill="#E5E7EB" stroke="#333333" strokeWidth="3" transform="rotate(10 350 158)" />

      {/* Red dashed boundary ring around the elevated leg zone */}
      <ellipse cx="310" cy="158" rx="62" ry="28" fill="none" stroke="#F20822" strokeWidth="2" strokeDasharray="7 5" opacity="0.85" />

      {/* Large Emergency Red upward lift arrow beneath the legs */}
      <g>
        {/* Arrow shaft */}
        <line x1="310" y1="235" x2="310" y2="195" stroke="#F20822" strokeWidth="5" strokeLinecap="round" />
        {/* Arrow head */}
        <polygon points="310,185 298,202 322,202" fill="#F20822" stroke="#333333" strokeWidth="2" strokeLinejoin="round" />
        {/* Upward action indicator circle around arrow base */}
        <circle cx="310" cy="220" r="18" fill="none" stroke="#F20822" strokeWidth="2" opacity="0.6" />
      </g>

      {/* Red flow vector path looping from legs back toward the head */}
      {/* Main curved flow line — from legs up and back toward head */}
      <path
        d="M 275 155 Q 230 120 180 125 Q 130 130 100 145"
        fill="none"
        stroke="#F20822"
        strokeWidth="3.5"
        strokeLinecap="round"
        markerEnd="url(#flow-arrowhead)"
        opacity="0.9"
      />
      {/* Second flow line for emphasis */}
      <path
        d="M 285 160 Q 240 132 190 135 Q 145 140 108 150"
        fill="none"
        stroke="#F20822"
        strokeWidth="2.5"
        strokeLinecap="round"
        markerEnd="url(#flow-arrowhead)"
        opacity="0.7"
      />

      {/* Red action target dot at head — blood flow returning to brain */}
      <g>
        <circle cx="75" cy="145" r="10" fill="none" stroke="#F20822" strokeWidth="2.5" opacity="0.7" />
        <circle cx="75" cy="145" r="5" fill="#F20822" stroke="#333333" strokeWidth="1.5" />
      </g>

      {/* Small red pulse ring at head */}
      <circle cx="75" cy="145" r="16" fill="none" stroke="#F20822" strokeWidth="1.5" opacity="0.3" />

      {/* Red flow indicator arrow near torso midline */}
      <path
        d="M 160 132 Q 130 128 105 138"
        fill="none"
        stroke="#F20822"
        strokeWidth="2.5"
        strokeLinecap="round"
        markerEnd="url(#flow-arrowhead)"
        opacity="0.75"
      />

      {/* Subtle red dots along the flow path */}
      <circle cx="220" cy="135" r="3" fill="#F20822" opacity="0.8" />
      <circle cx="180" cy="128" r="2.5" fill="#F20822" opacity="0.8" />
      <circle cx="140" cy="132" r="2.5" fill="#F20822" opacity="0.8" />
      <circle cx="110" cy="142" r="3" fill="#F20822" opacity="1" />
    </svg>
  );
}
