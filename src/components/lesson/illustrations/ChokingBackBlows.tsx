import React, { SVGProps } from "react";

const STROKE = "#333333";
const FILL_SKIN = "#E8EAED";
const FILL_BODY = "#B8BFC6";
const ACCENT = "#FF0000";

const ChokingBackBlows: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 400 280"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby="choking-back-blows-title"
    {...props}
  >
    <title id="choking-back-blows-title">Choking Back Blows</title>

    {/* Ground */}
    <rect x="20" y="248" width="360" height="8" rx="4" fill={FILL_BODY} stroke={STROKE} strokeWidth="3" />

    {/* Choking person — bent forward silhouette */}
    {/* Back / torso (bent forward) */}
    <path
      d="M 120 240 L 160 170 Q 180 140 210 145 L 260 155 Q 290 162 300 180 L 310 240"
      fill={FILL_SKIN}
      stroke={STROKE}
      strokeWidth="3"
      strokeLinejoin="round"
    />

    {/* Head (tilted forward) */}
    <ellipse cx="280" cy="128" rx="20" ry="16" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(15 280 128)" />

    {/* Neck */}
    <rect x="260" y="142" width="16" height="12" rx="6" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(12 268 148)" />

    {/* Bent legs */}
    <rect x="110" y="210" width="70" height="18" rx="9" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(-8 145 219)" />
    <rect x="140" y="230" width="60" height="16" rx="8" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(6 170 238)" />

    {/* Left arm (hanging down) */}
    <rect x="230" y="170" width="50" height="14" rx="7" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(35 255 177)" />

    {/* Right arm (forward, supported) */}
    <rect x="270" y="160" width="50" height="14" rx="7" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(-15 295 167)" />

    {/* Rescuer body (behind and to the left) */}
    <rect x="60" y="110" width="90" height="55" rx="22" fill={FILL_BODY} stroke={STROKE} strokeWidth="3" transform="rotate(-6 105 137)" />

    {/* Rescuer head */}
    <circle cx="85" cy="90" r="20" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" />

    {/* Rescuer arm reaching forward */}
    <rect x="130" y="125" width="80" height="16" rx="8" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(12 170 133)" />

    {/* Rescuer hand (heel of hand) striking */}
    <ellipse cx="215" cy="158" rx="16" ry="10" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(18 215 158)" />

    {/* Strike zone between shoulder blades */}
    <ellipse cx="210" cy="168" rx="34" ry="18" fill={ACCENT} opacity="0.22" stroke={ACCENT} strokeWidth="3" transform="rotate(8 210 168)" />

    {/* Upward/forward strike arrow */}
    <path
      d="M 185 195 L 205 165"
      stroke={ACCENT}
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
      markerEnd="url(#arrowhead-strike)"
    />

    {/* Arrowhead definitions */}
    <defs>
      <marker id="arrowhead-strike" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
        <polygon points="0 0, 10 4, 0 8" fill={ACCENT} />
      </marker>
    </defs>

    {/* Labels */}
    <text x="85" y="68" fontSize="10" fontFamily="sans-serif" fill={STROKE} fontWeight="600" textAnchor="middle">
      Rescuer
    </text>

    <text x="210" y="140" fontSize="10" fontFamily="sans-serif" fill={ACCENT} fontWeight="700" textAnchor="middle">
      Heel of hand
    </text>

    <text x="210" y="128" fontSize="9" fontFamily="sans-serif" fill={ACCENT} fontWeight="600" textAnchor="middle">
      Between shoulder blades
    </text>

    <text x="300" y="100" fontSize="9" fontFamily="sans-serif" fill={STROKE} fontWeight="600" textAnchor="middle">
      Lean forward
    </text>
  </svg>
);

export default ChokingBackBlows;
