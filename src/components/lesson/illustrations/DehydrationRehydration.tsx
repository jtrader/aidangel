interface DehydrationRehydrationProps {
  className?: string;
  title?: string;
}

/**
 * DehydrationRehydration — a seated human torso with recurring grey
 * droplet shapes representing consistent small sips of water.
 * Emergency Red arrows point from a water vessel toward the mouth
 * and throat, with red indicator rings marking the safe intake pattern.
 *
 * NOTE: No baked-in text glyphs. All human-readable copy is exposed via
 * the `title` prop for the platform's translation engine.
 */
export default function DehydrationRehydration({
  className,
  title = "Rehydrate with small, frequent sips of water",
}: DehydrationRehydrationProps) {
  const STROKE = "#333333";
  const SILVER = "#E5E7EB";
  const SLATE = "#475569";
  const RED = "#F20822";

  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 1 400 260"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <title>{title}</title>

      {/* Ground / surface plane */}
      <rect x={20} y={240} width={360} height={8} rx={3} fill={SLATE} stroke={STROKE} strokeWidth={3} />

      {/* Torso — seated / semi-upright posture */}
      <path
        d="M140 235 L260 235 Q268 235 268 227 L268 170 Q268 150 252 140 L200 125 Q184 120 168 128 L148 145 Q140 155 140 170 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Head */}
      <ellipse
        cx={130}
        cy={95}
        rx={38}
        ry={32}
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
      />

      {/* Neck */}
      <rect
        x={152}
        y={118}
        width={20}
        height={28}
        rx={6}
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={3}
      />

      {/* Left arm */}
      <path
        d="M168 148 L130 185 Q124 191 130 197 L140 207 Q146 213 152 207 L188 168 Q194 162 188 156 L178 146 Q172 140 168 148 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Right arm */}
      <path
        d="M240 148 L278 185 Q284 191 278 197 L268 207 Q262 213 256 207 L220 168 Q214 162 220 156 L230 146 Q236 140 240 148 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Water vessel / bottle — left side */}
      <rect
        x={42}
        y={140}
        width={32}
        height={60}
        rx={8}
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={3}
      />
      {/* Bottle neck */}
      <rect
        x={50}
        y={128}
        width={16}
        height={14}
        rx={3}
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={3}
      />
      {/* Bottle cap */}
      <rect
        x={48}
        y={120}
        width={20}
        height={10}
        rx={3}
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={3}
      />
      {/* Water level line inside bottle */}
      <line x1={46} y1={168} x2={70} y2={168} stroke={STROKE} strokeWidth={2} strokeLinecap="round" />

      {/* Droplet shapes — recurring grey sips */}
      {/* Droplet 1 — near bottle */}
      <path
        d="M88 158 Q84 166 88 172 Q92 178 96 172 Q100 166 96 158 Q92 150 88 158 Z"
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={2}
      />
      {/* Droplet 2 — mid air */}
      <path
        d="M108 148 Q104 156 108 162 Q112 168 116 162 Q120 156 116 148 Q112 140 108 148 Z"
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={2}
      />
      {/* Droplet 3 — near mouth */}
      <path
        d="M126 138 Q122 146 126 152 Q130 158 134 152 Q138 146 134 138 Q130 130 126 138 Z"
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={2}
      />

      {/* Red action arrow — from bottle toward mouth */}
      <path
        d="M80 148 L122 132"
        fill="none"
        stroke={RED}
        strokeWidth={4}
        strokeLinecap="round"
      />
      {/* Arrowhead */}
      <path
        d="M118 128 L126 130 L122 138 Z"
        fill={RED}
        stroke={RED}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Red action arrow — from bottle toward throat */}
      <path
        d="M80 168 L152 148"
        fill="none"
        stroke={RED}
        strokeWidth={4}
        strokeLinecap="round"
      />
      {/* Arrowhead */}
      <path
        d="M148 144 L156 150 L148 154 Z"
        fill={RED}
        stroke={RED}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Red indicator ring — mouth intake zone */}
      <circle
        cx={142}
        cy={118}
        r={18}
        fill="none"
        stroke={RED}
        strokeWidth={3}
        strokeDasharray="6 4"
        opacity={0.9}
      />
      <circle cx={142} cy={118} r={3} fill={RED} />

      {/* Red indicator ring — throat intake zone */}
      <circle
        cx={162}
        cy={138}
        r={18}
        fill="none"
        stroke={RED}
        strokeWidth={3}
        strokeDasharray="6 4"
        opacity={0.9}
      />
      <circle cx={162} cy={138} r={3} fill={RED} />

      {/* Small red radiating accent lines from mouth zone */}
      <line x1={130} y1={108} x2={122} y2={100} stroke={RED} strokeWidth={2} strokeLinecap="round" />
      <line x1={150} y1={108} x2={158} y2={100} stroke={RED} strokeWidth={2} strokeLinecap="round" />

      {/* Small red radiating accent lines from throat zone */}
      <line x1={148} y1={128} x2={140} y2={120} stroke={RED} strokeWidth={2} strokeLinecap="round" />
      <line x1={176} y1={128} x2={184} y2={120} stroke={RED} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}
