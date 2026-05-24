interface CPREssentialsProps {
  className?: string;
  title?: string;
}

/**
 * CPREssentials — interlocked hands positioned over the lower sternum
 * with a 5cm vertical compression depth indicator.
 */
export default function CPREssentials({
  className,
  title = "CPR essentials: interlocked hands on lower sternum, compress 5cm deep",
}: CPREssentialsProps) {
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

      {/* Patient body base */}
      <path
        d="M50 230 Q50 170 110 170 L290 170 Q350 170 350 210 L350 230 Z"
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Chest / torso upper area */}
      <ellipse cx={200} cy={165} rx={90} ry={38} fill={SILVER} stroke={STROKE} strokeWidth={4} />

      {/* Sternum line (center) */}
      <line x1={200} y1={135} x2={200} y2={198} stroke={STROKE} strokeWidth={2.5} strokeDasharray="4 3" />

      {/* Interlocked hands — simplified top-down shape */}
      {/* Back hand (darker) */}
      <path
        d="M155 120 Q150 145 160 165 Q175 180 200 182 Q225 180 240 165 Q250 145 245 120"
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      {/* Front hand (lighter, overlapping) */}
      <path
        d="M165 115 Q160 140 170 160 Q185 175 200 177 Q215 175 230 160 Q240 140 235 115"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />

      {/* Fingers interlock indication */}
      <g stroke={STROKE} strokeWidth={2.5} strokeLinecap="round">
        <line x1={172} y1={130} x2={180} y2={138} />
        <line x1={180} y1={128} x2={188} y2={136} />
        <line x1={188} y1={126} x2={196} y2={134} />
        <line x1={212} y1={126} x2={204} y2={134} />
        <line x1={220} y1={128} x2={212} y2={136} />
        <line x1={228} y1={130} x2={220} y2={138} />
      </g>

      {/* Compression target zone — lower half of sternum */}
      <rect
        x={165}
        y={152}
        width={70}
        height={40}
        rx={6}
        fill="none"
        stroke={RED}
        strokeWidth={4}
        strokeDasharray="6 5"
      />

      {/* 5cm depth indicator — vertical arrow */}
      <g>
        {/* Arrow shaft */}
        <line x1={280} y1={125} x2={280} y2={185} stroke={RED} strokeWidth={4} strokeLinecap="round" />
        {/* Arrow head top */}
        <polygon points="280,125 273,135 287,135" fill={RED} stroke={STROKE} strokeWidth={2} strokeLinejoin="round" />
        {/* Arrow head bottom */}
        <polygon points="280,185 273,175 287,175" fill={RED} stroke={STROKE} strokeWidth={2} strokeLinejoin="round" />
        {/* Measurement line connecting to chest */}
        <line x1={265} y1={155} x2={280} y2={155} stroke={RED} strokeWidth={2.5} strokeLinecap="round" />
        <line x1={235} y1={155} x2={250} y2={155} stroke={RED} strokeWidth={2} strokeDasharray="3 3" />
      </g>

      {/* Label */}
      <text
        x={280}
        y={105}
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={12}
        fontWeight={700}
        fill={RED}
        letterSpacing={0.5}
      >
        5 cm DEPTH
      </text>

      {/* Position label */}
      <text
        x={200}
        y={45}
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={12}
        fontWeight={700}
        fill={STROKE}
        letterSpacing={1}
      >
        LOWER HALF OF STERNUM
      </text>
    </svg>
  );
}
