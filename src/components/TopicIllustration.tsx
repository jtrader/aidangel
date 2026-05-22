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

// Additional topic diagrams ----------------------------------------------

function Drsabcd() {
  const steps = [
    { l: "D", t: "Danger" },
    { l: "R", t: "Response" },
    { l: "S", t: "Send 000" },
    { l: "A", t: "Airway" },
    { l: "B", t: "Breathing" },
    { l: "C", t: "CPR" },
    { l: "D", t: "Defib" },
  ];
  return (
    <g>
      {steps.map((s, i) => {
        const x = 25 + i * 52;
        return (
          <g key={i} transform={`translate(${x} 40)`}>
            <circle cx="20" cy="20" r="20" {...FillSofter} />
            <circle cx="20" cy="20" r="20" {...StrokeStyle} />
            <text x="20" y="27" textAnchor="middle" fontSize="20" fontWeight="800" fill="currentColor">{s.l}</text>
            <text x="20" y="58" textAnchor="middle" fontSize="10" fontWeight="600" fill="currentColor">{s.t}</text>
            {i < steps.length - 1 && <path d="M42 20 L52 20" {...ThinStroke} />}
          </g>
        );
      })}
      <text x="200" y="160" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">
        Primary survey · in order · every casualty
      </text>
      <path d="M60 185 Q200 175 340 195" {...ThinStroke} opacity={0.4} />
    </g>
  );
}

function Aed() {
  return (
    <g>
      {/* Torso */}
      <path d="M90 175 Q90 80 200 75 Q310 80 310 175" {...StrokeStyle} />
      <path d="M170 75 L170 55 Q200 42 230 55 L230 75" {...ThinStroke} />
      {/* Pad 1: upper right chest (viewer left) */}
      <rect x="120" y="100" width="50" height="36" rx="6" {...FillSofter} />
      <rect x="120" y="100" width="50" height="36" rx="6" {...StrokeStyle} />
      <path d="M145 110 L145 126 M137 118 L153 118" {...ThinStroke} />
      {/* Pad 2: lower left ribs (viewer right) */}
      <rect x="230" y="145" width="50" height="36" rx="6" {...FillSofter} />
      <rect x="230" y="145" width="50" height="36" rx="6" {...StrokeStyle} />
      <path d="M238 163 L272 163" {...ThinStroke} />
      {/* Lightning bolt between pads */}
      <path d="M200 110 L188 140 L208 140 L195 175" {...StrokeStyle} fill="currentColor" opacity={0.7} />
      <text x="200" y="215" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">
        Upper right · lower left · follow voice prompts
      </text>
    </g>
  );
}

function Asthma() {
  return (
    <g>
      {/* Spacer + puffer */}
      <ellipse cx="180" cy="120" rx="70" ry="40" {...FillSoft} />
      <ellipse cx="180" cy="120" rx="70" ry="40" {...StrokeStyle} />
      <circle cx="115" cy="120" r="16" {...StrokeStyle} />
      <rect x="250" y="100" width="30" height="40" rx="4" {...FillSofter} />
      <rect x="250" y="100" width="30" height="40" rx="4" {...StrokeStyle} />
      <rect x="258" y="80" width="14" height="22" rx="2" {...StrokeStyle} />
      {/* Mist arrows */}
      <path d="M150 120 L120 120" {...ThinStroke} />
      <path d="M128 114 L118 120 L128 126" {...ThinStroke} />
      {/* 4x4x4 label */}
      <text x="200" y="200" textAnchor="middle" fontSize="22" fontWeight="800" fill="currentColor">
        4 · 4 · 4
      </text>
      <text x="200" y="222" textAnchor="middle" fontSize="12" fontWeight="600" fill="currentColor">
        4 puffs · 4 breaths each · wait 4 min
      </text>
    </g>
  );
}

