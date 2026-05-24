import type { SVGProps } from "react";

const OUTLINE = "#333333";
const SILVER = "#E5E7EB";
const SILVER_2 = "#CBD5E1";
const SLATE = "#94A3B8";
const SLATE_2 = "#475569";
const RED = "#F20822";
const RED_2 = "#FF4D5A";

function PanelLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontFamily="sans-serif"
      fontSize="11"
      fontWeight="600"
      fill={SLATE_2}
      letterSpacing="0.08em"
    >
      {text}
    </text>
  );
}

export default function DefibPadsPediatric({
  className,
  title,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      role="img"
      aria-labelledby="defib-pads-pediatric-title"
      {...props}
    >
      <title id="defib-pads-pediatric-title">
        {title ?? "Pediatric Defibrillator Pad Placement"}
      </title>

      <defs>
        <marker
          id="pad-arrow"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,1 L9,3 L0,5 Z" fill={RED} />
        </marker>
      </defs>

      {/* === Background panels === */}
      <rect x="10" y="10" width="180" height="240" rx="12" fill={SILVER} stroke={OUTLINE} strokeWidth="3" />
      <rect x="210" y="10" width="180" height="240" rx="12" fill={SILVER} stroke={OUTLINE} strokeWidth="3" />

      {/* === Left Panel: Front Chest View === */}
      {/* Panel label */}
      <PanelLabel x="100" y="30" text="FRONT" />

      {/* Child torso — front */}
      {/* Neck */}
      <rect x="90" y="38" width="20" height="22" rx="4" fill={SILVER_2} stroke={OUTLINE} strokeWidth="3" />

      {/* Shoulders */}
      <path d="M 60 60 C 60 48, 140 48, 140 60 L 150 85 L 135 90 L 130 70 L 130 200 L 70 200 L 70 70 L 65 90 L 50 85 Z" fill={SILVER_2} stroke={OUTLINE} strokeWidth="3" />

      {/* Arms (simplified stubs) */}
      <rect x="35" y="80" width="22" height="55" rx="10" fill={SILVER_2} stroke={OUTLINE} strokeWidth="3" />
      <rect x="143" y="80" width="22" height="55" rx="10" fill={SILVER_2} stroke={OUTLINE} strokeWidth="3" />

      {/* Collarbone line */}
      <path d="M 72 60 Q 100 68, 128 60" fill="none" stroke={SLATE} strokeWidth="2" strokeLinecap="round" />

      {/* Chest center line */}
      <line x1="100" y1="60" x2="100" y2="195" stroke={SLATE} strokeWidth="1.5" strokeDasharray="4,3" />

      {/* Sternum suggestion */}
      <line x1="100" y1="72" x2="100" y2="168" stroke={SLATE_2} strokeWidth="2" strokeLinecap="round" />

      {/* Ribs suggestion */}
      <path d="M 75 90 Q 100 92, 125 90" fill="none" stroke={SLATE} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 75 115 Q 100 117, 125 115" fill="none" stroke={SLATE} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 75 140 Q 100 142, 125 140" fill="none" stroke={SLATE} strokeWidth="1.5" strokeLinecap="round" />

      {/* Emergency Red Pad Zone — center of chest */}
      <rect x="78" y="90" width="44" height="44" rx="8" fill={RED} fillOpacity="0.35" stroke={RED} strokeWidth="3" />
      <rect x="82" y="94" width="36" height="36" rx="6" fill="none" stroke={RED_2} strokeWidth="2" strokeDasharray="3,2" />

      {/* Pad label */}
      <text
        x="100"
        y="118"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="10"
        fontWeight="700"
        fill={OUTLINE}
        letterSpacing="0.02em"
      >
        PAD
      </text>

      {/* Direction arrows pointing to pad */}
      <line x1="60" y1="112" x2="74" y2="112" stroke={RED} strokeWidth="2.5" markerEnd="url(#pad-arrow)" />
      <line x1="140" y1="112" x2="126" y2="112" stroke={RED} strokeWidth="2.5" markerEnd="url(#pad-arrow)" />

      {/* Small red cross in center of pad zone */}
      <line x1="100" y1="98" x2="100" y2="126" stroke={RED} strokeWidth="3" strokeLinecap="round" />
      <line x1="86" y1="112" x2="114" y2="112" stroke={RED} strokeWidth="3" strokeLinecap="round" />

      {/* === Divider between panels === */}
      <line x1="195" y1="20" x2="205" y2="240" stroke={SLATE} strokeWidth="1" strokeDasharray="6,4" />
      <polygon points="200,18 198,24 202,24" fill={SLATE} />
      <polygon points="200,242 198,236 202,236" fill={SLATE} />

      {/* === Right Panel: Back View === */}
      {/* Panel label */}
      <PanelLabel x="300" y="30" text="BACK" />

      {/* Child torso — back */}
      {/* Neck */}
      <rect x="290" y="38" width="20" height="22" rx="4" fill={SILVER_2} stroke={OUTLINE} strokeWidth="3" />

      {/* Shoulders / back */}
      <path d="M 260 60 C 260 48, 340 48, 340 60 L 350 85 L 335 90 L 330 70 L 330 200 L 270 200 L 270 70 L 265 90 L 250 85 Z" fill={SILVER_2} stroke={OUTLINE} strokeWidth="3" />

      {/* Arms (simplified stubs) */}
      <rect x="235" y="80" width="22" height="55" rx="10" fill={SILVER_2} stroke={OUTLINE} strokeWidth="3" />
      <rect x="343" y="80" width="22" height="55" rx="10" fill={SILVER_2} stroke={OUTLINE} strokeWidth="3" />

      {/* Spine line */}
      <line x1="300" y1="60" x2="300" y2="195" stroke={SLATE} strokeWidth="1.5" strokeDasharray="4,3" />

      {/* Shoulder blade suggestions */}
      <ellipse cx="275" cy="90" rx="16" ry="24" fill="none" stroke={SLATE} strokeWidth="1.5" />
      <ellipse cx="325" cy="90" rx="16" ry="24" fill="none" stroke={SLATE} strokeWidth="1.5" />

      {/* Emergency Red Pad Zone — between shoulder blades */}
      <rect x="278" y="70" width="44" height="40" rx="8" fill={RED} fillOpacity="0.35" stroke={RED} strokeWidth="3" />
      <rect x="282" y="74" width="36" height="32" rx="6" fill="none" stroke={RED_2} strokeWidth="2" strokeDasharray="3,2" />

      {/* Pad label */}
      <text
        x="300"
        y="98"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="10"
        fontWeight="700"
        fill={OUTLINE}
        letterSpacing="0.02em"
      >
        PAD
      </text>

      {/* Direction arrows pointing to pad */}
      <line x1="260" y1="90" x2="274" y2="90" stroke={RED} strokeWidth="2.5" markerEnd="url(#pad-arrow)" />
      <line x1="340" y1="90" x2="326" y2="90" stroke={RED} strokeWidth="2.5" markerEnd="url(#pad-arrow)" />

      {/* Small red cross in center of pad zone */}
      <line x1="300" y1="78" x2="300" y2="102" stroke={RED} strokeWidth="3" strokeLinecap="round" />
      <line x1="286" y1="90" x2="314" y2="90" stroke={RED} strokeWidth="3" strokeLinecap="round" />

      {/* Bottom instruction text */}
      <text
        x="200"
        y="248"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="10"
        fontWeight="600"
        fill={SLATE_2}
        letterSpacing="0.06em"
      >
        PEDIATRIC DEFIBRILLATOR PAD PLACEMENT
      </text>
    </svg>
  );
}
