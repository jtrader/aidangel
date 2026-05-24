interface HeatCoolingActiveProps {
  className?: string;
  title?: string;
}

/**
 * HeatCoolingActive — a resting patient in semi-recumbent posture with
 * slate-grey cold-pack rectangles under the armpits and around the neck.
 * Emergency red indicator rings highlight high-vascular cooling zones
 * for aggressive heatstroke core temperature reduction.
 *
 * NOTE: No baked-in text glyphs. All human-readable copy is exposed via
 * the `title` prop for the platform's translation engine.
 */
export default function HeatCoolingActive({
  className,
  title = "Apply cold packs to neck, armpits and groin to reduce core temperature",
}: HeatCoolingActiveProps) {
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

      {/* Ground / surface plane */}
      <rect x={20} y={240} width={360} height={8} rx={3} fill={SLATE} stroke={STROKE} strokeWidth={3} />

      {/* Patient body — semi-recumbent angled torso */}
      <path
        d="M120 235 L320 235 Q328 235 328 227 L328 175 Q328 155 312 145 L240 125 Q224 120 208 128 L140 155 Q120 165 120 185 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Head — resting on an elevated surface tilt */}
      <ellipse
        cx={105}
        cy={108}
        rx={38}
        ry={30}
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
      />

      {/* Neck groove */}
      <rect
        x={136}
        y={118}
        width={22}
        height={36}
        rx={7}
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={3}
      />

      {/* Left arm — angled out for armpit access */}
      <path
        d="M220 148 L290 168 Q298 171 298 179 L298 195 Q298 203 290 200 L220 180 Q212 177 212 169 L212 153 Q212 145 220 148 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Right arm — angled out for armpit access */}
      <path
        d="M320 145 L375 160 Q382 163 382 171 L382 187 Q382 195 375 192 L320 177 Q312 174 312 166 L312 150 Q312 142 320 145 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Cold pack — neck groove (slate-grey rectangle) */}
      <rect
        x={130}
        y={110}
        width={34}
        height={22}
        rx={5}
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={3}
      />
      {/* Ice-crystal texture on neck pack */}
      <line x1={136} y1={116} x2={144} y2={124} stroke={SILVER} strokeWidth={2} strokeLinecap="round" />
      <line x1={146} y1={114} x2={152} y2={122} stroke={SILVER} strokeWidth={2} strokeLinecap="round" />

      {/* Cold pack — left armpit (slate-grey rectangle) */}
      <rect
        x={198}
        y={152}
        width={36}
        height={22}
        rx={5}
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={3}
      />
      {/* Ice-crystal texture on left pack */}
      <line x1={204} y1={158} x2={212} y2={166} stroke={SILVER} strokeWidth={2} strokeLinecap="round" />
      <line x1={214} y1={156} x2={220} y2={164} stroke={SILVER} strokeWidth={2} strokeLinecap="round" />

      {/* Cold pack — right armpit (slate-grey rectangle) */}
      <rect
        x={302}
        y={148}
        width={36}
        height={22}
        rx={5}
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={3}
      />
      {/* Ice-crystal texture on right pack */}
      <line x1={308} y1={154} x2={316} y2={162} stroke={SILVER} strokeWidth={2} strokeLinecap="round" />
      <line x1={318} y1={152} x2={324} y2={160} stroke={SILVER} strokeWidth={2} strokeLinecap="round" />

      {/* Red indicator ring — neck cooling zone (high vascular) */}
      <circle
        cx={147}
        cy={121}
        r={28}
        fill="none"
        stroke={RED}
        strokeWidth={4}
        strokeDasharray="8 5"
        opacity={0.9}
      />
      <circle cx={147} cy={121} r={4} fill={RED} />

      {/* Red indicator ring — left armpit cooling zone */}
      <circle
        cx={216}
        cy={163}
        r={24}
        fill="none"
        stroke={RED}
        strokeWidth={4}
        strokeDasharray="8 5"
        opacity={0.9}
      />
      <circle cx={216} cy={163} r={4} fill={RED} />

      {/* Red indicator ring — right armpit cooling zone */}
      <circle
        cx={320}
        cy={159}
        r={24}
        fill="none"
        stroke={RED}
        strokeWidth={4}
        strokeDasharray="8 5"
        opacity={0.9}
      />
      <circle cx={320} cy={159} r={4} fill={RED} />

      {/* Radiating cooling lines from neck zone */}
      <line x1={115} y1={108} x2={95} y2={92} stroke={RED} strokeWidth={2} strokeLinecap="round" opacity={1.0} />
      <line x1={115} y1={108} x2={105} y2={82} stroke={RED} strokeWidth={2} strokeLinecap="round" opacity={1.0} />
      <line x1={179} y1={108} x2={199} y2={92} stroke={RED} strokeWidth={2} strokeLinecap="round" opacity={1.0} />
      <line x1={179} y1={108} x2={189} y2={82} stroke={RED} strokeWidth={2} strokeLinecap="round" opacity={1.0} />

      {/* Radiating cooling lines from left armpit zone */}
      <line x1={190} y1={152} x2={170} y2={136} stroke={RED} strokeWidth={2} strokeLinecap="round" opacity={1.0} />
      <line x1={190} y1={174} x2={170} y2={190} stroke={RED} strokeWidth={2} strokeLinecap="round" opacity={1.0} />

      {/* Radiating cooling lines from right armpit zone */}
      <line x1={346} y1={148} x2={366} y2={132} stroke={RED} strokeWidth={2} strokeLinecap="round" opacity={1.0} />
      <line x1={346} y1={170} x2={366} y2={186} stroke={RED} strokeWidth={2} strokeLinecap="round" opacity={1.0} />
    </svg>
  );
}