function AllergicReactions() {
  return (
    <g>
      {/* Face with hives */}
      <circle cx="200" cy="110" r="60" {...StrokeStyle} />
      <circle cx="180" cy="100" r="3.5" {...StrokeStyle} />
      <circle cx="220" cy="100" r="3.5" {...StrokeStyle} />
      <path d="M178 130 Q200 142 222 130" {...ThinStroke} />
      {/* Hive dots */}
      {[
        [165, 80], [240, 75], [155, 130], [245, 135], [200, 60], [175, 150], [225, 150], [195, 95],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="5" {...FillSofter} />
      ))}
      {/* Question pictograms: skin, breath, dizziness */}
      <text x="200" y="200" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
        Skin only? Mild. Any breathing change? Anaphylaxis.
      </text>
    </g>
  );
}

function HeartAttack() {
  return (
    <g>
      {/* Torso silhouette */}
      <path d="M120 60 Q120 40 200 40 Q280 40 280 60 L280 200 L120 200 Z" {...ThinStroke} opacity={0.3} />
      {/* Heart */}
      <path
        d="M200 145 Q170 115 170 95 Q170 75 185 75 Q195 75 200 88 Q205 75 215 75 Q230 75 230 95 Q230 115 200 145 Z"
        {...FillSofter}
      />
      <path
        d="M200 145 Q170 115 170 95 Q170 75 185 75 Q195 75 200 88 Q205 75 215 75 Q230 75 230 95 Q230 115 200 145 Z"
        {...StrokeStyle}
      />
      {/* Pain radiating arrows */}
      <path d="M155 90 L130 75" {...ThinStroke} />
      <path d="M138 78 L128 74 L132 84" {...ThinStroke} />
      <path d="M245 90 L270 75" {...ThinStroke} />
      <path d="M262 78 L272 74 L268 84" {...ThinStroke} />
      <path d="M200 145 L200 175" {...ThinStroke} />
      <path d="M194 168 L200 178 L206 168" {...ThinStroke} />
      {/* ECG line */}
      <path d="M80 215 L130 215 L140 195 L150 235 L160 215 L320 215" {...StrokeStyle} />
      <text x="200" y="232" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor" opacity={0}>·</text>
    </g>
  );
}

function Seizures() {
  return (
    <g>
      {/* Ground */}
      <line x1="30" y1="190" x2="370" y2="190" {...ThinStroke} opacity={0.4} />
      {/* Person on side */}
      <circle cx="110" cy="155" r="20" {...StrokeStyle} />
      <path d="M128 150 Q200 160 280 175" {...StrokeStyle} />
      <path d="M128 170 Q200 180 270 188" {...StrokeStyle} />
      {/* Cushion under head */}
      <rect x="60" y="170" width="80" height="20" rx="6" {...FillSofter} />
      <rect x="60" y="170" width="80" height="20" rx="6" {...ThinStroke} />
      {/* No-symbol over mouth (do not put anything in) */}
      <circle cx="125" cy="155" r="14" stroke="currentColor" fill="none" strokeWidth={2} />
      <path d="M115 145 L135 165" stroke="currentColor" strokeWidth={2} />
      {/* Clock */}
      <circle cx="320" cy="80" r="32" {...ThinStroke} />
      <path d="M320 55 L320 80 L340 92" {...StrokeStyle} />
      <text x="320" y="130" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">&gt; 5 min · 000</text>
      <text x="200" y="220" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">
        Cushion the head · nothing in the mouth · time it
      </text>
    </g>
  );
}

function Diabetes() {
  return (
    <g>
      {/* Low (left): juice glass + jellybeans */}
      <g transform="translate(60 40)">
        <path d="M10 10 L70 10 L62 110 L18 110 Z" {...FillSofter} />
        <path d="M10 10 L70 10 L62 110 L18 110 Z" {...StrokeStyle} />
        <path d="M14 35 L66 35" {...ThinStroke} opacity={0.5} />
        <text x="40" y="140" textAnchor="middle" fontSize="13" fontWeight="800" fill="currentColor">LOW</text>
        <text x="40" y="156" textAnchor="middle" fontSize="10" fontWeight="600" fill="currentColor">give sugar</text>
      </g>
      {/* Arrow when in doubt → treat low */}
      <path d="M150 100 L250 100" {...StrokeStyle} />
      <path d="M242 92 L252 100 L242 108" {...StrokeStyle} />
      <text x="200" y="90" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">when in doubt</text>
      {/* High (right): water + waves */}
      <g transform="translate(260 40)">
        <circle cx="40" cy="60" r="44" {...FillSoft} />
        <circle cx="40" cy="60" r="44" {...StrokeStyle} />
        <path d="M14 58 Q27 50 40 58 Q53 66 66 58" {...ThinStroke} />
        <path d="M14 72 Q27 64 40 72 Q53 80 66 72" {...ThinStroke} />
        <text x="40" y="140" textAnchor="middle" fontSize="13" fontWeight="800" fill="currentColor">HIGH</text>
        <text x="40" y="156" textAnchor="middle" fontSize="10" fontWeight="600" fill="currentColor">thirst · slow</text>
      </g>
      <text x="200" y="225" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
        Unconscious? Recovery position · call 000
      </text>
    </g>
  );
}

