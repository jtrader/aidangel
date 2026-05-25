import React, { type SVGProps } from "react";

const STROKE = "#333333";
const FILL_SILVER = "#E8EAED";
const FILL_SLATE = "#B8BFC6";
const ACCENT = "#FF0000";

const ButtonBatteryWarning: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 400 260"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby="button-battery-title"
    role="img"
    {...props}
  >
    <title id="button-battery-title">Button Battery Warning</title>

    {/* Background disc behind battery */}
    <circle cx="180" cy="130" r="105" fill={FILL_SILVER} opacity="0.4" />

    {/* Battery body — main disc */}
    <circle
      cx="180"
      cy="130"
      r="85"
      fill={FILL_SILVER}
      stroke={STROKE}
      strokeWidth="3.5"
    />

    {/* Battery positive terminal ring */}
    <circle
      cx="180"
      cy="130"
      r="68"
      fill={FILL_SLATE}
      stroke={STROKE}
      strokeWidth="3"
    />

    {/* Inner positive terminal disc */}
    <circle
      cx="180"
      cy="130"
      r="52"
      fill={FILL_SILVER}
      stroke={STROKE}
      strokeWidth="2.5"
    />

    {/* Positive terminal raised button */}
    <circle
      cx="180"
      cy="130"
      r="28"
      fill={FILL_SLATE}
      stroke={STROKE}
      strokeWidth="2.5"
    />

    {/* Positive (+) symbol */}
    <g transform="translate(180, 130)" stroke={STROKE} strokeWidth="2.5" strokeLinecap="round">
      <line x1="0" y1="-12" x2="0" y2="12" />
      <line x1="-12" y1="0" x2="12" y2="0" />
    </g>

    {/* Negative (-) indicator on lower edge */}
    <rect
      x="170"
      y="198"
      width="20"
      height="4"
      rx="2"
      fill={STROKE}
    />

    {/* Battery edge thickness hint (right side shadow) */}
    <path
      d="M265 130 A85 85 1 0 1 180 215 A85 85 1 1 1 265 130Z"
      fill="none"
      stroke={STROKE}
      strokeWidth="2.5"
      opacity="1"
    />

    {/* Warning prohibition symbol circle */}
    <circle
      cx="210"
      cy="100"
      r="55"
      fill="none"
      stroke={ACCENT}
      strokeWidth="4.5"
    />

    {/* Diagonal slash */}
    <line
      x1="171"
      y1="61"
      x2="249"
      y2="139"
      stroke={ACCENT}
      strokeWidth="4.5"
      strokeLinecap="round"
    />

    {/* 000 callout banner */}
    <g transform="translate(260, 70)">
      {/* Banner background */}
      <rect
        x="0"
        y="0"
        width="75"
        height="32"
        rx="6"
        fill={ACCENT}
        stroke={STROKE}
        strokeWidth="2"
      />
      {/* 000 text */}
      <text
        x="37.5"
        y="23"
        textAnchor="middle"
        fontSize="18"
        fontFamily="sans-serif"
        fill="#FFFFFF"
        fontWeight="800"
        letterSpacing="1"
      >
        000
      </text>
    </g>

    {/* Small battery size labels for scale */}
    <text
      x="180"
      y="232"
      textAnchor="middle"
      fontSize="10"
      fontFamily="sans-serif"
      fill={STROKE}
      fontWeight="600"
      opacity="0.7"
    >
      Lithium coin cell — highly dangerous if swallowed
    </text>

    {/* Warning exclamation inside prohibition */}
    <g transform="translate(210, 100)">
      <path
        d="M0 -18 L3 6 L-3 6 Z"
        fill={ACCENT}
      />
      <circle cx="1" cy="14" r="3" fill={ACCENT} />
    </g>

    {/* Chemical burn hazard label */}
    <g transform="translate(295, 125)">
      <rect
        x="0"
        y="0"
        width="85"
        height="22"
        rx="4"
        fill="none"
        stroke={ACCENT}
        strokeWidth="1.5"
      />
      <text
        x="42.5"
        y="16"
        textAnchor="middle"
        fontSize="9"
        fontFamily="sans-serif"
        fill={ACCENT}
        fontWeight="700"
      >
        Chemical burn risk
      </text>
    </g>
  </svg>
);

export default ButtonBatteryWarning;
