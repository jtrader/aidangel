import React, { SVGProps } from "react";

const STROKE = "#333333";
const FILL_SKIN = "#E8EAED";
const FILL_BODY = "#B8BFC6";
const ACCENT = "#FF0000";

const RecoveryPosition: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 400 260"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby="recovery-position-title"
    {...props}
  >
    <title id="recovery-position-title">Recovery Position</title>

    {/* Ground / surface */}
    <rect x="10" y="220" width="380" height="30" rx="6" fill={FILL_BODY} stroke={STROKE} strokeWidth="3" />

    {/* Person lying on their side (recovery position) */}
    {/* Back / torso — angled on side */}
    <path
      d="M 140 180 C 140 150, 170 140, 200 140 C 240 140, 270 150, 290 170 C 310 190, 310 210, 290 220 L 160 220 C 140 220, 130 200, 140 180"
      fill={FILL_SKIN}
      stroke={STROKE}
      strokeWidth="3"
      strokeLinejoin="round"
    />

    {/* Head — tilted back, resting on ground */}
    <ellipse cx="110" cy="165" rx="28" ry="22" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(-25 110 165)" />

    {/* Jaw / chin line indicating tilted head */}
    <path
      d="M 90 150 Q 105 145 120 155"
      stroke={STROKE}
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />

    {/* Neck */}
    <rect x="130" y="152" width="22" height="14" rx="7" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(-15 141 159)" />

    {/* Lower arm (closest to ground) — extended outward */}
    <rect x="140" y="200" width="100" height="14" rx="7" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(8 190 207)" />
    {/* Lower hand */}
    <ellipse cx="245" cy="212" rx="10" ry="8" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" />

    {/* Upper arm (across chest) */}
    <rect x="170" y="145" width="85" height="14" rx="7" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(-35 212 152)" />
    {/* Upper hand against cheek */}
    <ellipse cx="245" cy="125" rx="10" ry="8" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" />

    {/* Lower leg (straight, on ground) */}
    <rect x="230" y="210" width="90" height="16" rx="8" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(6 275 218)" />
    {/* Lower foot */}
    <ellipse cx="325" cy="218" rx="10" ry="7" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" />

    {/* Upper leg — bent at hip and knee, stabilising the body */}
    <rect x="260" y="175" width="70" height="16" rx="8" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(-55 295 183)" />
    {/* Upper shin / lower leg — bent knee */}
    <rect x="300" y="160" width="55" height="14" rx="7" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(25 327 167)" />
    {/* Upper foot */}
    <ellipse cx="360" cy="175" rx="9" ry="6" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" />

    {/* Knee joint highlight — stability point */}
    <circle cx="315" cy="148" r="10" fill="none" stroke={ACCENT} strokeWidth="3" opacity="0.8" />

    {/* Airway path — open airway indicator */}
    <path
      d="M 95 160 Q 115 150 130 155"
      stroke={ACCENT}
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      opacity="1"
    />
    <path
      d="M 130 155 L 145 158"
      stroke={ACCENT}
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
      strokeDasharray="4 4"
    />
    <text x="120" y="130" fontSize="9" fontFamily="sans-serif" fill={ACCENT} fontWeight="700" textAnchor="middle">
      Open airway
    </text>

    {/* Downward arrow indicating mouth facing down for drainage */}
    <path
      d="M 125 180 L 125 210"
      stroke={ACCENT}
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
      markerEnd="url(#rp-arrow-down)"
    />
    <text x="125" y="225" fontSize="8" fontFamily="sans-serif" fill={ACCENT} fontWeight="700" textAnchor="middle">
      Drainage
    </text>

    {/* Bent knee label */}
    <text x="335" y="135" fontSize="9" fontFamily="sans-serif" fill={ACCENT} fontWeight="700" textAnchor="middle">
      Bent knee
    </text>
    <text x="335" y="145" fontSize="8" fontFamily="sans-serif" fill={STROKE} fontWeight="600" textAnchor="middle">
      (stability)
    </text>

    {/* Support shoulder label */}
    <text x="255" y="110" fontSize="9" fontFamily="sans-serif" fill={STROKE} fontWeight="600" textAnchor="middle">
      Hand on cheek
    </text>

    <defs>
      <marker id="rp-arrow-down" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
      </marker>
    </defs>
  </svg>
);

export default RecoveryPosition;
