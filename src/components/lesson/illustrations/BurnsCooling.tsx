interface BurnsCoolingProps {
  className?: string;
  title?: string;
}

/**
 * BurnsCooling — a forearm with a red burn surface beneath a domestic tap,
 * showing cascading cool water streams flowing over the burn for 20 minutes.
 */
export default function BurnsCooling({
  className,
  title = "Cool the burn under running water for at least 20 minutes",
}: BurnsCoolingProps) {
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

      {/* Background surface */}
      <rect x={20} y={20} width={360} height={220} rx={12} fill="#F9FAFB" stroke={STROKE} strokeWidth={3} />

      {/* Forearm — horizontal limb silhouette */}
      <path
        d="M40 165 Q40 140 75 140 L325 140 Q360 140 360 165 L360 195 Q360 220 325 220 L75 220 Q40 220 40 195 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Burn site — emergency red surface block on the skin */}
      <rect
        x={140}
        y={150}
        width={120}
        height={60}
        rx={8}
        fill={RED}
        stroke={STROKE}
        strokeWidth={3}
        opacity={0.85}
      />

      {/* Burn texture / heat waves */}
      <path d="M155 160 Q165 150 175 160" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" opacity={1} />
      <path d="M185 158 Q195 148 205 158" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" opacity={1} />
      <path d="M215 160 Q225 150 235 160" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" opacity={1} />
      <path d="M165 178 Q175 168 185 178" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" opacity={1} />
      <path d="M195 176 Q205 166 215 176" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" opacity={1} />

      {/* Tap fixture — silver-grey domestic tap positioned above the burn */}
      {/* Tap base plate */}
      <rect x={175} y={45} width={50} height={14} rx={4} fill={SLATE} stroke={STROKE} strokeWidth={3} />

      {/* Tap body / spout */}
      <path
        d="M185 45 L185 25 Q185 12 200 12 Q215 12 215 25 L215 45"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Tap nozzle / outlet */}
      <rect x={190} y={45} width={20} height={10} rx={3} fill={SLATE} stroke={STROKE} strokeWidth={3} />

      {/* Tap handle (cross shape) */}
      <line x1={170} y1={22} x2={195} y2={22} stroke={STROKE} strokeWidth={4} strokeLinecap="round" />
      <line x1={183} y1={10} x2={183} y2={34} stroke={STROKE} strokeWidth={4} strokeLinecap="round" />

      {/* Cascading water streams — slate-grey fluid over the red burn */}
      {/* Main central stream */}
      <path
        d="M195 55 Q195 80 200 120 Q205 150 200 180"
        fill="none"
        stroke={SLATE}
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.9}
      />
      {/* Left stream */}
      <path
        d="M185 55 Q182 75 185 110 Q188 145 185 175"
        fill="none"
        stroke={SLATE}
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.7}
      />
      {/* Right stream */}
      <path
        d="M205 55 Q208 75 205 110 Q202 145 205 175"
        fill="none"
        stroke={SLATE}
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.7}
      />

      {/* Water droplets / splash detail */}
      <ellipse cx={178} cy={170} rx={3} ry={5} fill={SLATE} opacity={0.5} />
      <ellipse cx={220} cy={165} rx={3} ry={5} fill={SLATE} opacity={0.5} />
      <ellipse cx={195} cy={188} rx={4} ry={6} fill={SLATE} opacity={0.4} />

      {/* Time reminder label */}
      <text
        x={200}
        y={245}
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={12}
        fontWeight={700}
        fill={RED}
        letterSpacing={0.5}
      >
        20 MINUTES
      </text>
    </svg>
  );
}
