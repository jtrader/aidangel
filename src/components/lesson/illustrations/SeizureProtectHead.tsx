import React, { type SVGProps } from "react";

const STROKE = "#333333";
const FILL_SKIN = "#E8EAED";
const FILL_SLATE = "#B8BFC6";
const FILL_CUSHION = "#F5EDE0";
const ACCENT = "#FF0000";
const WHITE = "#FFFFFF";

const SeizureProtectHead: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 400 260"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    role="img"
    aria-labelledby="seizureProtectHeadTitle"
    {...props}
  >
    <title id="seizureProtectHeadTitle">Seizure Protect Head</title>

    {/* Ground plane */}
    <path
      d="M0 220 L400 220 L400 260 L0 260 Z"
      fill={FILL_SLATE}
      stroke={STROKE}
      strokeWidth={3}
    />

    {/* Shadow under person */}
    <ellipse cx={160} cy={215} rx={90} ry={12} fill="#A0AAB5" stroke="none" />

    {/* Person on ground - body */}
    <path
      d="M90 210 Q100 180 120 160 Q140 140 170 140 Q200 140 220 160 Q240 180 250 210"
      fill={FILL_SKIN}
      stroke={STROKE}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Person on ground - head */}
    <circle cx={170} cy={125} r={22} fill={FILL_SKIN} stroke={STROKE} strokeWidth={4} />

    {/* Person on ground - closed eyes (seizure) */}
    <path d="M162 122 Q167 126 172 122" stroke={STROKE} strokeWidth={2.5} strokeLinecap="round" fill="none" />

    {/* Person on ground - arm (twitching / bent) */}
    <path
      d="M140 155 Q130 130 110 145 Q95 155 105 175"
      fill={FILL_SKIN}
      stroke={STROKE}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Person on ground - other arm */}
    <path
      d="M200 155 Q220 130 235 145 Q250 160 240 180"
      fill={FILL_SKIN}
      stroke={STROKE}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Legs */}
    <path
      d="M95 210 Q80 195 70 180 Q65 170 75 175 Q90 185 105 200"
      fill={FILL_SKIN}
      stroke={STROKE}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M245 210 Q260 195 270 180 Q275 170 265 175 Q250 185 235 200"
      fill={FILL_SKIN}
      stroke={STROKE}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Folded cushion / jacket beneath head */}
    <path
      d="M130 145 Q145 130 165 135 Q180 140 190 150 Q195 160 185 165 Q165 170 145 165 Q130 160 130 145 Z"
      fill={FILL_CUSHION}
      stroke={STROKE}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Cushion fold lines */}
    <path d="M140 148 Q160 145 175 150" stroke={STROKE} strokeWidth={2.5} strokeLinecap="round" fill="none" />
    <path d="M145 158 Q165 155 180 160" stroke={STROKE} strokeWidth={2.5} strokeLinecap="round" fill="none" />

    {/* Emergency Red highlight on cushion */}
    <ellipse cx={160} cy={152} rx={28} ry={14} fill="none" stroke={ACCENT} strokeWidth={3} strokeDasharray="6 4" opacity={1} />

    {/* Hard object being moved away - coffee cup */}
    <g transform="translate(270, 170)">
      <path d="M0 25 L0 0 Q0 -5 8 -5 L22 -5 Q30 -5 30 0 L30 25 Q30 30 22 30 L8 30 Q0 30 0 25 Z" fill={FILL_SLATE} stroke={STROKE} strokeWidth={3} />
      <path d="M30 5 Q38 5 38 12 Q38 20 30 20" fill="none" stroke={STROKE} strokeWidth={3} strokeLinecap="round" />
      {/* Steam */}
      <path d="M10 -12 Q12 -18 10 -22" stroke={STROKE} strokeWidth={2} strokeLinecap="round" fill="none" />
      <path d="M18 -10 Q20 -16 18 -20" stroke={STROKE} strokeWidth={2} strokeLinecap="round" fill="none" />
    </g>

    {/* Arrow showing object being cleared away */}
    <path d="M285 155 Q310 130 330 140" stroke={ACCENT} strokeWidth={4} strokeLinecap="round" fill="none" markerEnd="url(#arrowhead)" />

    {/* Hard object - glasses on ground near body */}
    <g transform="translate(80, 185)">
      <ellipse cx={0} cy={0} rx={10} ry={6} fill="none" stroke={STROKE} strokeWidth={2.5} />
      <ellipse cx={22} cy={0} rx={10} ry={6} fill="none" stroke={STROKE} strokeWidth={2.5} />
      <path d="M10 0 L12 0" stroke={STROKE} strokeWidth={2.5} strokeLinecap="round" />
    </g>

    {/* Arrow for glasses clearance */}
    <path d="M95 175 Q75 160 60 170" stroke={ACCENT} strokeWidth={3.5} strokeLinecap="round" fill="none" markerEnd="url(#arrowhead)" />

    {/* Bystander placing cushion - arm reaching in */}
    <path
      d="M310 120 Q290 130 270 140 Q250 150 240 145"
      fill={FILL_SKIN}
      stroke={STROKE}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Bystander hand */}
    <circle cx={235} cy={145} r={10} fill={FILL_SKIN} stroke={STROKE} strokeWidth={3} />

    {/* Bystander body (partial, kneeling) */}
    <path
      d="M320 120 Q310 80 330 60 Q350 50 360 70 Q370 100 340 120"
      fill="#D4D8DD"
      stroke={STROKE}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Bystander head */}
    <circle cx={345} cy={55} r={18} fill={FILL_SKIN} stroke={STROKE} strokeWidth={3} />
    {/* Eye looking at victim */}
    <circle cx={338} cy={52} r={2.5} fill={STROKE} />
    <path d="M334 50 Q338 48 342 50" stroke={STROKE} strokeWidth={2} strokeLinecap="round" fill="none" />

    {/* Directional safety clearance ring around body */}
    <ellipse cx={170} cy={185} rx={120} ry={45} fill="none" stroke={ACCENT} strokeWidth={2.5} strokeDasharray="8 6" opacity={0.8} />

    {/* Safety zone label */}
    <text x={170} y={95} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT} fontFamily="sans-serif">
      CLEAR ZONE
    </text>

    {/* Arrowhead marker definition */}
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill={ACCENT} />
      </marker>
    </defs>
  </svg>
);

export default SeizureProtectHead;
