// Original instructional illustrations for First Aid Angel knowledge base topics.
// All artwork is hand-drawn vector linework in our amber/gold house style — no
// third-party imagery. Stroke colours use `currentColor` so they inherit the
// surrounding `text-primary` token and stay theme-correct in both modes.

import { memo } from "react";

type Props = { slug: string; className?: string };

const FRAME = "0 0 400 240";

// Shared building blocks ---------------------------------------------------

const StrokeStyle = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ThinStroke = { ...StrokeStyle, strokeWidth: 1.6 };
const FillSoft = { fill: "currentColor", opacity: 0.08 };
const FillSofter = { fill: "currentColor", opacity: 0.14 };

// Per-topic diagrams -------------------------------------------------------

function Cpr() {
  return (
    <g>
      {/* Torso outline */}
      <path
        d="M70 175 Q70 95 140 80 Q200 70 260 80 Q330 95 330 175"
        {...StrokeStyle}
      />
      {/* Neck + head suggestion */}
      <path d="M170 80 L170 60 Q200 45 230 60 L230 80" {...ThinStroke} />
      {/* Ribcage hint */}
      <path d="M120 130 Q200 110 280 130" {...ThinStroke} opacity={0.5} />
      {/* Hand outline (heel of hand stacked) */}
      <ellipse cx="200" cy="140" rx="34" ry="18" {...FillSofter} />
      <ellipse cx="200" cy="140" rx="34" ry="18" {...StrokeStyle} />
      <ellipse cx="200" cy="128" rx="30" ry="14" {...StrokeStyle} />
      {/* Compression arrows */}
      <path d="M200 70 L200 105" {...StrokeStyle} />
      <path d="M192 97 L200 108 L208 97" {...StrokeStyle} />
      {/* Rate label */}
      <text x="200" y="220" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">
        100–120 / min · 5 cm deep
      </text>
    </g>
  );
}

function Choking() {
  return (
    <g>
      {/* Casualty leaning forward */}
      <circle cx="155" cy="70" r="22" {...StrokeStyle} />
      <path
        d="M155 92 Q145 130 175 150 Q220 175 250 195"
        {...StrokeStyle}
      />
      {/* Casualty arm dangling */}
      <path d="M170 130 Q200 150 215 175" {...ThinStroke} />
      {/* Helper hand giving back blow */}
      <path d="M110 110 Q90 130 110 150 L150 138" {...StrokeStyle} />
      <path d="M150 138 L165 134 L162 145 Z" {...FillSofter} />
      {/* Impact arrow toward shoulder blades */}
      <path d="M130 115 L170 130" {...StrokeStyle} />
      <path d="M162 124 L172 132 L161 134" {...StrokeStyle} />
      {/* Label */}
      <text x="200" y="220" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">
        5 back blows · between shoulder blades
      </text>
    </g>
  );
}

function RecoveryPosition() {
  return (
    <g>
      {/* Ground */}
      <line x1="30" y1="180" x2="370" y2="180" {...ThinStroke} opacity={0.4} />
      {/* Body side-on */}
      <circle cx="100" cy="140" r="22" {...StrokeStyle} />
      {/* Head tilted back to open airway */}
      <path d="M118 132 L132 124" {...ThinStroke} />
      {/* Torso */}
      <path d="M122 150 Q200 140 260 160" {...StrokeStyle} />
      <path d="M122 165 Q200 168 250 178" {...StrokeStyle} />
      {/* Lower arm under cheek */}
      <path d="M105 122 Q80 100 70 115" {...StrokeStyle} />
      {/* Top arm bent forward */}
      <path d="M150 152 Q170 130 200 148" {...StrokeStyle} />
      {/* Top leg bent (knee forward) */}
      <path d="M250 168 L300 130 L340 165" {...StrokeStyle} />
      {/* Bottom leg straight */}
      <path d="M250 178 L340 178" {...StrokeStyle} />
      {/* Airway arrow */}
      <path d="M140 110 Q120 95 105 105" {...ThinStroke} />
      <path d="M110 100 L102 106 L108 112" {...ThinStroke} />
      <text x="200" y="220" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">
        Head tilted · top knee forward · airway clear
      </text>
    </g>
  );
}

