import type { SVGProps } from "react";

const STROKE = "#333333";
const SKIN = "#E8EAED";
const BODY = "#B8BFC6";
const STRAP = "#8A95A0";
const ACCENT = "#FF0000";
const TAG = "#FFFFFF";

const TourniquetApplication: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 280"
      role="img"
      aria-labelledby="tourniquet-application-title"
      width="100%"
      height="auto"
      {...props}
    >
      <title id="tourniquet-application-title">Tourniquet Application</title>

      {/* Shoulder / upper limb anchor */}
      <path
        d="M30 90 Q60 70 100 80 L320 110 Q360 118 370 140 Q360 162 320 170 L100 200 Q60 210 30 190 Z"
        fill={SKIN}
        stroke={STROKE}
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Subtle limb shading */}
      <path
        d="M100 175 L320 165 Q352 160 362 145"
        fill="none"
        stroke={BODY}
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Wound site (below tourniquet) */}
      <ellipse cx="290" cy="142" rx="22" ry="12" fill={ACCENT} stroke={STROKE} strokeWidth="3" />
      <path
        d="M278 150 Q286 168 282 188 M294 152 Q302 172 296 196 M286 152 Q292 174 288 200"
        fill="none"
        stroke={ACCENT}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Tourniquet strap (high and tight, above wound) */}
      <rect
        x="170"
        y="78"
        width="56"
        height="128"
        fill={STRAP}
        stroke={STROKE}
        strokeWidth="4"
        rx="4"
      />
      {/* Strap stitching */}
      <line x1="178" y1="86" x2="178" y2="198" stroke={STROKE} strokeWidth="2" strokeDasharray="4 4" />
      <line x1="218" y1="86" x2="218" y2="198" stroke={STROKE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Windlass clip / buckle */}
      <rect x="186" y="118" width="24" height="48" fill={SKIN} stroke={STROKE} strokeWidth="3" rx="3" />

      {/* Windlass rod (locked horizontally) */}
      <rect
        x="120"
        y="134"
        width="160"
        height="14"
        fill={BODY}
        stroke={STROKE}
        strokeWidth="4"
        rx="4"
      />
      <circle cx="125" cy="141" r="9" fill={STRAP} stroke={STROKE} strokeWidth="3" />
      <circle cx="275" cy="141" r="9" fill={STRAP} stroke={STROKE} strokeWidth="3" />

      {/* Lock retainer over rod */}
      <path
        d="M150 120 L150 162 M170 120 L170 162"
        stroke={STROKE}
        strokeWidth="3"
        fill="none"
      />
      <rect x="146" y="116" width="28" height="8" fill={STROKE} />
      <rect x="146" y="158" width="28" height="8" fill={STROKE} />

      {/* Time tag */}
      <g>
        <rect
          x="40"
          y="222"
          width="150"
          height="44"
          rx="6"
          fill={TAG}
          stroke={STROKE}
          strokeWidth="3"
        />
        <line x1="115" y1="222" x2="115" y2="218" stroke={STROKE} strokeWidth="3" />
        <line x1="115" y1="222" x2="115" y2="210" stroke={STROKE} strokeWidth="3" />
        <circle cx="115" cy="208" r="4" fill={ACCENT} stroke={STROKE} strokeWidth="2" />
        <text
          x="58"
          y="244"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="14"
          fontWeight="700"
          fill={STROKE}
        >
          TIME:
        </text>
        <text
          x="110"
          y="244"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="14"
          fontWeight="700"
          fill={ACCENT}
        >
          14:32
        </text>
        <line x1="58" y1="254" x2="172" y2="254" stroke={STROKE} strokeWidth="1" strokeDasharray="3 3" />
      </g>

      {/* Small clock icon */}
      <g transform="translate(330,228)">
        <circle cx="20" cy="20" r="20" fill={TAG} stroke={STROKE} strokeWidth="3" />
        <line x1="20" y1="20" x2="20" y2="8" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
        <line x1="20" y1="20" x2="30" y2="22" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" />
        <circle cx="20" cy="20" r="2" fill={STROKE} />
      </g>

      {/* Direction arrow from tourniquet to wound */}
      <path
        d="M236 140 Q258 132 274 138"
        fill="none"
        stroke={STROKE}
        strokeWidth="2"
        strokeDasharray="4 4"
      />
    </svg>
  );
};

export default TourniquetApplication;