function HeadInjury() {
  return (
    <g>
      {/* Head profile */}
      <path d="M120 130 Q120 60 200 55 Q280 60 285 120 Q285 160 250 175 L200 175 Q170 175 165 195 L140 195 Q120 175 120 150 Z" {...StrokeStyle} />
      {/* Ear */}
      <ellipse cx="220" cy="135" rx="10" ry="14" {...ThinStroke} />
      {/* Impact star */}
      <g transform="translate(170 80)" {...StrokeStyle}>
        <path d="M0 -16 L4 -4 L16 -4 L6 4 L10 16 L0 8 L-10 16 L-6 4 L-16 -4 L-4 -4 Z" {...FillSofter} />
        <path d="M0 -16 L4 -4 L16 -4 L6 4 L10 16 L0 8 L-10 16 L-6 4 L-16 -4 L-4 -4 Z" />
      </g>
      {/* Warning checklist on right */}
      <g transform="translate(305 70)">
        {["LOC", "Vomit", "Confused", "Seizure"].map((t, i) => (
          <g key={t} transform={`translate(0 ${i * 22})`}>
            <rect x="0" y="0" width="14" height="14" rx="3" {...ThinStroke} />
            <path d="M3 7 L6 11 L12 3" {...StrokeStyle} />
            <text x="20" y="11" fontSize="11" fontWeight="600" fill="currentColor">{t}</text>
          </g>
        ))}
      </g>
      <text x="200" y="222" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
        Any warning sign · call 000
      </text>
    </g>
  );
}

function SpinalInjury() {
  return (
    <g>
      {/* Ground */}
      <line x1="20" y1="170" x2="380" y2="170" {...ThinStroke} opacity={0.4} />
      {/* Casualty lying flat */}
      <circle cx="80" cy="150" r="20" {...StrokeStyle} />
      <rect x="100" y="142" width="240" height="20" rx="4" {...FillSofter} />
      <rect x="100" y="142" width="240" height="20" rx="4" {...StrokeStyle} />
      {/* Helper hands either side of head */}
      <path d="M50 130 Q58 145 70 145" {...StrokeStyle} />
      <path d="M50 175 Q58 160 70 160" {...StrokeStyle} />
      <path d="M115 130 Q105 145 95 145" {...StrokeStyle} />
      <path d="M115 175 Q105 160 95 160" {...StrokeStyle} />
      {/* Alignment line */}
      <path d="M80 110 L350 110" stroke="currentColor" strokeDasharray="4 6" strokeWidth={1.6} fill="none" />
      <path d="M80 200 L350 200" stroke="currentColor" strokeDasharray="4 6" strokeWidth={1.6} fill="none" />
      <text x="200" y="225" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
        Head in line with body · do not twist
      </text>
    </g>
  );
}

function Fractures() {
  return (
    <g>
      {/* Forearm with splint */}
      <path d="M70 110 L320 110" {...StrokeStyle} />
      <path d="M70 145 L320 145" {...StrokeStyle} />
      <path d="M70 110 Q60 127 70 145" {...StrokeStyle} />
      <path d="M320 110 Q330 127 320 145" {...StrokeStyle} />
      {/* Break line (zig-zag) */}
      <path d="M180 110 L188 125 L182 140 L196 145" {...StrokeStyle} />
      {/* Splint board above and below */}
      <rect x="60" y="80" width="270" height="14" rx="3" {...FillSofter} />
      <rect x="60" y="80" width="270" height="14" rx="3" {...StrokeStyle} />
      <rect x="60" y="160" width="270" height="14" rx="3" {...FillSofter} />
      <rect x="60" y="160" width="270" height="14" rx="3" {...StrokeStyle} />
      {/* Ties */}
      {[90, 150, 220, 290].map((x) => (
        <path key={x} d={`M${x} 75 L${x} 180`} {...ThinStroke} opacity={0.6} />
      ))}
      <text x="200" y="215" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">
        Immobilise above and below · do not straighten
      </text>
    </g>
  );
}