function Bleeding() {
  return (
    <g>
      {/* Forearm */}
      <path d="M70 160 Q200 110 320 95" {...StrokeStyle} />
      <path d="M85 185 Q210 145 325 125" {...StrokeStyle} />
      {/* Hand */}
      <path d="M320 95 Q345 92 350 110 Q345 130 325 125" {...StrokeStyle} />
      {/* Wound area */}
      <ellipse cx="210" cy="135" rx="22" ry="10" {...FillSoft} />
      {/* Dressing pad */}
      <rect x="180" y="105" width="60" height="30" rx="4" {...FillSofter} />
      <rect x="180" y="105" width="60" height="30" rx="4" {...StrokeStyle} />
      {/* Pressing hand (fingers) */}
      <path d="M185 95 L195 70" {...StrokeStyle} />
      <path d="M200 95 L210 65" {...StrokeStyle} />
      <path d="M215 95 L225 65" {...StrokeStyle} />
      <path d="M230 95 L240 70" {...StrokeStyle} />
      <path d="M170 95 Q180 80 200 78 Q230 75 245 90" {...StrokeStyle} />
      {/* Elevate arrow */}
      <path d="M80 200 L80 165" {...StrokeStyle} />
      <path d="M72 173 L80 162 L88 173" {...StrokeStyle} />
      <text x="200" y="220" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">
        Firm pressure · 10 min · elevate the limb
      </text>
    </g>
  );
}

function SnakeBite() {
  return (
    <g>
      {/* Leg outline */}
      <path d="M155 30 Q140 130 130 210" {...StrokeStyle} />
      <path d="M215 30 Q230 130 245 210" {...StrokeStyle} />
      {/* Foot */}
      <path d="M130 210 Q175 222 245 210" {...StrokeStyle} />
      {/* Bandage spiral wrapping the full limb */}
      {Array.from({ length: 14 }).map((_, i) => {
        const y = 40 + i * 12;
        const inset = 4 + Math.sin(i * 0.4) * 2;
        return (
          <path
            key={i}
            d={`M${152 + inset} ${y} Q185 ${y + 6} ${218 - inset} ${y}`}
            {...ThinStroke}
          />
        );
      })}
      {/* Bite mark dot */}
      <circle cx="185" cy="110" r="3.2" fill="currentColor" />
      <circle cx="185" cy="110" r="9" {...ThinStroke} />
      {/* Splint */}
      <rect x="265" y="30" width="14" height="190" rx="4" {...FillSofter} />
      <rect x="265" y="30" width="14" height="190" rx="4" {...StrokeStyle} />
      <text x="200" y="232" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
        Bandage entire limb · splint · keep still
      </text>
    </g>
  );
}

function Anaphylaxis() {
  return (
    <g>
      {/* Thigh (vertical cylinder) */}
      <path d="M120 30 Q105 130 115 215" {...StrokeStyle} />
      <path d="M210 30 Q225 130 215 215" {...StrokeStyle} />
      <line x1="120" y1="30" x2="210" y2="30" {...StrokeStyle} />
      {/* Outer thigh target ring */}
      <circle cx="200" cy="120" r="22" {...ThinStroke} opacity={0.6} />
      <circle cx="200" cy="120" r="10" {...FillSofter} />
      {/* Auto-injector body */}
      <rect x="240" y="100" width="120" height="36" rx="8" {...FillSofter} />
      <rect x="240" y="100" width="120" height="36" rx="8" {...StrokeStyle} />
      {/* Orange tip */}
      <rect x="222" y="108" width="18" height="20" rx="3" {...StrokeStyle} />
      {/* Blue safety cap removed (shown floating) */}
      <rect x="345" y="60" width="22" height="22" rx="3" {...ThinStroke} opacity={0.5} />
      <path d="M345 60 L340 50 M367 60 L372 50" {...ThinStroke} opacity={0.5} />
      {/* Strike arrow into thigh */}
      <path d="M240 118 L210 118" {...StrokeStyle} />
      <path d="M220 110 L208 118 L220 126" {...StrokeStyle} />
      <text x="200" y="220" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">
        Outer thigh · hold 3 seconds · call 000
      </text>
    </g>
  );
}

