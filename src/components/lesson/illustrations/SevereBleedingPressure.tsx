interface SevereBleedingPressureProps {
  className?: string;
  title?: string;
}

/**
 * SevereBleedingPressure — a gloved hand pressing a dressing pad
 * onto a lacerated limb with red downward force lines.
 */
export default function SevereBleedingPressure({
  className,
  title = "Apply firm direct pressure to control severe bleeding",
}: SevereBleedingPressureProps) {
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

      {/* Limb — horizontal forearm silhouette */}
      <path
        d="M40 165 Q40 135 80 135 L320 135 Q360 135 360 165 L360 195 Q360 225 320 225 L80 225 Q40 225 40 195 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Laceration wound */}
      <path
        d="M160 170 L175 155 L185 170 L195 160 L200 175 L185 190 L170 185 Z"
        fill={RED}
        stroke={STROKE}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Wound detail — small bleed drops */}
      <circle cx={170} cy={200} r={4} fill={RED} opacity={1} />
      <circle cx={185} cy={205} r={3} fill={RED} opacity={0.7} />
      <circle cx={155} cy={195} r={2.5} fill={RED} opacity={0.5} />

      {/* Dressing pad — silver rectangle over wound */}
      <rect
        x={140}
        y={150}
        width={80}
        height={55}
        rx={6}
        fill="#FFFFFF"
        stroke={STROKE}
        strokeWidth={3}
      />
      {/* Pad texture */}
      <line x1={150} y1={165} x2={210} y2={165} stroke={SILVER} strokeWidth={2} />
      <line x1={150} y1={180} x2={210} y2={180} stroke={SILVER} strokeWidth={2} />
      <line x1={150} y1={195} x2={210} y2={195} stroke={SILVER} strokeWidth={2} />

      {/* Gloved hand — slate-grey shape pressing down on pad */}
      {/* Thumb */}
      <ellipse
        cx={250}
        cy={155}
        rx={28}
        ry={16}
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={3}
      />
      {/* Fingers over pad */}
      <ellipse
        cx={180}
        cy={145}
        rx={38}
        ry={22}
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={3}
      />
      <ellipse
        cx={180}
        cy={148}
        rx={38}
        ry={22}
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={3}
      />

      {/* Glove cuff detail */}
      <rect
        x={240}
        y={120}
        width={60}
        height={14}
        rx={4}
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={3}
      />

      {/* Downward red force lines — pushing onto the pad */}
      {/* Main center arrow */}
      <line x1={180} y1={110} x2={180} y2={145} stroke={RED} strokeWidth={5} strokeLinecap="round" />
      <polygon points="180,145 170,132 190,132" fill={RED} stroke={STROKE} strokeWidth={2} strokeLinejoin="round" />

      {/* Left force line */}
      <line x1={155} y1={115} x2={155} y2={145} stroke={RED} strokeWidth={4} strokeLinecap="round" />
      <polygon points="155,145 147,135 163,135" fill={RED} stroke={STROKE} strokeWidth={2} strokeLinejoin="round" />

      {/* Right force line */}
      <line x1={205} y1={115} x2={205} y2={145} stroke={RED} strokeWidth={4} strokeLinecap="round" />
      <polygon points="205,145 197,135 213,135" fill={RED} stroke={STROKE} strokeWidth={2} strokeLinejoin="round" />

      {/* Extra force emphasis dashes */}
      <line x1={170} y1={108} x2={170} y2={118} stroke={RED} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
      <line x1={190} y1={108} x2={190} y2={118} stroke={RED} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
    </svg>
  );
}
