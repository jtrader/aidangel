import React, { type SVGProps } from "react";

const STROKE = "#333333";
const FILL_WATER = "#B8BFC6";
const FILL_BASIN = "#E8EAED";
const ACCENT = "#FF0000";
const FILL_SKIN = "#F0E6DD";

const FrostbiteRewarming: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 400 260"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby="frostbiteTitle"
    role="img"
    {...props}
  >
    <title id="frostbiteTitle">Frostbite Rewarming</title>

    {/* Basin — back rim */}
    <ellipse
      cx="200"
      cy="165"
      rx="140"
      ry="45"
      fill={FILL_BASIN}
      stroke={STROKE}
      strokeWidth="3"
    />

    {/* Basin — body */}
    <path
      d="M60 165 L60 200 C60 230 120 250 200 250 C280 250 340 230 340 200 L340 165"
      fill={FILL_BASIN}
      stroke={STROKE}
      strokeWidth="3"
      strokeLinejoin="round"
    />

    {/* Basin — front rim */}
    <ellipse
      cx="200"
      cy="165"
      rx="140"
      ry="45"
      fill="none"
      stroke={STROKE}
      strokeWidth="3"
    />

    {/* Water surface */}
    <ellipse
      cx="200"
      cy="170"
      rx="125"
      ry="38"
      fill={FILL_WATER}
      opacity="0.8"
    />

    {/* Foot submerged */}
    <g transform="translate(130, 145)">
      {/* Leg/ankle */}
      <rect
        x="25"
        y="-40"
        width="40"
        height="50"
        rx="6"
        fill={FILL_SKIN}
        stroke={STROKE}
        strokeWidth="3"
      />

      {/* Foot shape */}
      <path
        d="M15 10 C5 25 5 55 20 65 C35 75 55 75 70 65 C85 55 85 25 75 10 C65 -5 25 -5 15 10Z"
        fill={FILL_SKIN}
        stroke={STROKE}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Toes */}
      <ellipse cx="20" cy="68" rx="6" ry="4" fill={FILL_SKIN} stroke={STROKE} strokeWidth="2" />
      <ellipse cx="35" cy="72" rx="6" ry="4" fill={FILL_SKIN} stroke={STROKE} strokeWidth="2" />
      <ellipse cx="52" cy="73" rx="6" ry="4" fill={FILL_SKIN} stroke={STROKE} strokeWidth="2" />
      <ellipse cx="69" cy="70" rx="5" ry="3.5" fill={FILL_SKIN} stroke={STROKE} strokeWidth="2" />

      {/* Frostbite patches — pale/discolored areas */}
      <ellipse cx="32" cy="45" rx="10" ry="7" fill="#D4C4B8" opacity="  " />
      <ellipse cx="58" cy="38" rx="8" ry="6" fill="#D4C4B8" opacity="0.6" />
    </g>

    {/* Thermometer stem */}
    <rect
      x="280"
      y="50"
      width="8"
      height="140"
      rx="4"
      fill="#FFFFFF"
      stroke={STROKE}
      strokeWidth="2.5"
    />

    {/* Thermometer bulb */}
    <circle
      cx="284"
      cy="195"
      r="12"
      fill="#FFFFFF"
      stroke={STROKE}
      strokeWidth="2.5"
    />

    {/* Thermometer liquid column */}
    <rect
      x="282"
      y="90"
      width="4"
      height="105"
      rx="2"
      fill={ACCENT}
    />

    {/* Safe temperature range band on thermometer */}
    <rect
      x="279"
      y="110"
      width="10"
      height="28"
      rx="2"
      fill={ACCENT}
      opacity="0.3"
    />

    {/* Safe range label line */}
    <line
      x1="295"
      y1="124"
      x2="320"
      y2="124"
      stroke={STROKE}
      strokeWidth="1.5"
    />
    <text
      x="325"
      y="128"
      fontSize="10"
      fontFamily="sans-serif"
      fill={STROKE}
      fontWeight="600"
    >
      Safe range
    </text>

    {/* Temperature marks */}
    {[60, 80, 100, 120, 140, 160].map((y) => (
      <line
        key={y}
        x1="276"
        y1={y}
        x2="280"
        y2={y}
        stroke={STROKE}
        strokeWidth="1.5"
      />
    ))}

    {/* Thermometer top cap */}
    <circle
      cx="284"
      cy="52"
      r="6"
      fill={STROKE}
    />

    {/* Water ripples around submerged foot */}
    <ellipse
      cx="180"
      cy="175"
      rx="55"
      ry="14"
      fill="none"
      stroke={STROKE}
      strokeWidth="1.5"
      opacity="0.4"
    />
    <ellipse
      cx="180"
      cy="180"
      rx="40"
      ry="10"
      fill="none"
      stroke={STROKE}
      strokeWidth="1.5"
      opacity="0.3"
    />

    {/* Warm steam wisps */}
    <path
      d="M120 130 Q130 110 125 95"
      fill="none"
      stroke={STROKE}
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.25"
    />
    <path
      d="M200 125 Q210 105 205 90"
      fill="none"
      stroke={STROKE}
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.25"
    />
    <path
      d="M270 135 Q280 115 275 100"
      fill="none"
      stroke={STROKE}
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.25"
    />

    {/* Subtle label on basin */}
    <text
      x="200"
      y="240"
      textAnchor="middle"
      fontSize="11"
      fontFamily="sans-serif"
      fill={STROKE}
      opacity="0.5"
      fontWeight="500"
    >
      Warm water bath
    </text>
  </svg>
);

export default FrostbiteRewarming;
