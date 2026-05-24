interface HeadInjuryCradleProps {
  className?: string;
  title?: string;
}

/**
 * HeadInjuryCradle — a patient lying flat with a first aider's hands
 * cradling the base of the skull, and red structural brackets on either
 * side of the head and neck illustrating absolute immobility.
 *
 * NOTE: No baked-in text glyphs. All human-readable copy is exposed via
 * the `title` prop for the platform's translation engine.
 */
export default function HeadInjuryCradle({
  className,
  title = "Cradle the head and neck to maintain alignment and prevent movement",
}: HeadInjuryCradleProps) {
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

      {/* Ground plane */}
      <rect x={20} y={228} width={360} height={12} rx={3} fill={SLATE} stroke={STROKE} strokeWidth={3} />
      <line x1={20} y1={228} x2={380} y2={228} stroke={STROKE} strokeWidth={3} />

      {/* Subtle alignment axis — dashed red line showing strict horizontal level */}
      <line
        x1={35}
        y1={214}
        x2={340}
        y2={214}
        stroke={RED}
        strokeWidth={2}
        strokeDasharray="6 4"
        opacity={0.35}
        strokeLinecap="round"
      />

      {/* Patient body — horizontal rounded torso */}
      <path
        d="M152 196 L338 196 Q346 196 346 204 L346 222 Q346 230 338 230 L152 230 Q144 230 144 222 L144 204 Q144 196 152 196 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Head — oval resting on the ground plane */}
      <ellipse
        cx={88}
        cy={182}
        rx={44}
        ry={34}
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
      />

      {/* Neck — connecting head to body */}
      <rect
        x={130}
        y={186}
        width={24}
        height={42}
        rx={8}
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
      />

      {/* Left hand — slate-grey gloved hand cradling the left side of the skull base */}
      <path
        d="M30 200 Q38 176 46 200 Q54 176 62 200 Q70 176 78 200 L78 236 Q78 244 70 244 L40 244 Q30 244 30 236 Z"
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={3}
        strokeLinejoin="round"
      />

      {/* Right hand — slate-grey gloved hand cradling the right side of the neck */}
      <path
        d="M150 200 Q158 176 166 200 Q174 176 182 200 Q190 176 198 200 L198 236 Q198 244 190 244 L160 244 Q150 244 150 236 Z"
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={3}
        strokeLinejoin="round"
      />

      {/* Left structural bracket — emergency red immobility boundary */}
      <path
        d="M22 148 L8 148 L8 228 L22 228"
        fill="none"
        stroke={RED}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right structural bracket — emergency red immobility boundary */}
      <path
        d="M206 148 L220 148 L220 228 L206 228"
        fill="none"
        stroke={RED}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
