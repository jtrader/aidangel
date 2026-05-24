interface ResponseCheckProps {
  className?: string;
  title?: string;
}

/**
 * ResponseCheck — first aider shaking a patient's shoulders with motion lines.
 */
export default function ResponseCheck({
  className,
  title = "Check for response: gently shake the patient's shoulders",
}: ResponseCheckProps) {
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

      {/* Ground line */}
      <line x1={20} y1={220} x2={380} y2={220} stroke={STROKE} strokeWidth={3} />

      {/* Patient lying down — body */}
      <rect
        x={70}
        y={190}
        width={230}
        height={30}
        rx={12}
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={4}
      />
      {/* Patient head */}
      <circle
        cx={310}
        cy={200}
        r={22}
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
      />
      {/* Closed eyes */}
      <line x1={300} y1={196} x2={308} y2={196} stroke={STROKE} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={314} y1={196} x2={322} y2={196} stroke={STROKE} strokeWidth={2.5} strokeLinecap="round" />

      {/* First aider — kneeling torso */}
      <path
        d="M110 180 Q120 120 160 120 L200 120 Q220 120 222 150 L218 190 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      {/* First aider head */}
      <circle cx={150} cy={95} r={22} fill={SILVER} stroke={STROKE} strokeWidth={4} />

      {/* Arms reaching to patient's shoulders */}
      <path
        d="M200 140 Q250 150 280 195"
        fill="none"
        stroke={STROKE}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <path
        d="M200 140 Q250 150 280 195"
        fill="none"
        stroke={SILVER}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <path
        d="M210 160 Q255 170 285 205"
        fill="none"
        stroke={STROKE}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <path
        d="M210 160 Q255 170 285 205"
        fill="none"
        stroke={SILVER}
        strokeWidth={5}
        strokeLinecap="round"
      />

      {/* Motion lines on patient's shoulder area */}
      <g stroke={RED} strokeWidth={4} strokeLinecap="round">
        <line x1={255} y1={170} x2={275} y2={160} />
        <line x1={250} y1={185} x2={272} y2={182} />
        <line x1={258} y1={200} x2={278} y2={205} />
      </g>

      {/* "Can you hear me?" speech bubble */}
      <g>
        <rect
          x={40}
          y={30}
          width={140}
          height={40}
          rx={10}
          fill={RED}
          stroke={STROKE}
          strokeWidth={3}
        />
        <polygon
          points="90,70 110,70 100,84"
          fill={RED}
          stroke={STROKE}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <text
          x={110}
          y={56}
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize={14}
          fontWeight={700}
          fill="#FFFFFF"
          letterSpacing={0.5}
        >
          CAN YOU HEAR ME?
        </text>
      </g>
    </svg>
  );
}