function SprainsStrains() {
  const items = [
    { l: "R", t: "Rest" },
    { l: "I", t: "Ice 20 min" },
    { l: "C", t: "Compress" },
    { l: "E", t: "Elevate" },
  ];
  return (
    <g>
      {items.map((s, i) => (
        <g key={s.l} transform={`translate(${30 + i * 90} 50)`}>
          <rect x="0" y="0" width="80" height="80" rx="14" {...FillSoft} />
          <rect x="0" y="0" width="80" height="80" rx="14" {...ThinStroke} />
          <text x="40" y="50" textAnchor="middle" fontSize="38" fontWeight="800" fill="currentColor">{s.l}</text>
          <text x="40" y="100" textAnchor="middle" fontSize="11" fontWeight="600" fill="currentColor">{s.t}</text>
        </g>
      ))}
      <text x="200" y="180" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
        First 48 hours — no Heat, Alcohol, Running, Massage
      </text>
    </g>
  );
}

function SpiderBite() {
  return (
    <g>
      {/* Two columns: funnel-web (bandage) vs redback (ice pack) */}
      <g transform="translate(20 20)">
        <text x="80" y="0" textAnchor="middle" fontSize="12" fontWeight="800" fill="currentColor">FUNNEL-WEB</text>
        <text x="80" y="14" textAnchor="middle" fontSize="10" fontWeight="600" fill="currentColor">pressure bandage</text>
        <path d="M50 30 L50 180 M110 30 L110 180" {...StrokeStyle} />
        {Array.from({ length: 11 }).map((_, i) => (
          <path key={i} d={`M52 ${36 + i * 14} Q80 ${42 + i * 14} 108 ${36 + i * 14}`} {...ThinStroke} />
        ))}
      </g>
      {/* Divider */}
      <line x1="200" y1="20" x2="200" y2="200" {...ThinStroke} opacity={0.3} />
      <g transform="translate(220 20)">
        <text x="80" y="0" textAnchor="middle" fontSize="12" fontWeight="800" fill="currentColor">REDBACK</text>
        <text x="80" y="14" textAnchor="middle" fontSize="10" fontWeight="600" fill="currentColor">cold pack only</text>
        {/* Limb */}
        <path d="M50 30 L50 180 M110 30 L110 180" {...StrokeStyle} />
        {/* Ice pack */}
        <rect x="45" y="80" width="70" height="50" rx="6" {...FillSofter} />
        <rect x="45" y="80" width="70" height="50" rx="6" {...StrokeStyle} />
        <path d="M60 95 L100 115 M100 95 L60 115 M80 88 L80 122 M50 105 L110 105" {...ThinStroke} />
      </g>
      <text x="200" y="225" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">
        Different spiders · different treatment
      </text>
    </g>
  );
}

