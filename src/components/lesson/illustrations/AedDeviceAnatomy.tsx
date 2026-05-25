import React, { SVGProps } from "react";

const STROKE = "#333333";
const FILL_BODY = "#E8EAED";
const FILL_DARK = "#B8BFC6";
const ACCENT = "#FF0000";
const TEXT = "#333333";

const AedDeviceAnatomy: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 400 280"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby="aed-device-anatomy-title"
    {...props}
  >
    <title id="aed-device-anatomy-title">AED Device Anatomy</title>

    {/* Ground / surface */}
    <rect x="20" y="248" width="360" height="8" rx="4" fill={FILL_DARK} stroke={STROKE} strokeWidth="3" />

    {/* Main AED body — top-down view */}
    <rect x="90" y="60" width="220" height="160" rx="24" fill={FILL_BODY} stroke={STROKE} strokeWidth="3" />

    {/* Handle indent (top) */}
    <rect x="155" y="48" width="90" height="18" rx="9" fill={FILL_DARK} stroke={STROKE} strokeWidth="3" />
    <line x1="155" y1="57" x2="245" y2="57" stroke={STROKE} strokeWidth="2" opacity="0.3" />

    {/* Side grip lines (left) */}
    <rect x="78" y="90" width="12" height="60" rx="6" fill={FILL_DARK} stroke={STROKE} strokeWidth="3" />
    <rect x="78" y="160" width="12" height="40" rx="6" fill={FILL_DARK} stroke={STROKE} strokeWidth="3" />

    {/* Side grip lines (right) */}
    <rect x="310" y="90" width="12" height="60" rx="6" fill={FILL_DARK} stroke={STROKE} strokeWidth="3" />
    <rect x="310" y="160" width="12" height="40" rx="6" fill={FILL_DARK} stroke={STROKE} strokeWidth="3" />

    {/* Speaker grill (bottom left area) */}
    <g fill={STROKE} opacity="0.35">
      <circle cx="120" cy="190" r="2.5" />
      <circle cx="132" cy="190" r="2.5" />
      <circle cx="144" cy="190" r="2.5" />
      <circle cx="156" cy="190" r="2.5" />
      <circle cx="120" cy="202" r="2.5" />
      <circle cx="132" cy="202" r="2.5" />
      <circle cx="144" cy="202" r="2.5" />
      <circle cx="156" cy="202" r="2.5" />
      <circle cx="120" cy="214" r="2.5" />
      <circle cx="132" cy="214" r="2.5" />
      <circle cx="144" cy="214" r="2.5" />
      <circle cx="156" cy="214" r="2.5" />
    </g>

    {/* Speaker label line */}
    <line x1="138" y1="178" x2="138" y2="168" stroke={STROKE} strokeWidth="2" />
    <line x1="138" y1="168" x2="110" y2="168" stroke={STROKE} strokeWidth="2" />
    <text x="108" y="164" fontSize="10" fontFamily="sans-serif" fill={TEXT} fontWeight="600" textAnchor="end">
      Speaker
    </text>

    {/* Power button — Emergency Red */}
    <circle cx="260" cy="100" r="18" fill={ACCENT} stroke={STROKE} strokeWidth="3" />
    <text x="260" y="104" fontSize="10" fontFamily="sans-serif" fill="#FFFFFF" fontWeight="700" textAnchor="middle">
      ON
    </text>

    {/* Power button label line */}
    <line x1="260" y1="82" x2="260" y2="72" stroke={STROKE} strokeWidth="2" />
    <line x1="260" y1="72" x2="300" y2="72" stroke={STROKE} strokeWidth="2" />
    <text x="302" y="68" fontSize="10" fontFamily="sans-serif" fill={TEXT} fontWeight="600" textAnchor="start">
      Power button
    </text>

    {/* Pad connector port — Emergency Red */}
    <rect x="235" y="132" width="50" height="14" rx="7" fill={ACCENT} stroke={STROKE} strokeWidth="3" />
    <text x="260" y="142" fontSize="8" fontFamily="sans-serif" fill="#FFFFFF" fontWeight="700" textAnchor="middle">
      PADS
    </text>

    {/* Pad connector label line */}
    <line x1="285" y1="139" x2="300" y2="139" stroke={STROKE} strokeWidth="2" />
    <line x1="300" y1="139" x2="300" y2="112" stroke={STROKE} strokeWidth="2" />

    {/* Cable extending from pad port */}
    <path d="M 285 139 Q 320 139 335 155 Q 350 170 350 200" fill="none" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
    <path d="M 285 139 Q 320 139 335 155 Q 350 170 350 200" fill="none" stroke={FILL_DARK} strokeWidth="1.5" strokeLinecap="round" />

    {/* Pad packet (coiled pads at end of cable) */}
    <rect x="335" y="195" width="30" height="20" rx="6" fill={FILL_BODY} stroke={STROKE} strokeWidth="3" />
    <line x1="340" y1="200" x2="360" y2="200" stroke={STROKE} strokeWidth="2" />
    <line x1="340" y1="205" x2="360" y2="205" stroke={STROKE} strokeWidth="2" />
    <line x1="340" y1="210" x2="360" y2="210" stroke={STROKE} strokeWidth="2" />

    {/* Pads label line */}
    <line x1="365" y1="205" x2="380" y2="205" stroke={STROKE} strokeWidth="2" />
    <text x="382" y="209" fontSize="10" fontFamily="sans-serif" fill={TEXT} fontWeight="600" textAnchor="start">
      Pads
    </text>

    {/* Status / screen area */}
    <rect x="110" y="80" width="80" height="40" rx="8" fill={FILL_DARK} stroke={STROKE} strokeWidth="3" />
    <text x="150" y="105" fontSize="9" fontFamily="sans-serif" fill={STROKE} opacity="1" fontWeight="700" textAnchor="middle">
      ANALYZING…
    </text>

    {/* Screen label */}
    <line x1="150" y1="70" x2="150" y2="60" stroke={STROKE} strokeWidth="2" />
    <line x1="150" y1="60" x2="110" y2="60" stroke={STROKE} strokeWidth="2" />
    <text x="108" y="56" fontSize="10" fontFamily="sans-serif" fill={TEXT} fontWeight="600" textAnchor="end">
      Status screen
    </text>

    {/* Shock button */}
    <rect x="210" y="165" width="54" height="24" rx="12" fill={ACCENT} stroke={STROKE} strokeWidth="3" />
    <text x="237" y="181" fontSize="9" fontFamily="sans-serif" fill="#FFFFFF" fontWeight="700" textAnchor="middle">
      SHOCK
    </text>

    {/* Shock button label */}
    <line x1="237" y1="189" x2="237" y2="200" stroke={STROKE} strokeWidth="2" />
    <line x1="237" y1="200" x2="200" y2="200" stroke={STROKE} strokeWidth="2" />
    <text x="198" y="212" fontSize="10" fontFamily="sans-serif" fill={TEXT} fontWeight="600" textAnchor="end">
      Shock button
    </text>
  </svg>
);

export default AedDeviceAnatomy;
