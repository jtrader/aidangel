import React, { SVGProps } from "react";

const STROKE = "#333333";
const FILL_SKIN = "#E8EAED";
const FILL_BODY = "#B8BFC6";
const ACCENT = "#FF0000";

const ChokingAbdominalThrusts: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 400 280"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby="choking-abdominal-thrusts-title"
    {...props}
  >
    <title id="choking-abdominal-thrusts-title">Choking Abdominal Thrusts</title>

    {/* Ground */}
    <rect x="20" y="248" width="360" height="8" rx="4" fill={FILL_BODY} stroke={STROKE} strokeWidth="3" />

    {/* Victim — profile view, standing */}
    {/* Victim torso */}
    <rect x="150" y="95" width="70" height="90" rx="24" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" />

    {/* Victim head (profile) */}
    <ellipse cx="185" cy="70" rx="20" ry="18" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(-6 185 70)" />

    {/* Victim neck */}
    <rect x="175" y="88" width="14" height="12" rx="6" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" />

    {/* Victim legs */}
    <rect x="160" y="178" width="24" height="65" rx="10" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" />
    <rect x="190" y="178" width="24" height="65" rx="10" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" />

    {/* Victim arms (slightly forward, clutching throat) */}
    <rect x="195" y="108" width="50" height="12" rx="6" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(-25 220 114)" />
    <rect x="190" y="120" width="45" height="12" rx="6" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(15 212 126)" />

    {/* Rescuer — standing behind victim, arms wrapped around waist */}
    {/* Rescuer torso (behind victim) */}
    <rect x="100" y="92" width="70" height="96" rx="24" fill={FILL_BODY} stroke={STROKE} strokeWidth="3" />

    {/* Rescuer head (peeking from behind) */}
    <circle cx="135" cy="68" r="20" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" />

    {/* Rescuer arms wrapping around victim */}
    {/* Left arm (from rescuer's left, crossing around victim's waist) */}
    <rect x="160" y="110" width="60" height="14" rx="7" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(12 190 117)" />

    {/* Right arm (from rescuer's right, reaching toward fist) */}
    <rect x="150" y="132" width="65" height="14" rx="7" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(-18 182 139)" />

    {/* Clenched fist placed just above navel */}
    <ellipse cx="198" cy="152" rx="14" ry="12" fill={ACCENT} opacity="0.25" stroke={ACCENT} strokeWidth="3" transform="rotate(-12 198 152)" />
    <circle cx="198" cy="152" r="8" fill={FILL_SKIN} stroke={ACCENT} strokeWidth="3" />

    {/* Inward/upward thrust arrows */}
    <path
      d="M 220 170 L 200 150"
      stroke={ACCENT}
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
      markerEnd="url(#arrowhead-inward)"
    />
    <path
      d="M 185 170 L 195 148"
      stroke={ACCENT}
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
      markerEnd="url(#arrowhead-upward)"
    />

    {/* Arrowhead definitions */}
    <defs>
      <marker id="arrowhead-inward" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
        <polygon points="0 0, 10 4, 0 8" fill={ACCENT} />
      </marker>
      <marker id="arrowhead-upward" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
        <polygon points="0 0, 10 4, 0 8" fill={ACCENT} />
      </marker>
    </defs>

    {/* Labels */}
    <text x="135" y="46" fontSize="10" fontFamily="sans-serif" fill={STROKE} fontWeight="600" textAnchor="middle">
      Rescuer
    </text>

    <text x="198" y="180" fontSize="10" fontFamily="sans-serif" fill={ACCENT} fontWeight="700" textAnchor="middle">
      Clenched fist
    </text>

    <text x="198" y="192" fontSize="9" fontFamily="sans-serif" fill={ACCENT} fontWeight="600" textAnchor="middle">
      Above navel
    </text>

    <text x="265" y="140" fontSize="9" fontFamily="sans-serif" fill={STROKE} fontWeight="600" textAnchor="middle">
      Inward & upward thrust
    </text>
  </svg>
);

export default ChokingAbdominalThrusts;
