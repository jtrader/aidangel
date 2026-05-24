interface SendForHelpProps {
  className?: string;
  title?: string;
}

/**
 * SendForHelp — smartphone displaying 000 on a red calling screen with audio waves.
 */
export default function SendForHelp({
  className,
  title = "Send for help: call Triple Zero (000) for an ambulance",
}: SendForHelpProps) {
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

      {/* Phone body */}
      <rect
        x={140}
        y={20}
        width={120}
        height={220}
        rx={20}
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={4}
      />
      {/* Screen */}
      <rect
        x={152}
        y={36}
        width={96}
        height={188}
        rx={8}
        fill={RED}
        stroke={STROKE}
        strokeWidth={3}
      />
      {/* Speaker notch */}
      <rect x={185} y={28} width={30} height={5} rx={2.5} fill={STROKE} />

      {/* 000 number */}
      <text
        x={200}
        y={120}
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={48}
        fontWeight={800}
        fill="#FFFFFF"
        letterSpacing={2}
      >
        000
      </text>
      <text
        x={200}
        y={142}
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={10}
        fontWeight={700}
        fill="#FFFFFF"
        letterSpacing={2}
      >
        CALLING…
      </text>

      {/* End call button on screen */}
      <circle
        cx={200}
        cy={195}
        r={18}
        fill="#FFFFFF"
        stroke={STROKE}
        strokeWidth={3}
      />
      <path
        d="M191 197 Q200 188 209 197 L206 201 Q200 196 194 201 Z"
        fill={RED}
        stroke={STROKE}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {/* Audio waves left */}
      <g stroke={RED} strokeWidth={4} strokeLinecap="round" fill="none">
        <path d="M115 100 Q100 130 115 160" />
        <path d="M95 80 Q70 130 95 180" />
        <path d="M75 60 Q40 130 75 200" />
      </g>
      {/* Audio waves right */}
      <g stroke={RED} strokeWidth={4} strokeLinecap="round" fill="none">
        <path d="M285 100 Q300 130 285 160" />
        <path d="M305 80 Q330 130 305 180" />
        <path d="M325 60 Q360 130 325 200" />
      </g>

      {/* Small silver speaker badge */}
      <circle cx={60} cy={130} r={10} fill={SILVER} stroke={STROKE} strokeWidth={3} />
      <circle cx={340} cy={130} r={10} fill={SILVER} stroke={STROKE} strokeWidth={3} />
    </svg>
  );
}