function Stroke() {
  // FAST: four panels, each with a tiny pictogram + bold letter.
  const panels = [
    { x: 30, letter: "F", label: "Face drooping" },
    { x: 120, letter: "A", label: "Arm weakness" },
    { x: 210, letter: "S", label: "Speech slurred" },
    { x: 300, letter: "T", label: "Time — call 000" },
  ];
  return (
    <g>
      {panels.map((p) => (
        <g key={p.letter} transform={`translate(${p.x} 20)`}>
          <rect x="0" y="0" width="70" height="90" rx="10" {...FillSoft} />
          <rect x="0" y="0" width="70" height="90" rx="10" {...ThinStroke} />
          <text
            x="35"
            y="58"
            textAnchor="middle"
            fontSize="44"
            fontWeight="800"
            fill="currentColor"
          >
            {p.letter}
          </text>
          <text
            x="35"
            y="108"
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fill="currentColor"
          >
            {p.label}
          </text>
        </g>
      ))}
      {/* Pictogram row: drooping face, raised arm, speech bubble, clock */}
      <g transform="translate(50 145)" {...ThinStroke}>
        <circle cx="15" cy="15" r="14" />
        <path d="M9 22 Q15 30 21 18" />
        <circle cx="11" cy="12" r="1.5" fill="currentColor" />
        <circle cx="20" cy="12" r="1.5" fill="currentColor" />
      </g>
      <g transform="translate(140 145)" {...ThinStroke}>
        <circle cx="15" cy="8" r="6" />
        <path d="M15 14 L15 32 M15 18 L4 20 M15 18 L26 14" />
      </g>
      <g transform="translate(230 145)" {...ThinStroke}>
        <path d="M2 6 Q2 0 8 0 L26 0 Q32 0 32 6 L32 18 Q32 24 26 24 L14 24 L6 32 L8 24 Q2 24 2 18 Z" />
        <path d="M8 10 L26 10 M8 16 L20 16" />
      </g>
      <g transform="translate(320 145)" {...ThinStroke}>
        <circle cx="15" cy="15" r="14" />
        <path d="M15 6 L15 15 L22 19" />
      </g>
      <text x="200" y="222" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">
        Any sign? Call 000 immediately
      </text>
    </g>
  );
}

function Burns() {
  return (
    <g>
      {/* Tap */}
      <rect x="120" y="20" width="16" height="50" rx="2" {...StrokeStyle} />
      <rect x="80" y="20" width="100" height="14" rx="3" {...FillSofter} />
      <rect x="80" y="20" width="100" height="14" rx="3" {...StrokeStyle} />
      <rect x="115" y="70" width="26" height="10" rx="2" {...StrokeStyle} />
      {/* Water stream */}
      {Array.from({ length: 6 }).map((_, i) => (
        <path
          key={i}
          d={`M${120 + i * 3} 82 Q${122 + i * 3} 110 ${118 + i * 3} 145`}
          {...ThinStroke}
          opacity={0.65}
        />
      ))}
      {/* Hand under water */}
      <path d="M70 165 Q100 145 160 150 Q200 152 230 170 L230 195 L70 195 Z" {...FillSoft} />
      <path d="M70 165 Q100 145 160 150 Q200 152 230 170" {...StrokeStyle} />
      <path d="M70 195 L230 195" {...StrokeStyle} />
      {/* Fingers */}
      <path d="M95 155 L95 130" {...StrokeStyle} />
      <path d="M120 150 L120 122" {...StrokeStyle} />
      <path d="M145 150 L145 124" {...StrokeStyle} />
      <path d="M170 152 L170 130" {...StrokeStyle} />
      {/* Timer */}
      <circle cx="320" cy="110" r="38" {...ThinStroke} />
      <path d="M320 80 L320 110 L342 122" {...StrokeStyle} />
      <text x="320" y="160" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
        20 min
      </text>
      <text x="200" y="225" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">
        Cool running water · no ice · no creams
      </text>
    </g>
  );
}

// Registry ----------------------------------------------------------------

const REGISTRY: Record<string, () => JSX.Element> = {
  cpr: Cpr,
  choking: Choking,
  "recovery-position": RecoveryPosition,
  bleeding: Bleeding,
  "snake-bite": SnakeBite,
  anaphylaxis: Anaphylaxis,
  stroke: Stroke,
  burns: Burns,
};

export function hasIllustration(slug: string): boolean {
  return slug in REGISTRY;
}

const TopicIllustration = memo(function TopicIllustration({ slug, className }: Props) {
  const Diagram = REGISTRY[slug];
  if (!Diagram) return null;
  return (
    <figure
      className={
        "my-6 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-4 sm:p-6 " +
        (className ?? "")
      }
    >
      <svg
        role="img"
        aria-hidden="true"
        viewBox={FRAME}
        className="w-full h-auto max-h-64 text-primary"
        preserveAspectRatio="xMidYMid meet"
      >
        <Diagram />
      </svg>
    </figure>
  );
});

export default TopicIllustration;
