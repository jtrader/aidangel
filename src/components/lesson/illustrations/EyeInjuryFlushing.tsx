interface EyeInjuryFlushingProps {
  className?: string;
  title?: string;
}

export default function EyeInjuryFlushing({ className, title }: EyeInjuryFlushingProps) {
  return (
    <svg
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={title || "Flushing an injured eye with saline"}
    >
      {title && <title>{title}</title>}

      <defs>
        <marker
          id="eye-arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 1.5, 0 5.5, 7 3.5" fill="#F20822" />
        </marker>
      </defs>

      {/* Background face profile */}
      {/* Forehead / bridge of nose */}
      <path
        d="M 120 80 Q 220 80 260 110 L 270 130 L 270 160 Q 260 170 240 170 L 120 170 Z"
        fill="#E5E7EB"
        stroke="#333333"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Eye socket area */}
      <ellipse
        cx="215"
        cy="145"
        rx="42"
        ry="22"
        fill="#D1D5DB"
        stroke="#333333"
        strokeWidth="3"
      />

      {/* Open eye (sclera) */}
      <ellipse
        cx="215"
        cy="145"
        rx="34"
        ry="16"
        fill="#F9FAFB"
        stroke="#333333"
        strokeWidth="2"
      />

      {/* Iris */}
      <circle cx="215" cy="145" r="10" fill="#475569" stroke="#333333" strokeWidth="2" />

      {/* Pupil */}
      <circle cx="215" cy="145" r="4.5" fill="#333333" />

      {/* Upper eyelid */}
      <path
        d="M 182 145 Q 215 122 248 145"
        fill="none"
        stroke="#333333"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Lower eyelid */}
      <path
        d="M 182 145 Q 215 168 248 145"
        fill="none"
        stroke="#333333"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Eyebrow */}
      <path
        d="M 185 110 Q 215 98 245 108"
        fill="none"
        stroke="#333333"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Saline bottle / cup */}
      <g transform="translate(0, 0)">
        {/* Bottle body */}
        <rect x="50" y="75" width="44" height="78" rx="6" fill="#E5E7EB" stroke="#333333" strokeWidth="3" />
        {/* Label area */}
        <rect x="56" y="92" width="32" height="44" rx="2" fill="#CBD5E1" stroke="#333333" strokeWidth="2" />
        {/* Cap / nozzle */}
        <path
          d="M 62 75 L 62 60 Q 62 52 72 52 Q 82 52 82 60 L 82 75"
          fill="#94A3B8"
          stroke="#333333"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Nozzle tip */}
        <ellipse cx="72" cy="52" rx="4" ry="2.5" fill="#F9FAFB" stroke="#333333" strokeWidth="2" />
        {/* Small cross / medical indicator on label */}
        <rect x="67" y="110" width="10" height="4" rx="1" fill="#F20822" />
        <rect x="70" y="107" width="4" height="10" rx="1" fill="#F20822" />
      </g>

      {/* Fluid stream — droplets and wavy lines from bottle toward eye */}
      {/* Main fluid stream path */}
      <path
        d="M 76 55 Q 110 60 145 125 Q 165 148 190 145"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Inner brighter fluid line */}
      <path
        d="M 76 55 Q 110 60 145 125 Q 165 148 190 145"
        fill="none"
        stroke="#E2E8F0"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Droplets along the stream */}
      <circle cx="108" cy="62" r="3.5" fill="#BFDBFE" stroke="#333333" strokeWidth="1.5" opacity="1" />
      <circle cx="128" cy="88" r="4" fill="#BFDBFE" stroke="#333333" strokeWidth="1.5" opacity="1" />
      <circle cx="148" cy="118" r="3.5" fill="#BFDBFE" stroke="#333333" strokeWidth="1.5" opacity="1" />
      <circle cx="175" cy="143" r="4.5" fill="#BFDBFE" stroke="#333333" strokeWidth="1.5" opacity="1" />
      <circle cx="198" cy="145" r="2.5" fill="#BFDBFE" stroke="#333333" strokeWidth="1.5" opacity="1" />

      {/* Red fluid directional arrows — from inner to outer corner */}
      {/* Inner corner marker dot */}
      <circle cx="182" cy="145" r="5" fill="#F20822" stroke="#333333" strokeWidth="2" />
      {/* Outer corner marker dot */}
      <circle cx="248" cy="145" r="5" fill="#F20822" stroke="#333333" strokeWidth="2" />

      {/* Arrow 1 — mid stream */}
      <path
        d="M 185 148 Q 210 162 242 150"
        fill="none"
        stroke="#F20822"
        strokeWidth="3"
        strokeLinecap="round"
        markerEnd="url(#eye-arrowhead)"
      />
      {/* Arrow 2 — upper stream */}
      <path
        d="M 188 143 Q 215 158 240 145"
        fill="none"
        stroke="#F20822"
        strokeWidth="3"
        strokeLinecap="round"
        markerEnd="url(#eye-arrowhead)"
      />
      {/* Arrow 3 — lower stream */}
      <path
        d="M 185 150 Q 210 170 244 156"
        fill="none"
        stroke="#F20822"
        strokeWidth="2.5"
        strokeLinecap="round"
        markerEnd="url(#eye-arrowhead)"
        opacity="0.85"
      />

      {/* Red indicator ring around the eye flushing zone */}
      <ellipse
        cx="215"
        cy="145"
        rx="54"
        ry="34"
        fill="none"
        stroke="#F20822"
        strokeWidth="2.5"
        strokeDasharray="8 5"
        opacity="0.85"
      />

      {/* Red action target on outer corner — flush away point */}
      <g>
        <circle cx="256" cy="145" r="10" fill="none" stroke="#F20822" strokeWidth="2.5" opacity="0.7" />
        <circle cx="256" cy="145" r="5.5" fill="#F20822" stroke="#333333" strokeWidth="1.5" />
      </g>

      {/* Red pulse ring near outer corner */}
      <circle cx="256" cy="145" r="16" fill="none" stroke="#F20822" strokeWidth="1.5" opacity="0.35" />

      {/* Small red safety tick / check near the safe flush direction */}
      <path
        d="M 270 142 L 274 147 L 282 138"
        fill="none"
        stroke="#F20822"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
