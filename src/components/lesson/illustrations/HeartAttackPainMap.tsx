import React from "react";

const HeartAttackPainMap: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className,
  ...props
}) => {
  const STROKE = "#333333";
  const SILVER = "#E8EAED";
  const SLATE = "#B8BFC6";
  const RED = "#FF0000";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 320"
      role="img"
      aria-labelledby="heart-attack-pain-map-title"
      className={className}
      {...props}
    >
      <title id="heart-attack-pain-map-title">Heart Attack Pain Map</title>

      {/* Background card */}
      <rect
        x="20"
        y="10"
        width="360"
        height="300"
        rx="12"
        fill="#F9FAFB"
        stroke={STROKE}
        strokeWidth="3"
      />

      {/* Torso base shape */}
      {/* Neck */}
      <path
        d="M175 45 L225 45 L220 70 L180 70 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Head silhouette (front, simplified) */}
      <ellipse
        cx="200"
        cy="22"
        rx="28"
        ry="22"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth="3"
      />
      {/* Jaw line hint */}
      <path
        d="M175 30 Q200 48 225 30"
        fill="none"
        stroke={STROKE}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Shoulders and upper torso */}
      <path
        d="M120 70 Q200 55 280 70 L300 120 Q310 160 305 200 L295 240 Q200 250 105 240 L95 200 Q90 160 100 120 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Collarbone lines */}
      <path
        d="M155 85 Q200 95 245 85"
        fill="none"
        stroke={STROKE}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Left arm (simplified down to elbow area) */}
      <path
        d="M120 70 L85 140 L95 160 L120 120"
        fill={SLATE}
        stroke={STROKE}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Right arm (simplified down to elbow area) */}
      <path
        d="M280 70 L315 140 L305 160 L280 120"
        fill={SLATE}
        stroke={STROKE}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Central chest pain zone — Emergency Red filled area */}
      <ellipse
        cx="200"
        cy="125"
        rx="36"
        ry="28"
        fill={RED}
        fillOpacity="0.65"
        stroke={STROKE}
        strokeWidth="2.5"
      />

      {/* Inner core highlight */}
      <ellipse
        cx="200"
        cy="125"
        rx="20"
        ry="16"
        fill={RED}
        fillOpacity="0.85"
        stroke="none"
      />

      {/* Pain radiating path — left shoulder / arm */}
      <path
        d="M170 118 Q145 100 120 90 Q100 110 90 140"
        fill="none"
        stroke={RED}
        strokeWidth="5"
        strokeLinecap="round"
        opacity="1"
      />
      <path
        d="M170 118 Q145 100 120 90 Q100 110 90 140"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
        strokeDasharray="6 4"
      />

      {/* Pain radiating path — right shoulder (lighter, less common) */}
      <path
        d="M230 118 Q255 100 280 90"
        fill="none"
        stroke={RED}
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Pain radiating path — up to jaw */}
      <path
        d="M195 100 Q190 60 185 35"
        fill="none"
        stroke={RED}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M195 100 Q190 60 185 35"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.9"
        strokeDasharray="4 4"
      />

      {/* Pain radiating path — down the back (subtle, behind torso feel) */}
      <path
        d="M200 150 Q200 180 205 210 Q210 230 220 250"
        fill="none"
        stroke={RED}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Warning icon over chest */}
      <polygon
        points="200,105 192,118 208,118"
        fill={STROKE}
        stroke={STROKE}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <line x1="200" y1="120" x2="200" y2="126" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <circle cx="200" cy="129" r="1.2" fill="#FFFFFF" />

      {/* Labels */}
      <text
        x="200"
        y="290"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill={STROKE}
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        letterSpacing="0.5"
      >
        CLASSIC HEART ATTACK SYMPTOM ZONES
      </text>

      {/* Annotation lines to labels */}
      {/* Jaw label */}
      <line x1="175" y1="30" x2="145" y2="22" stroke={STROKE} strokeWidth="1.5" />
      <text x="142" y="26" textAnchor="end" fontSize="10" fontWeight="600" fill={RED} fontFamily="ui-sans-serif, system-ui, sans-serif">
        Jaw
      </text>

      {/* Left arm label */}
      <line x1="95" y1="140" x2="65" y2="150" stroke={STROKE} strokeWidth="1.5" />
      <text x="62" y="154" textAnchor="end" fontSize="10" fontWeight="600" fill={RED} fontFamily="ui-sans-serif, system-ui, sans-serif">
        Left arm
      </text>

      {/* Back label */}
      <line x1="225" y1="245" x2="255" y2="255" stroke={STROKE} strokeWidth="1.5" />
      <text x="258" y="259" textAnchor="start" fontSize="10" fontWeight="600" fill={RED} fontFamily="ui-sans-serif, system-ui, sans-serif">
        Back
      </text>

      {/* Central chest label */}
      <text x="200" y="170" textAnchor="middle" fontSize="10" fontWeight="700" fill={STROKE} fontFamily="ui-sans-serif, system-ui, sans-serif">
        Chest pressure / tightness
      </text>
    </svg>
  );
};

export default HeartAttackPainMap;
