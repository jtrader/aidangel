interface SnakeBiteBandageProps {
  className?: string;
  title?: string;
}

/**
 * Snake Bite Pressure Immobilisation Bandage illustration.
 *
 * Flat 2D geometric style matching /assets/expose-dry-chest.svg:
 *  - Thick charcoal grey outline (#333333)
 *  - Light silver-grey + deep slate grey fills
 *  - Emergency Red (#F20822) accent for the tension/target indicator box
 *
 * Scales fluidly inside any responsive Tailwind wrapper via viewBox + 100% sizing.
 */
export default function SnakeBiteBandage({
  className,
  title = "Snake bite pressure immobilisation bandage with correct tension indicator",
}: SnakeBiteBandageProps) {
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

      {/* Leg / limb base shape (silhouette) */}
      <path
        d="M60 60 Q70 40 110 42 L300 50 Q360 54 360 90 Q360 110 320 116 L130 150 Q70 158 60 130 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Foot / ankle hint on the right */}
      <path
        d="M340 78 Q380 80 380 100 Q380 118 350 118 L320 116 Z"
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Bandage wraps — overlapping slate bands up the limb */}
      {[
        { x: 95, skew: -8 },
        { x: 135, skew: -6 },
        { x: 175, skew: -4 },
        { x: 215, skew: -2 },
        { x: 255, skew: 0 },
        { x: 295, skew: 2 },
      ].map((b, i) => (
        <g key={i}>
          <path
            d={`M${b.x} 44
                L${b.x + 32} 46
                L${b.x + 28 + b.skew} 138
                L${b.x - 4 + b.skew} 136 Z`}
            fill={i % 2 === 0 ? SILVER : "#F3F4F6"}
            stroke={STROKE}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          {/* subtle weave line */}
          <line
            x1={b.x + 14}
            y1={50}
            x2={b.x + 12 + b.skew}
            y2={130}
            stroke={STROKE}
            strokeWidth={1.25}
            strokeDasharray="2 4"
            opacity={0.55}
          />
        </g>
      ))}

      {/* Bite-site marker (small X) drawn through the bandage near the lower end */}
      <g stroke={RED} strokeWidth={3.5} strokeLinecap="round">
        <line x1={108} y1={92} x2={120} y2={104} />
        <line x1={120} y1={92} x2={108} y2={104} />
      </g>

      {/* Red tension indicator box — calls out correct wrapping zone */}
      <g>
        <rect
          x={150}
          y={30}
          width={150}
          height={130}
          rx={6}
          fill="none"
          stroke={RED}
          strokeWidth={4}
          strokeDasharray="8 6"
        />
        {/* Label tab */}
        <rect
          x={150}
          y={6}
          width={150}
          height={22}
          rx={4}
          fill={RED}
          stroke={STROKE}
          strokeWidth={2}
        />
        <text
          x={225}
          y={22}
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize={12}
          fontWeight={700}
          fill="#FFFFFF"
          letterSpacing={1}
        >
          CORRECT TENSION
        </text>
      </g>

      {/* Direction-of-wrap arrow along the limb */}
      <g>
        <line
          x1={90}
          y1={200}
          x2={330}
          y2={200}
          stroke={RED}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <polygon
          points="330,200 318,193 318,207"
          fill={RED}
          stroke={STROKE}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <text
          x={210}
          y={224}
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize={12}
          fontWeight={700}
          fill={STROKE}
          letterSpacing={1}
        >
          WRAP UP THE ENTIRE LIMB
        </text>
      </g>

      {/* Small bite-site caption */}
      <text
        x={114}
        y={84}
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={10}
        fontWeight={700}
        fill={RED}
      >
        BITE
      </text>
    </svg>
  );
}
