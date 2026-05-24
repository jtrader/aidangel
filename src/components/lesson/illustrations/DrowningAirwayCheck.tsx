interface DrowningAirwayCheckProps {
  className?: string;
  title?: string;
}

/**
 * DrowningAirwayCheck — patient lying flat post-rescue with a first aider
 * performing head-tilt chin-lift to open the airway. Red arrows show
 * the clear airway path and breathing-check indicators on the chest.
 */
export default function DrowningAirwayCheck({
  className,
  title = "Drowning rescue airway check: head tilt and chin lift",
}: DrowningAirwayCheckProps) {
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
      <line x1={20} y1={235} x2={380} y2={235} stroke={STROKE} strokeWidth={3} />

      {/* Patient body — lying flat on back */}
      <path
        d="M60 235 Q60 180 110 180 L270 180 Q320 180 320 205 L320 235 Z"
        fill={SLATE}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* Patient chest */}
      <ellipse cx={195} cy={172} rx={55} ry={15} fill={SILVER} stroke={STROKE} strokeWidth={3} />

      {/* Patient head — flat on back, tilted slightly back */}
      <ellipse cx={340} cy={188} rx={28} ry={24} fill={SILVER} stroke={STROKE} strokeWidth={4} />
      {/* Face features */}
      <line x1={350} y1={182} x2={358} y2={182} stroke={STROKE} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M360 188 L368 191 L360 194" fill="none" stroke={STROKE} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Open mouth */}
      <ellipse cx={354} cy={196} rx={5} ry={3} fill={RED} stroke={STROKE} strokeWidth={2} />

      {/* First aider — kneeling at patient's head */}
      {/* Torso leaning over */}
      <path
        d="M90 235 Q100 150 150 130 L210 130 Q240 130 245 160 L238 235 Z"
        fill={SILVER}
        stroke={STROKE}
        strokeWidth={4}
        strokeLinejoin="round"
      />

      {/* First aider head */}
      <ellipse cx={255} cy={115} rx={24} ry={22} fill={SILVER} stroke={STROKE} strokeWidth={4} />

      {/* Arms reaching to perform head tilt and chin lift */}
      {/* Left hand on forehead (tilting back) */}
      <path
        d="M220 140 Q260 125 310 150"
        fill="none"
        stroke={STROKE}
        strokeWidth={8}
        strokeLinecap="round"
      />
      <path
        d="M220 140 Q260 125 310 150"
        fill="none"
        stroke={SILVER}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <ellipse cx={315} cy={152} rx={11} ry={7} fill={SILVER} stroke={STROKE} strokeWidth={3} />

      {/* Right hand under chin (lifting) */}
      <path
        d="M230 155 Q270 165 325 185"
        fill="none"
        stroke={STROKE}
        strokeWidth={8}
        strokeLinecap="round"
      />
      <path
        d="M230 155 Q270 165 325 185"
        fill="none"
        stroke={SILVER}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <ellipse cx={330} cy={187} rx={11} ry={7} fill={SILVER} stroke={STROKE} strokeWidth={3} />

      {/* Red boundary indicator circle around head/airway zone */}
      <ellipse
        cx={335}
        cy={178}
        rx={52}
        ry={42}
        fill="none"
        stroke={RED}
        strokeWidth={3}
        strokeDasharray="6 4"
      />

      {/* Curved red arrows showing clear airway path from mouth upward */}
      <g>
        <path
          d="M 340 160 Q 320 140 300 145"
          fill="none"
          stroke={RED}
          strokeWidth={4}
          strokeLinecap="round"
          markerEnd="url(#airwayArrow)"
        />
        <defs>
          <marker id="airwayArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill={RED} />
          </marker>
        </defs>
      </g>

      {/* Second curved arrow — wider arc showing open airway */}
      <path
        d="M 345 150 Q 310 115 275 125"
        fill="none"
        stroke={RED}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="4 3"
      />
      <polygon
        points="275,125 283,118 283,132"
        fill={RED}
        stroke={STROKE}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {/* Red 'Breathing Check' indicator arrows on the chest wall */}
      <g>
        {/* Left chest arrow — rising */}
        <path
          d="M 160 165 Q 170 145 180 155"
          fill="none"
          stroke={RED}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <polygon
          points="180,155 172,148 172,162"
          fill={RED}
          stroke={STROKE}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />

        {/* Right chest arrow — rising */}
        <path
          d="M 210 160 Q 220 140 230 150"
          fill="none"
          stroke={RED}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <polygon
          points="230,150 222,143 222,157"
          fill={RED}
          stroke={STROKE}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </g>

      {/* Small red pulse dots on chest for breathing check emphasis */}
      <circle cx={170} cy={168} r={4} fill={RED} stroke={STROKE} strokeWidth={1.5} />
      <circle cx={220} cy={162} r={4} fill={RED} stroke={STROKE} strokeWidth={1.5} />

      {/* Water droplets near the body to hint at drowning context */}
      <g>
        <ellipse cx={50} cy={210} rx={5} ry={7} fill="#93C5FD" stroke={STROKE} strokeWidth={2} opacity={0.6} />
        <ellipse cx={40} cy={195} rx={4} ry={6} fill="#93C5FD" stroke={STROKE} strokeWidth={2} opacity={0.5} />
        <ellipse cx={58} cy={185} rx={3} ry={5} fill="#93C5FD" stroke={STROKE} strokeWidth={2} opacity={0.4} />
      </g>
    </svg>
  );
}
