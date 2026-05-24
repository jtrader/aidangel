interface AnaphylaxisAutoInjectorProps {
  className?: string;
  title?: string;
}

/**
 * AnaphylaxisAutoInjector — a leg outer-thigh section with an auto-injector pen
 * positioned perpendicular to the muscle wall, highlighting the injection target.
 */
export default function AnaphylaxisAutoInjector({
  className,
  title = "Inject adrenaline auto-injector into the outer mid-thigh",
}: AnaphylaxisAutoInjectorProps) {
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

      {/* Thigh / leg section — vertical limb silhouette (outer thigh) */}
      <path
        d="M160 40 Q240 40 240 60 L240 210 Q240 230 160 230 Q80 230 80 210 L80 60 Q80 40 160 40 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Muscle contour line */}
      <path
        d="M90 110 Q120 100 150 105 Q180 110 200 105 Q220 100 230 115"
        fill="none"
        stroke={SLATE}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.5}
      />

      {/* Injection sweet spot — bold emergency red target circle on outer mid-thigh */}
      <circle cx={200} cy={140} r={32} fill="none" stroke={RED} strokeWidth={4} opacity={0.9} />
      <circle cx={200} cy={140} r={20} fill="none" stroke={RED} strokeWidth={2} opacity={1} />
      {/* Crosshair */}
      <line x1={200} y1={108} x2={200} y2={172} stroke={RED} strokeWidth={2} strokeLinecap="round" opacity={0.8} />
      <line x1={168} y1={140} x2={232} y2={140} stroke={RED} strokeWidth={2} strokeLinecap="round" opacity={0.8} />

      {/* Auto-injector pen — sleek first-aid unit perpendicular to muscle wall */}
      {/* Pen body (vertical, centered over target) */}
      <rect
        x={190}
        y={40}
        width={20}
        height={130}
        rx={8}
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={3}
      />

      {/* Pen cap / top */}
      <rect
        x={186}
        y={30}
        width={28}
        height={18}
        rx={6}
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={3}
      />

      {/* Pen label window */}
      <rect x={194} y={60} width={12} height={40} rx={2} fill={SILVER} stroke={STROKE} strokeWidth={2} />

      {/* Pen needle end / orange tip */}
      <rect x={193} y={168} width={14} height={10} rx={3} fill="#F97316" stroke={STROKE} strokeWidth={2} />

      {/* Pen grip texture lines */}
      <line x1={192} y1={120} x2={208} y2={120} stroke={STROKE} strokeWidth={1.5} strokeLinecap="round" opacity={0.5} />
      <line x1={192} y1={128} x2={208} y2={128} stroke={STROKE} strokeWidth={1.5} strokeLinecap="round" opacity={0.5} />
      <line x1={192} y1={136} x2={208} y2={136} stroke={STROKE} strokeWidth={1.5} strokeLinecap="round" opacity={0.5} />

      {/* Downward action arrow — red plunge momentum indicator */}
      {/* Arrow shaft */}
      <line
        x1={260}
        y1={55}
        x2={260}
        y2={145}
        stroke={RED}
        strokeWidth={5}
        strokeLinecap="round"
      />
      {/* Arrowhead */}
      <polygon
        points="260,155 250,140 270,140"
        fill={RED}
        stroke={RED}
        strokeWidth={1}
        strokeLinejoin="round"
      />

      {/* Motion / impact lines around the target */}
      <line x1={240} y1={115} x2={250} y2={110} stroke={RED} strokeWidth={2} strokeLinecap="round" opacity={0.6} />
      <line x1={240} y1={165} x2={250} y2={170} stroke={RED} strokeWidth={2} strokeLinecap="round" opacity={0.6} />

      {/* Action label */}
      <text
        x={280}
        y={110}
        textAnchor="start"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={11}
        fontWeight={700}
        fill={RED}
        letterSpacing={0.5}
      >
        PLUNGE
      </text>
      <text
        x={280}
        y={125}
        textAnchor="start"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={11}
        fontWeight={700}
        fill={RED}
        letterSpacing={0.5}
      >
        FIRM
      </text>

      {/* Hold label */}
      <text
        x={200}
        y={250}
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={12}
        fontWeight={700}
        fill={RED}
        letterSpacing={0.5}
      >
        HOLD 10 SECONDS
      </text>
    </svg>
  );
}
