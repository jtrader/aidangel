import { type SVGProps } from "react";

const STROKE = "#333333";
const FILL_SKIN = "#E8EAED";
const FILL_SLATE = "#B8BFC6";
const ACCENT = "#FF0000";
const FILL_VINEGAR = "#F5F5DC";

const MarineStingVinegar: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0  0 400 260"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby="marineStingVinegarTitle"
    role="img"
    {...props}
  >
    <title id="marineStingVinegarTitle">Marine Sting Vinegar</title>

    {/* Background fill */}
    <rect width="400" height="260" fill="#F7F7F7" />

    {/* Leg/arm shape (close-up section) */}
    <ellipse
      cx="200"
      cy="180"
      rx="90"
      ry="45"
      fill={FILL_SKIN}
      stroke={STROKE}
      strokeWidth="4"
    />

    {/* Skin detail line on limb */}
    <path
      d="M 140 175 Q 200 165 260 175"
      fill="none"
      stroke={STROKE}
      strokeWidth="2"
      opacity="0.3"
    />

    {/* Tentacle sting tracks — wavy lines across the limb */}
    <path
      d="M 155 160 C 165 155, 170 170, 180 165 C 190 160, 195 175, 205 170 C 215 165, 220 180, 230 175"
      fill="none"
      stroke={STROKE}
      strokeWidth="3"
      strokeLinecap="round"
      opacity="3"
    />
    <path
      d="M 150 185 C 160 180, 165 195, 175 190 C 185 185, 190 200, 200 195 C 210 190, 215 205, 225 200"
      fill="none"
      stroke={STROKE}
      strokeWidth="3"
      strokeLinecap="round"
      opacity="3"
    />

    {/* Red-accented sting zones being doused */}
    <ellipse cx="175" cy="170" rx="14" ry="8" fill={ACCENT} opacity="0.25" />
    <ellipse cx="205" cy="185" rx="14" ry="8" fill={ACCENT} opacity="0.25" />
    <ellipse cx="220" cy="170" rx="10" ry="6" fill={ACCENT} opacity="0.25" />

    {/* Vinegar bottle */}
    <g transform="translate(245, 40)">
      {/* Bottle body */}
      <rect
        x="0"
        y="25"
        width="50"
        height="85"
        rx="8"
        fill={FILL_SLATE}
        stroke={STROKE}
        strokeWidth="4"
      />
      {/* Bottle neck */}
      <rect
        x="16"
        y="8"
        width="18"
        height="20"
        rx="3"
        fill={FILL_SLATE}
        stroke={STROKE}
        strokeWidth="4"
      />
      {/* Cap */}
      <rect
        x="13"
        y="0"
        width="24"
        height="12"
        rx="3"
        fill={STROKE}
        stroke={STROKE}
        strokeWidth="2"
      />
      {/* Label */}
      <rect
        x="6"
        y="45"
        width="38"
        height="32"
        rx="4"
        fill={FILL_VINEGAR}
        stroke={STROKE}
        strokeWidth="2"
      />
      {/* Label text V */}
      <path
        d="M 18 55 L 22 68 L 26 55"
        fill="none"
        stroke={STROKE}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>

    {/* Vinegar pour stream */}
    <path
      d="M 270 128 Q 265 145 255 160 Q 248 175 240 185 Q 232 195 225 200"
      fill="none"
      stroke={ACCENT}
      strokeWidth="5"
      strokeLinecap="round"
      opacity="0.85"
    />
    {/* Secondary pour stream */}
    <path
      d="M 278 128 Q 275 145 265 160 Q 258 172 250 182"
      fill="none"
      stroke={ACCENT}
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.6"
    />

    {/* Splash droplets at impact zone */}
    <circle cx="225" cy="200" r="4" fill={ACCENT} opacity="0.7" />
    <circle cx="215" cy="195" r="3" fill={ACCENT} opacity="0.6" />
    <circle cx="235" cy="195" r="2.5" fill={ACCENT} opacity="0.5" />

    {/* Arrow pointing to sting zone being treated */}
    <path
      d="M 290 210 L 250 190"
      fill="none"
      stroke={ACCENT}
      strokeWidth="3"
      strokeLinecap="round"
      markerEnd="url(#arrowhead)"
    />
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 1, 9 3.5, 1 6" fill={ACCENT} />
      </marker>
    </defs>

    {/* Callout label */}
    <rect
      x="292"
      y="195"
      width="78"
      height="26"
      rx="6"
      fill={ACCENT}
      stroke={STROKE}
      strokeWidth="2"
    />
    <text
      x="331"
      y="212"
      fill="white"
      fontSize="12"
      fontWeight="bold"
      fontFamily="sans-serif"
      textAnchor="middle"
    >
      30 sec
    </text>

    {/* Ground shadow */}
    <ellipse
      cx="200"
      cy="235"
      rx="75"
      ry="10"
      fill={STROKE}
      opacity="0.08"
    />
  </svg>
);

export default MarineStingVinegar;