function JellyfishStings() {
  return (
    <g>
      {/* Vinegar bottle */}
      <g transform="translate(50 40)">
        <rect x="20" y="0" width="14" height="14" rx="2" {...StrokeStyle} />
        <path d="M10 14 L44 14 L44 110 Q44 120 34 120 L20 120 Q10 120 10 110 Z" {...FillSofter} />
        <path d="M10 14 L44 14 L44 110 Q44 120 34 120 L20 120 Q10 120 10 110 Z" {...StrokeStyle} />
        <text x="27" y="70" textAnchor="middle" fontSize="11" fontWeight="800" fill="currentColor">VIN</text>
        <text x="27" y="140" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor">Tropical</text>
        <text x="27" y="154" textAnchor="middle" fontSize="9" fontWeight="600" fill="currentColor">box · irukandji</text>
      </g>
      {/* Divider */}
      <line x1="180" y1="30" x2="180" y2="170" {...ThinStroke} opacity={0.3} />
      {/* Hot water */}
      <g transform="translate(210 40)">
        <path d="M30 30 L90 30 L80 120 L40 120 Z" {...FillSofter} />
        <path d="M30 30 L90 30 L80 120 L40 120 Z" {...StrokeStyle} />
        {/* Steam */}
        <path d="M50 15 Q55 5 50 -5 M70 15 Q75 5 70 -5 M60 20 Q65 10 60 0" {...ThinStroke} />
        <text x="60" y="80" textAnchor="middle" fontSize="14" fontWeight="800" fill="currentColor">45°</text>
        <text x="60" y="140" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor">Temperate</text>
        <text x="60" y="154" textAnchor="middle" fontSize="9" fontWeight="600" fill="currentColor">bluebottle</text>
      </g>
      <text x="200" y="225" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">
        No urine · never fresh water
      </text>
    </g>
  );
}

function HeatIllness() {
  return (
    <g>
      {/* Sun */}
      <circle cx="80" cy="80" r="28" {...FillSofter} />
      <circle cx="80" cy="80" r="28" {...StrokeStyle} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const r1 = 34;
        const r2 = 46;
        const rad = (a * Math.PI) / 180;
        return (
          <line
            key={a}
            x1={80 + Math.cos(rad) * r1}
            y1={80 + Math.sin(rad) * r1}
            x2={80 + Math.cos(rad) * r2}
            y2={80 + Math.sin(rad) * r2}
            {...StrokeStyle}
          />
        );
      })}
      {/* Thermometer */}
      <g transform="translate(195 25)">
        <rect x="10" y="0" width="20" height="130" rx="10" {...StrokeStyle} />
        <circle cx="20" cy="140" r="18" {...FillSofter} />
        <circle cx="20" cy="140" r="18" {...StrokeStyle} />
        <rect x="14" y="40" width="12" height="100" rx="6" fill="currentColor" opacity={0.5} />
        {[20, 50, 80, 110].map((y) => (
          <line key={y} x1="30" y1={y} x2="40" y2={y} {...ThinStroke} />
        ))}
      </g>
      {/* Ice cubes for cooling */}
      <g transform="translate(270 70)">
        <rect x="0" y="0" width="34" height="34" rx="6" {...FillSoft} />
        <rect x="0" y="0" width="34" height="34" rx="6" {...StrokeStyle} />
        <rect x="40" y="20" width="34" height="34" rx="6" {...FillSoft} />
        <rect x="40" y="20" width="34" height="34" rx="6" {...StrokeStyle} />
      </g>
      <text x="200" y="210" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
        Hot & dry skin + confusion = heat stroke
      </text>
      <text x="200" y="228" textAnchor="middle" fontSize="11" fontWeight="600" fill="currentColor">
        Cool rapidly · call 000
      </text>
    </g>
  );
}

