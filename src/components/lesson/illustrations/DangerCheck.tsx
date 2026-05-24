interface DangerCheckProps {
  className?: string;
  title?: string;
}

/**
 * DangerCheck — flat 2D hazard icon: electrical arcs + spill boundary
 * with a solid Emergency Red warning border.
 */
export default function DangerCheck({
  className,
  title = "Check for danger: electrical hazards and environmental spills",
}: DangerCheckProps) {
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

      {/* Solid red warning border frame */}
      <rect
        x={10}
        y={10}
        width={380}
        height={240}
        rx={14}
        fill="none"
        stroke={RED}
        strokeWidth={6}
      />

      {/* Spill boundary on the ground */}
      <path
        d="M40 210 Q90 180 160 200 Q230 220 300 195 Q360 180 380 205 L380 240 L40 240 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <path
        d="M70 215 Q120 200 180 212 Q250 226 320 208"
        fill="none"
        stroke={SLATE}
        strokeWidth={2.5}
        strokeDasharray="6 5"
      />

      {/* Warning triangle */}
      <polygon
        points="200,40 310,200 90,200"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Electrical arc bolt inside triangle */}
      <polygon
        points="208,80 175,140 198,140 188,180 225,118 202,118 215,80"
        fill={RED}
        stroke={STROKE}
        strokeWidth={3}
        strokeLinejoin="round"
      />

      {/* Side arcs */}
      <g stroke={RED} strokeWidth={3.5} strokeLinecap="round" fill="none">
        <path d="M140 70 L150 80 L142 88 L154 100" />
        <path d="M260 70 L250 80 L258 88 L246 100" />
      </g>
    </svg>
  );
}
