import type { SVGProps } from "react";

interface ChokingAirwayProps extends SVGProps<SVGSVGElement> {
  title?: string;
}

/**
 * ChokingAirway
 * Side-profile cross-section of head/neck/upper torso showing an
 * obstructed airway (solid red blockage) and an upward curved red
 * action arrow on the torso representing an abdominal thrust / back blow.
 */
export default function ChokingAirway({
  title = "Choking airway obstruction with upward thrust direction",
  className,
  ...props
}: ChokingAirwayProps) {
  const OUTLINE = "#333333";
  const SILVER = "#E5E7EB";
  const SILVER_DARK = "#CBD5E1";
  const SLATE = "#94A3B8";
  const SLATE_DARK = "#475569";
  const RED = "#F20822";
  const RED_LIGHT = "#FF4D5A";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 320"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={title}
      className={className}
      {...props}
    >
      <title>{title}</title>
      <defs>
        <marker
          id="thrust-arrow"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={RED} stroke={OUTLINE} strokeWidth="0.8" />
        </marker>
      </defs>

      {/* Ground reference */}
      <line
        x1="20"
        y1="305"
        x2="380"
        y2="305"
        stroke={SLATE}
        strokeWidth="2"
        strokeDasharray="5 6"
      />

      {/* ===== Head & neck profile (cross-section) ===== */}
      {/* Head silhouette facing left */}
      <path
        d="M 230 40
           Q 175 35 150 80
           Q 135 110 145 145
           L 150 160
           L 170 165
           L 175 185
           Q 180 200 200 200
           L 235 200
           Z"
        fill={SILVER}
        stroke={OUTLINE}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Face features: nose, mouth opening (entry of airway) */}
      <path
        d="M 145 130 L 132 138 L 140 148 L 150 145 Z"
        fill={SILVER_DARK}
        stroke={OUTLINE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M 150 165 L 138 168 L 140 178 L 152 178"
        fill="none"
        stroke={OUTLINE}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Skull cross-section interior tint */}
      <path
        d="M 220 55 Q 175 55 160 95 Q 155 120 165 145 L 215 145 Z"
        fill={SILVER_DARK}
        opacity="0.55"
      />

      {/* ===== Neck & torso silhouette ===== */}
      <path
        d="M 200 200
           L 200 235
           Q 175 245 165 270
           L 165 305
           L 320 305
           L 320 255
           Q 305 220 270 215
           L 250 210
           L 235 200 Z"
        fill={SILVER}
        stroke={OUTLINE}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* ===== Airway tract (trachea cross-section) ===== */}
      {/* Outer airway wall */}
      <path
        d="M 178 168
           Q 188 180 192 200
           L 192 250
           Q 192 268 200 280"
        fill="none"
        stroke={OUTLINE}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 200 168
           Q 208 180 212 200
           L 212 250
           Q 212 268 220 280"
        fill="none"
        stroke={OUTLINE}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Airway lumen fill */}
      <path
        d="M 178 168
           Q 188 180 192 200
           L 192 250
           Q 192 268 200 280
           L 220 280
           Q 212 268 212 250
           L 212 200
           Q 208 180 200 168 Z"
        fill={SLATE}
        opacity="0.35"
      />

      {/* Tracheal ring hints */}
      {[210, 225, 240, 255].map((y) => (
        <line
          key={y}
          x1="192"
          y1={y}
          x2="212"
          y2={y}
          stroke={SLATE_DARK}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}

      {/* ===== Blockage: solid red circle inside the airway ===== */}
      <circle
        cx="202"
        cy="220"
        r="14"
        fill={RED}
        stroke={OUTLINE}
        strokeWidth="3"
      />
      {/* subtle highlight */}
      <circle cx="198" cy="216" r="4" fill={RED_LIGHT} opacity="0.85" />

      {/* Blockage label */}
      <text
        x="245"
        y="218"
        fontFamily="DM Sans, system-ui, sans-serif"
        fontSize="13"
        fontWeight="700"
        fill={OUTLINE}
      >
        Blockage
      </text>
      <line
        x1="218"
        y1="220"
        x2="240"
        y2="218"
        stroke={OUTLINE}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* ===== Upward curved red action arrow on the torso ===== */}
      {/* Represents the directional force of an abdominal thrust / back blow */}
      <path
        d="M 260 290 Q 245 250 255 215 Q 262 195 248 175"
        fill="none"
        stroke={RED}
        strokeWidth="6"
        strokeLinecap="round"
        markerEnd="url(#thrust-arrow)"
      />
      {/* Arrow accent line */}
      <path
        d="M 268 290 Q 256 255 263 220"
        fill="none"
        stroke={RED_LIGHT}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Thrust application point marker */}
      <circle
        cx="260"
        cy="290"
        r="6"
        fill={RED}
        stroke={OUTLINE}
        strokeWidth="2.5"
      />

      {/* Action label */}
      <text
        x="278"
        y="298"
        fontFamily="DM Sans, system-ui, sans-serif"
        fontSize="13"
        fontWeight="700"
        fill={RED}
      >
        Thrust
      </text>

      {/* Hidden a11y description */}
      <text x="-9999" y="-9999" aria-hidden="true">
        Side profile cross-section of a human head, neck, and upper torso. A
        solid red circle blocks the trachea. A curved red arrow on the torso
        points upward to illustrate the direction of an abdominal thrust or
        back blow used to clear the airway.
      </text>
    </svg>
  );
}