function Hypothermia() {
  return (
    <g>
      {/* Wrapped figure */}
      <circle cx="200" cy="70" r="26" {...StrokeStyle} />
      <path d="M140 200 Q140 110 200 105 Q260 110 260 200 Z" {...FillSofter} />
      <path d="M140 200 Q140 110 200 105 Q260 110 260 200 Z" {...StrokeStyle} />
      {/* Blanket folds */}
      <path d="M150 140 Q200 150 250 140" {...ThinStroke} />
      <path d="M148 165 Q200 178 252 165" {...ThinStroke} />
      <path d="M145 190 Q200 200 255 190" {...ThinStroke} />
      {/* Snowflakes around */}
      {[
        [50, 60], [70, 130], [340, 60], [330, 140], [80, 200], [320, 200],
      ].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx} ${cy})`} {...ThinStroke}>
          <path d="M0 -10 L0 10 M-10 0 L10 0 M-7 -7 L7 7 M-7 7 L7 -7" />
        </g>
      ))}
      <text x="200" y="225" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
        Dry layers · gradual rewarming · no direct heat
      </text>
    </g>
  );
}

function Poisoning() {
  return (
    <g>
      {/* Bottle with skull */}
      <g transform="translate(140 40)">
        <rect x="40" y="0" width="40" height="20" rx="3" {...StrokeStyle} />
        <path d="M20 20 L100 20 L100 150 Q100 165 85 165 L35 165 Q20 165 20 150 Z" {...FillSofter} />
        <path d="M20 20 L100 20 L100 150 Q100 165 85 165 L35 165 Q20 165 20 150 Z" {...StrokeStyle} />
        {/* Skull */}
        <circle cx="60" cy="80" r="20" {...StrokeStyle} fill="hsl(var(--background))" />
        <circle cx="53" cy="78" r="3.5" fill="currentColor" />
        <circle cx="67" cy="78" r="3.5" fill="currentColor" />
        <path d="M53 90 L57 96 L60 92 L63 96 L67 90" {...ThinStroke} />
        <text x="60" y="125" textAnchor="middle" fontSize="11" fontWeight="800" fill="currentColor">POISON</text>
      </g>
      {/* Phone */}
      <g transform="translate(290 80)">
        <rect x="0" y="0" width="60" height="90" rx="10" {...StrokeStyle} />
        <text x="30" y="38" textAnchor="middle" fontSize="11" fontWeight="800" fill="currentColor">13</text>
        <text x="30" y="55" textAnchor="middle" fontSize="11" fontWeight="800" fill="currentColor">11 26</text>
        <circle cx="30" cy="78" r="4" {...StrokeStyle} />
      </g>
      <text x="200" y="220" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
        Poisons hotline · do NOT induce vomiting
      </text>
    </g>
  );
}

function Drowning() {
  return (
    <g>
      {/* Water waves */}
      <path d="M20 140 Q60 130 100 140 Q140 150 180 140 Q220 130 260 140 Q300 150 340 140 Q370 132 390 140" {...StrokeStyle} />
      <path d="M20 155 Q60 145 100 155 Q140 165 180 155 Q220 145 260 155 Q300 165 340 155 Q370 147 390 155" {...ThinStroke} />
      <path d="M20 170 Q60 160 100 170 Q140 180 180 170 Q220 160 260 170 Q300 180 340 170 Q370 162 390 170" {...ThinStroke} opacity={0.6} />
      {/* Casualty being supported */}
      <circle cx="200" cy="110" r="20" {...StrokeStyle} />
      <path d="M180 130 L220 130 L215 150 L185 150 Z" {...FillSofter} />
      <path d="M180 130 L220 130 L215 150 L185 150 Z" {...StrokeStyle} />
      {/* Five breaths label */}
      <g transform="translate(290 50)">
        <circle cx="30" cy="30" r="30" {...FillSofter} />
        <circle cx="30" cy="30" r="30" {...StrokeStyle} />
        <text x="30" y="28" textAnchor="middle" fontSize="20" fontWeight="800" fill="currentColor">5</text>
        <text x="30" y="44" textAnchor="middle" fontSize="9" fontWeight="700" fill="currentColor">breaths</text>
      </g>
      <text x="200" y="215" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
        5 rescue breaths first · then CPR · always 000
      </text>
    </g>
  );
}

function Nosebleed() {
  return (
    <g>
      {/* Head profile leaning forward */}
      <path d="M140 60 Q200 45 250 70 Q275 100 265 145 L240 155 L220 175 L160 175 Q130 165 130 130 Z" {...StrokeStyle} />
      {/* Eye */}
      <circle cx="200" cy="105" r="3.5" fill="currentColor" />
      {/* Pinching fingers */}
      <path d="M270 130 Q295 125 295 145 Q295 160 275 158" {...StrokeStyle} />
      <path d="M260 138 L290 142" {...StrokeStyle} />
      {/* Drop falling forward */}
      <path d="M250 165 Q254 175 250 185 Q246 195 250 200" {...ThinStroke} />
      <circle cx="252" cy="200" r="4" {...FillSofter} />
      {/* Forward arrow */}
      <path d="M90 100 L60 130" {...ThinStroke} />
      <path d="M70 122 L58 132 L70 134" {...ThinStroke} />
      <text x="200" y="220" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
        Lean forward · pinch soft part · 10 min
      </text>
    </g>
  );
}

function Fainting() {
  return (
    <g>
      {/* Ground */}
      <line x1="20" y1="180" x2="380" y2="180" {...ThinStroke} opacity={0.4} />
      {/* Body flat */}
      <circle cx="80" cy="160" r="18" {...StrokeStyle} />
      <rect x="98" y="155" width="160" height="14" rx="4" {...FillSofter} />
      <rect x="98" y="155" width="160" height="14" rx="4" {...StrokeStyle} />
      {/* Legs raised on a cushion */}
      <path d="M258 162 L320 110" {...StrokeStyle} />
      <path d="M258 169 L320 130" {...StrokeStyle} />
      <rect x="310" y="100" width="60" height="36" rx="6" {...FillSofter} />
      <rect x="310" y="100" width="60" height="36" rx="6" {...StrokeStyle} />
      {/* Arrow showing blood return */}
      <path d="M260 90 L120 90" {...ThinStroke} />
      <path d="M130 82 L118 90 L130 98" {...ThinStroke} />
      <text x="190" y="78" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">blood to brain</text>
      <text x="200" y="220" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
        Lay flat · raise legs · recover in 1–2 min
      </text>
    </g>
  );
}

function Dehydration() {
  return (
    <g>
      {/* Glass with water level low */}
      <path d="M120 40 L220 40 L210 200 L130 200 Z" {...StrokeStyle} />
      <path d="M130 145 L210 145 L205 200 L135 200 Z" {...FillSofter} />
      <path d="M132 150 Q170 142 208 150" {...ThinStroke} />
      {/* Drop */}
      <path d="M280 60 Q300 90 290 115 Q280 130 270 115 Q260 90 280 60 Z" {...FillSofter} />
      <path d="M280 60 Q300 90 290 115 Q280 130 270 115 Q260 90 280 60 Z" {...StrokeStyle} />
      {/* Plus sign */}
      <g transform="translate(330 75)" {...StrokeStyle}>
        <line x1="0" y1="20" x2="40" y2="20" />
        <line x1="20" y1="0" x2="20" y2="40" />
      </g>
      <text x="200" y="225" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
        Small frequent sips · oral rehydration solution
      </text>
    </g>
  );
}

function Sunburn() {
  return (
    <g>
      {/* Sun */}
      <circle cx="320" cy="60" r="22" {...FillSofter} />
      <circle cx="320" cy="60" r="22" {...StrokeStyle} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const rad = (a * Math.PI) / 180;
        return (
          <line
            key={a}
            x1={320 + Math.cos(rad) * 28}
            y1={60 + Math.sin(rad) * 28}
            x2={320 + Math.cos(rad) * 40}
            y2={60 + Math.sin(rad) * 40}
            {...StrokeStyle}
          />
        );
      })}
      {/* Shoulders / skin */}
      <path d="M50 180 Q130 110 220 130 Q250 135 260 175" {...StrokeStyle} />
      <path d="M50 200 Q130 130 220 150 Q250 155 260 195" {...FillSofter} />
      <path d="M50 200 Q130 130 220 150 Q250 155 260 195" {...StrokeStyle} />
      {/* Cool water tap suggestion */}
      <path d="M90 65 L90 95" {...StrokeStyle} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${88 + i * 3} 100 Q${90 + i * 3} 115 ${86 + i * 3} 130`} {...ThinStroke} opacity={0.7} />
      ))}
      <text x="200" y="225" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
        20 min cool water · never burst blisters
      </text>
    </g>
  );
}

