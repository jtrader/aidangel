import React, { SVGProps } from "react";

const STROKE = "#333333";
const FILL_SKIN = "#E8EAED";
const FILL_SLATE = "#B8BFC6";
const FILL_SPLINT = "#D1D5DB";
const FILL_SLING = "#F5EDE0";
const ACCENT = "#FF0000";

const FractureSplintImmobilise: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 400 280"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby="fracture-splint-title"
    {...props}
  >
    <title id="fracture-splint-title">Fracture Splint Immobilise</title>

    {/* Torso / chest */}
    <rect x="60" y="90" width="140" height="110" rx="35" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" />

    {/* Neck */}
    <rect x="110" y="60" width="40" height="35" rx="12" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" />

    {/* Head */}
    <circle cx="130" cy="45" r="28" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" />

    {/* Good arm (left, resting at side) */}
    <rect x="45" y="120" width="22" height="70" rx="11" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" />
    <ellipse cx="56" cy="198" rx="10" ry="8" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" />

    {/* Injured forearm (right) resting on splint — angled across chest */}
    {/* Splint (rigid board under forearm) */}
    <rect
      x="155"
      y="105"
      width="170"
      height="36"
      rx="6"
      fill={FILL_SPLINT}
      stroke={STROKE}
      strokeWidth="3"
      transform="rotate(-18 240 123)"
    />

    {/* Injured forearm on splint */}
    <rect
      x="160"
      y="110"
      width="160"
      height="26"
      rx="13"
      fill={FILL_SKIN}
      stroke={STROKE}
      strokeWidth="3"
      transform="rotate(-18 240 123)"
    />

    {/* Hand */}
    <ellipse
      cx="325"
      cy="78"
      rx="14"
      ry="10"
      fill={FILL_SKIN}
      stroke={STROKE}
      strokeWidth="3"
      transform="rotate(-18 325 78)"
    />

    {/* Upper arm segment (upper right arm) */}
    <rect
      x="170"
      y="115"
      width="55"
      height="24"
      rx="12"
      fill={FILL_SKIN}
      stroke={STROKE}
      strokeWidth="3"
      transform="rotate(-45 197 127)"
    />

    {/* Shoulder */}
    <circle cx="190" cy="115" r="16" fill={FILL_SKIN} stroke={STROKE} strokeWidth="3" />

    {/* Sling — cloth band supporting forearm across chest */}
    <path
      d="M 200 90 Q 250 70 310 95 Q 320 100 315 110 Q 250 85 200 105 Z"
      fill={FILL_SLING}
      stroke={STROKE}
      strokeWidth="3"
      strokeLinejoin="round"
    />
    {/* Sling strap going behind neck */}
    <path
      d="M 255 78 Q 130 50 130 60"
      fill="none"
      stroke={STROKE}
      strokeWidth="3"
      strokeLinecap="round"
    />

    {/* Binding straps securing splint — highlighted in Emergency Red */}
    {/* Wrist binding */}
    <rect
      x="285"
      y="72"
      width="22"
      height="14"
      rx="4"
      fill={ACCENT}
      opacity="0.85"
      transform="rotate(-18 296 79)"
    />
    {/* Mid-forearm binding */}
    <rect
      x="215"
      y="95"
      width="24"
      height="14"
      rx="4"
      fill={ACCENT}
      opacity="0.85"
      transform="rotate(-18 227 102)"
    />
    {/* Near-elbow binding */}
    <rect
      x="170"
      y="110"
      width="22"
      height="14"
      rx="4"
      fill={ACCENT}
      opacity="0.85"
      transform="rotate(-18 181 117)"
    />

    {/* Knot indicators (small circles on bindings) */}
    <circle cx="295" cy="78" r="3" fill={ACCENT} />
    <circle cx="225" cy="100" r="3" fill={ACCENT} />
    <circle cx="178" cy="115" r="3" fill={ACCENT} />

    {/* Circulation check callout */}
    <g transform="translate(320, 170)">
      <rect x="-50" y="-18" width="100" height="36" rx="10" fill="#FFFFFF" stroke={STROKE} strokeWidth="2.5" />
      <text x="0" y="-4" fontSize="9" fontFamily="sans-serif" fill={STROKE} fontWeight="700" textAnchor="middle">
        Check every
      </text>
      <text x="0" y="10" fontSize="10" fontFamily="sans-serif" fill={ACCENT} fontWeight="800" textAnchor="middle">
        15 min
      </text>
    </g>

    {/* Arrow pointing to hand/fingertip zone */}
    <path
      d="M 330 152 L 340 125"
      stroke={ACCENT}
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
      markerEnd="url(#arrowhead-fracture)"
    />

    <defs>
      <marker id="arrowhead-fracture" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
      </marker>
    </defs>

    {/* Small finger wiggle icons to indicate circulation check */}
    <g transform="translate(340, 100)">
      <ellipse cx="0" cy="0" rx="6" ry="4" fill="none" stroke={ACCENT} strokeWidth="1.5" />
      <path d="M -3 -2 Q 1 -6 4 -1" stroke={ACCENT} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M -2 1 Q 2 5 5 0" stroke={ACCENT} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  </svg>
);

export default FractureSplintImmobilise;
