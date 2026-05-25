import React, { SVGProps } from "react";

const STROKE = "#333333";
const FILL_SKIN = "#E8EAED";
const FILL_BODY = "#B8BFC6";
const ACCENT = "#FF0000";

const InfantBackBlows: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 400 280"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby="infant-back-blows-title"
    {...props}
  >
    <title id="infant-back-blows-title">Infant Back Blows</title>

    {/* Rescuer forearm (horizontal support surface) */}
    <rect x="40" y="155" width="260" height="24" rx="12" fill={FILL_BODY} stroke={STROKE} strokeWidth="3" />

    {/* Rescuer hand supporting infant head/jaw */}
    <path
      d="M 40 155 C 20 155, 10 140, 15 125 C 20 110, 35 115, 45 125 C 55 135, 55 145, 50 155"
      fill={FILL_SKIN}
      stroke={STROKE}
      strokeWidth="3"
      strokeLinejoin="round"
    />

    {/* Infant head (face-down, supported) */}
    <ellipse cx="85" cy="125" rx="22" ry="18" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(-15 85 125)" />

    {/* Infant neck */}
    <rect x="105" y="132" width="18" height="10" rx="5" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(-8 114 137)" />

    {/* Infant torso (face-down along forearm) */}
    <rect x="120" y="138" width="130" height="42" rx="18" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(-6 185 159)" />

    {/* Infant upper legs */}
    <rect x="240" y="148" width="55" height="16" rx="8" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(-4 267 156)" />

    {/* Infant lower legs */}
    <rect x="290" y="150" width="40" height="14" rx="7" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(-2 310 157)" />

    {/* Infant feet */}
    <ellipse cx="335" cy="155" rx="9" ry="6" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" />

    {/* Infant arms (tucked alongside body) */}
    <rect x="135" y="148" width="50" height="10" rx="5" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(-6 160 153)" />
    <rect x="140" y="160" width="45" height="10" rx="5" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(-6 162 165)" />

    {/* Head lower than chest indicator — subtle slope arrow */}
    <path
      d="M 70 100 L 70 85"
      stroke={STROKE}
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
      markerEnd="url(#arrowhead-down)"
    />
    <text x="70" y="78" fontSize="9" fontFamily="sans-serif" fill={STROKE} fontWeight="600" textAnchor="middle">
      Lower
    </text>

    {/* Target strike zone between shoulder blades */}
    <ellipse cx="185" cy="152" rx="28" ry="14" fill={ACCENT} opacity="0.25" stroke={ACCENT} strokeWidth="3" transform="rotate(-6 185 152)" />

    {/* Downward strike arrow */}
    <path
      d="M 185 115 L 185 145"
      stroke={ACCENT}
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
      markerEnd="url(#arrowhead-strike)"
    />
    <text x="185" y="108" fontSize="10" fontFamily="sans-serif" fill={ACCENT} fontWeight="700" textAnchor="middle">
      STRIKE
    </text>

    {/* Arrowhead definitions */}
    <defs>
      <marker id="arrowhead-down" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill={STROKE} />
      </marker>
      <marker id="arrowhead-strike" markerWidth="10" markerHeight="8" refX="5" refY="4" orient="auto">
        <polygon points="0 0, 10 4, 0 8" fill={ACCENT} />
      </marker>
    </defs>

    {/* Jaw support label */}
    <text x="45" y="180" fontSize="9" fontFamily="sans-serif" fill={STROKE} fontWeight="600" textAnchor="middle">
      Support jaw
    </text>

    {/* Shoulder blades label */}
    <text x="245" y="115" fontSize="9" fontFamily="sans-serif" fill={ACCENT} fontWeight="600" textAnchor="middle">
      Between shoulder blades
    </text>
  </svg>
);

export default InfantBackBlows;