function DentalInjury() {
  return (
    <g>
      {/* Tooth */}
      <g transform="translate(70 40)">
        <path d="M40 0 Q80 0 80 40 Q80 75 65 110 Q55 140 40 140 Q25 140 15 110 Q0 75 0 40 Q0 0 40 0 Z" {...FillSofter} />
        <path d="M40 0 Q80 0 80 40 Q80 75 65 110 Q55 140 40 140 Q25 140 15 110 Q0 75 0 40 Q0 0 40 0 Z" {...StrokeStyle} />
        <text x="40" y="78" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">crown</text>
        <path d="M0 100 Q40 92 80 100" {...ThinStroke} />
        <text x="40" y="125" textAnchor="middle" fontSize="9" fontWeight="600" fill="currentColor">root — do not touch</text>
      </g>
      {/* Milk carton */}
      <g transform="translate(220 50)">
        <path d="M0 30 L80 30 L80 150 L0 150 Z" {...FillSofter} />
        <path d="M0 30 L80 30 L80 150 L0 150 Z" {...StrokeStyle} />
        <path d="M0 30 L40 0 L80 30" {...StrokeStyle} />
        <text x="40" y="95" textAnchor="middle" fontSize="14" fontWeight="800" fill="currentColor">MILK</text>
        <text x="40" y="115" textAnchor="middle" fontSize="9" fontWeight="600" fill="currentColor">store tooth</text>
      </g>
      {/* Clock 30 */}
      <g transform="translate(320 80)" {...ThinStroke}>
        <circle cx="20" cy="20" r="20" />
        <path d="M20 6 L20 20 L32 26" />
        <text x="20" y="60" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">30 min</text>
      </g>
      <text x="200" y="225" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">
        Hold by crown · milk or saliva · dentist fast
      </text>
    </g>
  );
}

