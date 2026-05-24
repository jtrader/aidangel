interface DiabeticHypoSugarProps {
  className?: string;
  title?: string;
}

/**
 * DiabeticHypoSugar — a reclining patient silhouette with quick-access
 * glucose sources (jelly beans, orange juice) highlighted for treating
 * hypoglycaemia. Emergency Red unlock ring and pointer arrow emphasise
 * the urgent sugar administration action.
 *
 * NOTE: No baked-in text glyphs. All human-readable copy is exposed via
 * the `title` prop for the platform's translation engine.
 */
export default function DiabeticHypoSugar({
  className,
  title = "Give fast-acting sugar immediately",
}: DiabeticHypoSugarProps) {
  const STROKE = "#333333";
  const SILVER = "#E5E7EB";
  const SLATE = "#475569";
  const RED = "#F20822";
  const JELLY_BEAN = "#F59E0B";
  const JUICE = "#FB923C";

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

      {/* Ground / surface plane */}
      <rect x={20} y={240} width={360} height={8} rx={3} fill={SLATE} stroke={STROKE} strokeWidth={3} />

      {/* Patient silhouette — reclining, angled slightly */}
      {/* Legs */}
      <path
        d="M80 235 L140 235 L160 215 L180 215 L200 195 L200 175 L180 155 L160 155 L140 175 L100 195 L80 215 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Torso */}
      <path
        d="M180 155 L220 155 Q240 155 248 140 L260 110 Q268 95 260 80 L240 70 Q220 60 200 70 L180 90 Q170 105 170 120 L170 140 Q170 155 180 155 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Head */}
      <ellipse
        cx={248}
        cy={55}
        rx={32}
        ry={26}
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
      />

      {/* Left arm (resting on body) */}
      <path
        d="M210 85 L190 110 Q184 118 190 124 L200 130 Q208 136 214 128 L234 100 Q240 92 234 86 L224 80 Q216 74 210 85 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Right arm (relaxed at side) */}
      <path
        d="M260 90 L280 115 Q286 122 280 128 L270 134 Q262 140 256 132 L240 108 Q234 100 240 94 L250 86 Q256 80 260 90 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Jelly bean — fast-acting sugar (left side, floating above patient) */}
      {/* Bean shape */}
      <path
        d="M60 75 Q52 67 60 59 Q68 51 76 59 Q84 67 76 75 Q68 83 60 75 Z"
        fill={JELLY_BEAN}
        stroke={STROKE}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      {/* Bean highlight */}
      <path
        d="M64 71 Q62 67 64 63"
        fill="none"
        stroke={STROKE}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.6}
      />

      {/* Second jelly bean */}
      <path
        d="M88 60 Q80 52 88 44 Q96 36 104 44 Q112 52 104 60 Q96 68 88 60 Z"
        fill={JELLY_BEAN}
        stroke={STROKE}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path
        d="M92 56 Q90 52 92 48"
        fill="none"
        stroke={STROKE}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.6}
      />

      {/* Third jelly bean */}
      <path
        d="M74 40 Q66 32 74 24 Q82 16 90 24 Q98 32 90 40 Q82 48 74 40 Z"
        fill={JELLY_BEAN}
        stroke={STROKE}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path
        d="M78 36 Q76 32 78 28"
        fill="none"
        stroke={STROKE}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.6}
      />

      {/* Orange juice carton — right side */}
      {/* Carton body */}
      <path
        d="M290 130 L290 190 Q290 200 300 200 L340 200 Q350 200 350 190 L350 130 Q350 120 340 120 L300 120 Q290 120 290 130 Z"
        fill={JUICE}
        stroke={STROKE}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      {/* Carton top fold */}
      <path
        d="M290 130 L300 120 L320 110 L340 120 L350 130"
        fill={JUICE}
        stroke={STROKE}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      {/* Carton peak */}
      <path
        d="M320 110 L320 95 Q320 90 325 90 Q330 90 330 95 L330 105"
        fill={JUICE}
        stroke={STROKE}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      {/* Carton side seam lines */}
      <line x1={310} y1={120} x2={310} y2={200} stroke={STROKE} strokeWidth={2} opacity={1} />
      <line x1={330} y1={120} x2={330} y2={200} stroke={STROKE} strokeWidth={2} opacity={1} />
      {/* Carton top crease lines */}
      <line x1={310} y1={120} x2={320} y2={110} stroke={STROKE} strokeWidth={2} />
      <line x1={330} y1={120} x2={320} y2={110} stroke={STROKE} strokeWidth={2} />

      {/* Red 'UNLOCK' indicator ring around jelly beans */}
      <circle
        cx={78}
        cy={60}
        r={44}
        fill="none"
        stroke={RED}
        strokeWidth={4}
        strokeDasharray="8 4"
        opacity={0.95}
      />
      {/* Small red unlock padlock icon (simplified) */}
      <rect
        x={66}
        y={48}
        width={24}
        height={20}
        rx={4}
        fill="none"
        stroke={RED}
        strokeWidth={3}
      />
      <path
        d="M72 48 L72 42 Q72 36 78 36 Q84 36 84 42 L84 48"
        fill="none"
        stroke={RED}
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* Red 'UNLOCK' indicator ring around juice carton */}
      <circle
        cx={320}
        cy={160}
        r={48}
        fill="none"
        stroke={RED}
        strokeWidth={4}
        strokeDasharray="8 4"
        opacity={0.95}
      />
      {/* Small red unlock padlock icon (simplified) */}
      <rect
        x={308}
        y={148}
        width={24}
        height={20}
        rx={4}
        fill="none"
        stroke={RED}
        strokeWidth={3}
      />
      <path
        d="M314 148 L314 142 Q314 136 320 136 Q326 136 326 142 L326 148"
        fill="none"
        stroke={RED}
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* Prominent red pointer arrow from jelly beans toward patient */}
      <path
        d="M118 75 L170 90"
        fill="none"
        stroke={RED}
        strokeWidth={5}
        strokeLinecap="round"
      />
      {/* Arrowhead */}
      <path
        d="M162 82 L174 92 L164 98 Z"
        fill={RED}
        stroke={RED}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Prominent red pointer arrow from juice carton toward patient */}
      <path
        d="M274 160 L230 140"
        fill="none"
        stroke={RED}
        strokeWidth={5}
        strokeLinecap="round"
      />
      {/* Arrowhead */}
      <path
        d="M238 132 L226 142 L236 148 Z"
        fill={RED}
        stroke={RED}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Red action target dot on patient torso */}
      <circle
        cx={210}
        cy={115}
        r={6}
        fill={RED}
        stroke={STROKE}
        strokeWidth={2}
      />
      {/* Red pulse ring around target */}
      <circle
        cx={210}
        cy={115}
        r={14}
        fill="none"
        stroke={RED}
        strokeWidth={3}
        strokeDasharray="4 3"
        opacity={0.8}
      />

      {/* Small red spark / emphasis lines near the target */}
      <line x1={198} y1={105} x2={190} y2={97} stroke={RED} strokeWidth={2} strokeLinecap="round" />
      <line x1={222} y1={105} x2={230} y2={97} stroke={RED} strokeWidth={2} strokeLinecap="round" />
      <line x1={198} y1={125} x2={190} y2={133} stroke={RED} strokeWidth={2} strokeLinecap="round" />
      <line x1={222} y1={125} x2={230} y2={133} stroke={RED} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}
