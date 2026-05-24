interface AirwayOpenProps {
  className?: string;
  title?: string;
}

/**
 * AirwayOpen — side-profile head tilt and chin lift maneuver
 * to open and clear the throat path.
 */
export default function AirwayOpen({
  className,
  title = "Open the airway: head tilt and chin lift",
}: AirwayOpenProps) {
  const STROKE = "#333333";
  const SILVER = "#E5E7EB";
  const SLATE = "#475569";
  const RED = "#F20822";

  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 0 400 260"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <title>{title}</title>

      {/* Ground / surface */}
      <line x1={20} y1={230} x2={380} y2={230} stroke={STROKE} strokeWidth={3} />

      {/* Patient body silhouette (torso) */}
      <path
        d="M40 230 Q40 170 90 170 L250 170 Q290 170 290 210 L290 230 Z"
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Patient head — side profile, tilted back */}
      <ellipse
        cx={280}
        cy={145}
        rx={38}
        ry={32}
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
      />

      {/* Jaw / chin area */}
      <path
        d="M255 165 Q270 185 295 170"
        fill="none"
        stroke={STROKE}
        strokeWidth={3.5}
        strokeLinecap="round"
      />

      {/* Closed eye (relaxed) */}
      <line x1={308} y1={138} x2={316} y2={138} stroke={STROKE} strokeWidth={2.5} strokeLinecap="round" />

      {/* Nose profile */}
      <path
        d="M318 145 L328 150 L318 155"
        fill="none"
        stroke={STROKE}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Open mouth — airway path opening */}
      <path
        d="M295 165 Q305 172 315 168"
        fill="none"
        stroke={STROKE}
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* First aider arm / hand doing chin lift */}
      <path
        d="M120 120 Q180 80 250 95"
        fill="none"
        stroke={STROKE}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <path
        d="M120 120 Q180 80 250 95"
        fill="none"
        stroke={SILVER}
        strokeWidth={5}
        strokeLinecap="round"
      />

      {/* First aider hand shape on chin */}
      <ellipse cx={255} cy={98} rx={14} ry={10} fill={SILVER} stroke={STROKE} strokeWidth={3} />
      {/* Fingers indicated */}
      <g stroke={STROKE} strokeWidth={2.5} strokeLinecap="round">
        <line x1={248} y1={94} x2={242} y2={86} />
        <line x1={254} y1={92} x2={250} y2={82} />
        <line x1={260} y1={94} x2={260} y2={84} />
      </g>

      {/* Second arm / hand on forehead for head tilt */}
      <path
        d="M110 90 Q170 50 240 55"
        fill="none"
        stroke={STROKE}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <path
        d="M110 90 Q170 50 240 55"
        fill="none"
        stroke={SILVER}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <ellipse cx={245} cy={52} rx={12} ry={9} fill={SILVER} stroke={STROKE} strokeWidth={3} />

      {/* Red airway path arrow — shows cleared throat */}
      <g>
        {/* Throat path tube */}
        <path
          d="M305 165 Q320 160 330 145 Q340 125 325 110"
          fill="none"
          stroke={RED}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray="6 4"
        />
        {/* Arrow head at top */}
        <polygon
          points="325,110 318,118 332,118"
          fill={RED}
          stroke={STROKE}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </g>

      {/* Label */}
      <text
        x={200}
        y={42}
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={12}
        fontWeight={700}
        fill={RED}
        letterSpacing={1}
      >
        TILT HEAD — LIFT CHIN
      </text>
    </svg>
  );
}
