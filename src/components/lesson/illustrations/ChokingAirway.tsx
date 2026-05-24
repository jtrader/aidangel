interface ChokingAirwayProps {
  className?: string;
  title?: string;
}

/**
 * ChokingAirway — cross-section of neck and throat showing a blocked airway
 * with a red obstruction and an upward force arrow for back blows / thrusts.
 */
export default function ChokingAirway({
  className,
  title = "Choking airway: obstruction in the throat",
}: ChokingAirwayProps) {
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

      {/* Torso silhouette */}
      <path
        d="M60 230 Q60 160 120 160 L280 160 Q340 160 340 210 L340 230 Z"
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Neck */}
      <rect
        x={170}
        y={80}
        width={60}
        height={80}
        rx={10}
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
      />

      {/* Head profile (simplified cross-section circle) */}
      <ellipse
        cx={200}
        cy={55}
        rx={48}
        ry={40}
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
      />

      {/* Mouth opening */}
      <ellipse
        cx={200}
        cy={85}
        rx={22}
        ry={10}
        fill="#FFFFFF"
        stroke={STROKE}
        strokeWidth={3}
      />

      {/* Throat / airway tube */}
      <path
        d="M200 95 L200 180"
        fill="none"
        stroke={STROKE}
        strokeWidth={8}
        strokeLinecap="round"
      />
      {/* Inner airway */}
      <path
        d="M200 95 L200 180"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* Red obstruction circle blocking the airway */}
      <circle
        cx={200}
        cy={145}
        r={16}
        fill={RED}
        stroke={STROKE}
        strokeWidth={3}
      />
      {/* Cross on obstruction to show "blocked" */}
      <line x1={192} y1={137} x2={208} y2={153} stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
      <line x1={208} y1={137} x2={192} y2={153} stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />

      {/* Upward curved force arrow on torso (back blow / thrust direction) */}
      <path
        d="M120 200 Q160 140 200 120"
        fill="none"
        stroke={RED}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray="none"
      />
      {/* Arrow head pointing upward along the curve */}
      <polygon
        points="200,120 192,132 208,132"
        fill={RED}
        stroke={STROKE}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Motion emphasis lines around the arrow */}
      <path
        d="M105 195 Q145 130 185 115"
        fill="none"
        stroke={RED}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.5}
      />
      <path
        d="M135 210 Q170 150 210 130"
        fill="none"
        stroke={RED}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.5}
      />

      {/* Warning indicator on obstruction */}
      <text
        x={200}
        y={200}
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={11}
        fontWeight={700}
        fill={RED}
        letterSpacing={0.5}
      >
        BLOCKED
      </text>
    </svg>
  );
}
