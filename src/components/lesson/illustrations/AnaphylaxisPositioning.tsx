import React, { SVGProps } from "react";

const STROKE = "#333333";
const FILL_SKIN = "#E8EAED";
const FILL_BODY = "#B8BFC6";
const ACCENT = "#FF0000";

const AnaphylaxisPositioning: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 400 280"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby="anaphylaxis-positioning-title"
    {...props}
  >
    <title id="anaphylaxis-positioning-title">Anaphylaxis Positioning</title>

    {/* Ground / surface */}
    <rect x="20" y="230" width="360" height="8" rx="4" fill={FILL_BODY} stroke={STROKE} strokeWidth="3" />

    {/* Leg elevation support (wedge/pillow under lower legs) */}
    <path
      d="M 260 230 L 300 190 L 340 190 L 300 230 Z"
      fill={FILL_BODY}
      stroke={STROKE}
      strokeWidth="3"
      strokeLinejoin="round"
    />

    {/* Patient head */}
    <circle cx="70" cy="115" r="18" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" />

    {/* Patient torso (supine) */}
    <rect x="85" y="100" width="120" height="50" rx="20" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" />

    {/* Patient upper arms */}
    <rect x="100" y="95" width="50" height="14" rx="7" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(-10 125 102)" />

    {/* Patient hips / lower body */}
    <rect x="180" y="105" width="90" height="45" rx="18" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" />

    {/* Upper legs */}
    <rect x="250" y="115" width="70" height="18" rx="9" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(8 285 124)" />

    {/* Lower legs (elevated on wedge) */}
    <rect x="305" y="175" width="55" height="16" rx="8" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(-22 332 183)" />

    {/* Feet */}
    <ellipse cx="355" cy="168" rx="10" ry="7" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" transform="rotate(-22 355 168)" />

    {/* "Legs elevated" arrow indicator */}
    <path
      d="M 320 160 L 340 140"
      stroke={ACCENT}
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      markerEnd="url(#arrowhead)"
    />
    <text x="345" y="138" fontSize="11" fontFamily="sans-serif" fill={STROKE} fontWeight="600">
      Elevate
    </text>

    {/* Arrowhead marker definition */}
    <defs>
      <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
      </marker>
    </defs>

    {/* Prohibition inset — standing silhouette with cross-out */}
    <g transform="translate(300, 40)">
      {/* Circle background */}
      <circle cx="0" cy="0" r="32" fill="#FFFFFF" stroke={STROKE} strokeWidth="3" />

      {/* Standing stick-figure silhouette */}
      <g fill={FILL_BODY} stroke={STROKE} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Head */}
        <circle cx="0" cy="-14" r="7" />
        {/* Body */}
        <line x1="0" y1="-7" x2="0" y2="8" />
        {/* Arms */}
        <line x1="0" y1="-4" x2="-10" y2="4" />
        <line x1="0" y1="-4" x2="10" y2="4" />
        {/* Legs */}
        <line x1="0" y1="8" x2="-8" y2="22" />
        <line x1="0" y1="8" x2="8" y2="22" />
      </g>

      {/* Red prohibition cross-out */}
      <circle cx="0" cy="0" r="28" fill="none" stroke={ACCENT} strokeWidth="4" />
      <line x1="-20" y1="-20" x2="20" y2="20" stroke={ACCENT} strokeWidth="4" strokeLinecap="round" />
    </g>

    {/* Label under prohibition symbol */}
    <text x="300" y="82" fontSize="10" fontFamily="sans-serif" fill={STROKE} fontWeight="700" textAnchor="middle">
      DO NOT STAND
    </text>
  </svg>
);

export default AnaphylaxisPositioning;
