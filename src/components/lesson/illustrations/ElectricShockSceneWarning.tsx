export default function ElectricShockSceneWarning({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 1 400 260"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={title || "Electric shock scene warning"}
    >
      <title>{title || "Electric shock scene warning"}</title>

      <defs>
        {/* Arrow marker */}
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 1, 10 3.5, 1 6" fill="#F20822" />
        </marker>
      </defs>

      {/* ===== Background / Ground ===== */}
      <rect x="0" y="150" width="400" height="110" fill="#E2E8F0" stroke="none" />
      <line x1="0" y1="150" x2="400" y2="150" stroke="#333333" strokeWidth="3" />

      {/* ===== Puddle of Water ===== */}
      <ellipse cx="280" cy="195" rx="75" ry="28" fill="#94A3B8" stroke="#333333" strokeWidth="3" />
      {/* Inner ripple/wave lines */}
      <ellipse cx="280" cy="195" rx="55" ry="18" fill="none" stroke="#CBD5E1" strokeWidth="2" />
      <ellipse cx="280" cy="195" rx="35" ry="10" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
      {/* Water highlight sheen */}
      <ellipse cx="260" cy="185" rx="20" ry="6" fill="#CBD5E1" stroke="none" opacity="0.6" />

      {/* ===== Power Cord (grey/orange cable) ===== */}
      {/* Cord main body — grey sheath */}
      <path
        d="M 40 90 Q 90 70 130 100 Q 170 130 200 120 Q 240 105 260 140"
        fill="none"
        stroke="#64748B"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Cord inner orange accent stripe */}
      <path
        d="M 40 90 Q 90 70 130 100 Q 170 130 200 120 Q 240 105 260 140"
        fill="none"
        stroke="#FB923C"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Cord plug/socket at the end */}
      <rect x="248" y="128" width="22" height="16" rx="3" fill="#475569" stroke="#333333" strokeWidth="3" />
      {/* Prongs */}
      <line x1="265" y1="132" x2="275" y2="132" stroke="#333333" strokeWidth="3" strokeLinecap="round" />
      <line x1="265" y1="140" x2="275" y2="140" stroke="#333333" strokeWidth="3" strokeLinecap="round" />

      {/* Cord detail — ridges along the cable */}
      <g stroke="#333333" strokeWidth="1.5" opacity="1.0">
        <line x1="65" y1="78" x2="68" y2="85" />
        <line x1="100" y1="74" x2="103" y2="82" />
        <line x1="135" y1="95" x2="138" y2="103" />
        <line x1="170" y1="125" x2="173" y2="133" />
        <line x1="205" y1="115" x2="208" y2="122" />
        <line x1="240" y1="110" x2="243" y2="118" />
      </g>

      {/* ===== Red Boundary Indicator Ring around the electrical source / plug area ===== */}
      <circle cx="259" cy="136" r="38" fill="none" stroke="#F20822" strokeWidth="3" strokeDasharray="6,6" />
      <circle cx="259" cy="136" r="42" fill="none" stroke="#F20822" strokeWidth="1.5" opacity="0.5" />

      {/* ===== Warning Triangle with Lightning Bolt ===== */}
      {/* Triangle outline */}
      <polygon
        points="120,30 155,100 85,100"
        fill="#F20822"
        stroke="#333333"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Inner lighter triangle for depth */}
      <polygon
        points="120,42 146,96 94,96"
        fill="#FB7185"
        stroke="none"
      />
      {/* Lightning bolt symbol */}
      <path
        d="M 126 55 L 117 72 L 124 72 L 118 88 L 131 68 L 123 68 Z"
        fill="#FFFFFF"
        stroke="#333333"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* ===== Red curved warning arrows pointing toward the hazard zone ===== */}
      <path
        d="M 100 115 Q 140 145 190 155"
        fill="none"
        stroke="#F20822"
        strokeWidth="3"
        strokeDasharray="4,4"
        markerEnd="url(#arrowhead)"
      />
      <path
        d="M 320 110 Q 300 135 275 155"
        fill="none"
        stroke="#F20822"
        strokeWidth="3"
        strokeDasharray="4,4"
        markerEnd="url(#arrowhead)"
      />

      {/* Small red pulse dot near the plug-to-puddle gap */}
      <circle cx="270" cy="150" r="5" fill="#F20822" />
      <circle cx="270" cy="150" r="9" fill="none" stroke="#F20822" strokeWidth="1.5" opacity="0.6" />

      {/* ===== Scene context: small spark symbols near the plug ===== */}
      <g stroke="#F20822" strokeWidth="2" strokeLinecap="round">
        <line x1="278" y1="125" x2="282" y2="118" />
        <line x1="284" y1="130" x2="290" y2="124" />
        <line x1="280" y1="145" x2="286" y2="140" />
      </g>

      {/* ===== Red dashed "Do Not Enter" style barrier arc ===== */}
      <path
        d="M 210 160 A 50 50 0 0 1 310 160"
        fill="none"
        stroke="#F20822"
        strokeWidth="3"
        strokeDasharray="8,6"
      />

      {/* Ground shadow under cord */}
      <ellipse cx="150" cy="155" rx="80" ry="6" fill="#CBD5E1" stroke="none" opacity="0.5" />
    </svg>
  );
}