function EyeInjuries() {
  return (
    <g>
      {/* Eye almond */}
      <path d="M70 120 Q200 50 330 120 Q200 190 70 120 Z" {...StrokeStyle} />
      <circle cx="200" cy="120" r="36" {...FillSofter} />
      <circle cx="200" cy="120" r="36" {...StrokeStyle} />
      <circle cx="200" cy="120" r="14" fill="currentColor" />
      {/* Water stream from above */}
      <path d="M150 30 L150 70" {...StrokeStyle} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${148 + i * 3} 75 Q${150 + i * 3} 100 ${146 + i * 3} 118`} {...ThinStroke} opacity={0.7} />
      ))}
      {/* Tilt arrow */}
      <path d="M260 40 Q300 60 320 100" {...ThinStroke} />
      <path d="M312 90 L322 102 L308 102" {...ThinStroke} />
      <text x="200" y="215" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
        Chemical splash · flush 20 min · tilt head out
      </text>
    </g>
  );
}

function ElectricShock() {
  return (
    <g>
      {/* Plug + danger triangle */}
      <g transform="translate(60 60)">
        <rect x="0" y="20" width="70" height="80" rx="10" {...FillSofter} />
        <rect x="0" y="20" width="70" height="80" rx="10" {...StrokeStyle} />
        <rect x="18" y="0" width="10" height="22" rx="2" {...StrokeStyle} />
        <rect x="42" y="0" width="10" height="22" rx="2" {...StrokeStyle} />
        <text x="35" y="70" textAnchor="middle" fontSize="11" fontWeight="800" fill="currentColor">OFF</text>
      </g>
      {/* Lightning bolt */}
      <path d="M200 40 L170 130 L200 130 L180 200" {...StrokeStyle} fill="currentColor" opacity={0.7} />
      {/* 8m sign */}
      <g transform="translate(260 60)">
        <path d="M40 0 L80 80 L0 80 Z" {...FillSofter} />
        <path d="M40 0 L80 80 L0 80 Z" {...StrokeStyle} />
        <text x="40" y="58" textAnchor="middle" fontSize="20" fontWeight="800" fill="currentColor">8m</text>
        <text x="40" y="105" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor">stay clear</text>
      </g>
      <text x="200" y="225" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
        Power off first · never touch a live casualty
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
  drsabcd: Drsabcd,
  aed: Aed,
  asthma: Asthma,
  "allergic-reactions": AllergicReactions,
  "heart-attack": HeartAttack,
  seizures: Seizures,
  diabetes: Diabetes,
  "head-injury": HeadInjury,
  "spinal-injury": SpinalInjury,
  fractures: Fractures,
  "sprains-strains": SprainsStrains,
  "spider-bite": SpiderBite,
  "jellyfish-stings": JellyfishStings,
  "heat-illness": HeatIllness,
  hypothermia: Hypothermia,
  poisoning: Poisoning,
  drowning: Drowning,
  nosebleed: Nosebleed,
  fainting: Fainting,
  dehydration: Dehydration,
  sunburn: Sunburn,
  "dental-injury": DentalInjury,
  "eye-injuries": EyeInjuries,
  "electric-shock": ElectricShock,
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
