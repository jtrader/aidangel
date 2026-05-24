interface BreathingCheckProps {
  className?: string;
  title?: string;
}

/**
 * BreathingCheck — first aider leaning close to a patient's face
 * to look, listen, and feel for regular chest movement.
 */
export default function BreathingCheck({
  className,
  title = "Check breathing: look, listen, and feel for chest movement",
}: BreathingCheckProps) {
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

      {/* Ground */}
      <line x1={20} y1={230} x2={380} y2={230} stroke={STROKE} strokeWidth={3} />

      {/* Patient body — lying flat */}
      <path
        d="M50 230 Q50 175 100 175 L280 175 Q330 175 330 210 L330 230 Z"
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Patient head */}
      <circle cx={340} cy={185} r={28} fill={SILVER} stroke={STROKE} strokeWidth={4} />
      {/* Tilted-back face features */}
      <line x1={352} y1={178} x2={360} y2={178} stroke={STROKE} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M362 185 L370 188 L362 192" fill="none" stroke={STROKE} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* Patient chest — slightly raised for breathing */}
      <ellipse cx={200} cy={168} rx={55} ry={16} fill={SILVER} stroke={STROKE} strokeWidth={3} />

      {/* First aider — kneeling torso leaning forward */}
      <path
        d="M80 230 Q90 140 140 120 L200 120 Q230 120 235 160 L228 230 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* First aider head — leaning close to patient's face */}
      <ellipse cx={245} cy={105} rx={24} ry={22} fill={SILVER} stroke={STROKE} strokeWidth={4} />
      {/* Ear facing the patient (listening) */}
      <ellipse cx={228} cy={105} rx={6} ry={10} fill={SLATE} stroke={STROKE} strokeWidth={2.5} />

      {/* First aider arm on patient's chest (feeling for rise) */}
      <path
        d="M200 150 Q230 160 250 165"
        fill="none"
        stroke={STROKE}
        strokeWidth={8}
        strokeLinecap="round"
      />
      <path
        d="M200 150 Q230 160 250 165"
        fill="none"
        stroke={SILVER}
        strokeWidth={4}
        strokeLinecap="round"
      />
      {/* Hand on chest */}
      <ellipse cx={255} cy={166} rx={12} ry={8} fill={SILVER} stroke={STROKE} strokeWidth={3} />

      {/* Red breathing indicator — chest rising motion */}
      <g>
        <path
          d="M160 145 Q200 125 240 145"
          fill="none"
          stroke={RED}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray="5 4"
        />
        <polygon
          points="240,145 232,138 232,152"
          fill={RED}
          stroke={STROKE}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </g>

      {/* "Look, Listen, Feel" label badge */}
      <g>
        <rect
          x={120}
          y={30}
          width={160}
          height={26}
          rx={6}
          fill={RED}
          stroke={STROKE}
          strokeWidth={2}
        />
        <text
          x={200}
          y={48}
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize={12}
          fontWeight={700}
          fill="#FFFFFF"
          letterSpacing={1}
        >
          LOOK — LISTEN — FEEL
        </text>
      </g>

      {/* Sound wave lines near ear */}
      <g stroke={RED} strokeWidth={2.5} strokeLinecap="round" fill="none">
        <path d="M215 95 Q200 90 195 85" />
        <path d="M218 105 Q200 105 190 105" />
        <path d="M215 115 Q200 120 195 125" />
      </g>
    </svg>
  );
}
