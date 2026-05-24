interface DefibPadsProps {
  className?: string;
  title?: string;
}

/**
 * DefibPads — adult chest model with two clear red accent boxes
 * highlighting precise upper-right and lower-left pad placement zones.
 */
export default function DefibPads({
  className,
  title = "AED pad placement: upper right and lower left chest",
}: DefibPadsProps) {
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
        d="M60 230 Q60 165 120 165 L280 165 Q340 165 340 205 L340 230 Z"
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Chest / torso */}
      <ellipse cx={200} cy={155} rx={95} ry={42} fill={SILVER} stroke={STROKE} strokeWidth={4} />

      {/* Collarbone hint */}
      <path
        d="M145 128 Q170 118 200 120 Q230 118 255 128"
        fill="none"
        stroke={STROKE}
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* Sternum line down center */}
      <line x1={200} y1={120} x2={200} y2={190} stroke={STROKE} strokeWidth={2} strokeDasharray="4 3" />

      {/* Upper-right pad zone — red accent box */}
      <g>
        <rect
          x={215}
          y={118}
          width={56}
          height={44}
          rx={8}
          fill="none"
          stroke={RED}
          strokeWidth={5}
        />
        {/* Pad icon inside */}
        <rect
          x={225}
          y={128}
          width={36}
          height={24}
          rx={4}
          fill={RED}
          stroke={STROKE}
          strokeWidth={2}
        />
        {/* Cross on pad */}
        <line x1={235} y1={135} x2={251} y2={145} stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
        <line x1={251} y1={135} x2={235} y2={145} stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
      </g>

      {/* Lower-left pad zone — red accent box */}
      <g>
        <rect
          x={128}
          y={158}
          width={56}
          height={44}
          rx={8}
          fill="none"
          stroke={RED}
          strokeWidth={5}
        />
        {/* Pad icon inside */}
        <rect
          x={138}
          y={168}
          width={36}
          height={24}
          rx={4}
          fill={RED}
          stroke={STROKE}
          strokeWidth={2}
        />
        {/* Cross on pad */}
        <line x1={148} y1={175} x2={164} y2={185} stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
        <line x1={164} y1={175} x2={148} y2={185} stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
      </g>

      {/* Arrow / label for upper-right pad */}
      <g>
        <path
          d="M290 140 Q305 140 315 130"
          fill="none"
          stroke={RED}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <polygon points="315,130 308,126 308,134" fill={RED} />
        <text
          x={325}
          y={134}
          textAnchor="start"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize={11}
          fontWeight={700}
          fill={RED}
        >
          UPPER RIGHT
        </text>
      </g>

      {/* Arrow / label for lower-left pad */}
      <g>
        <path
          d="M110 180 Q95 180 85 190"
          fill="none"
          stroke={RED}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <polygon points="85,190 92,186 92,194" fill={RED} />
        <text
          x={78}
          y={208}
          textAnchor="end"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize={11}
          fontWeight={700}
          fill={RED}
        >
          LOWER LEFT
        </text>
      </g>

      {/* Title label at top */}
      <text
        x={200}
        y={38}
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={12}
        fontWeight={700}
        fill={STROKE}
        letterSpacing={1}
      >
        AED PAD PLACEMENT
      </text>
    </svg>
  );
}
