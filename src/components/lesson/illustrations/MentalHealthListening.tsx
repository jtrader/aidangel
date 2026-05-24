interface MentalHealthListeningProps {
  className?: string;
  title?: string;
}

export default function MentalHealthListening({ className, title }: MentalHealthListeningProps) {
  return (
    <svg
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={title || "Two people actively listening to each other"}
    >
      {title && <title>{title}</title>}

      {/* Abstract silver-grey bridge arc connecting the two profiles */}
      <path
        d="M 145 145 Q 200 85 255 145"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Inner accent line for the bridge */}
      <path
        d="M 150 150 Q 200 95 250 150"
        fill="none"
        stroke="#CBD5E1"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Bridge end dots */}
      <circle cx="145" cy="145" r="4" fill="#94A3B8" stroke="#333333" strokeWidth="1.5" />
      <circle cx="255" cy="145" r="4" fill="#94A3B8" stroke="#333333" strokeWidth="1.5" />

      {/* Left head profile — facing right */}
      <g>
        {/* Head shape */}
        <path
          d="M 75 210
             C 45 210, 30 180, 30 145
             C 30 105, 55 75, 90 75
             C 115 75, 130 95, 135 115
             L 135 145
             C 135 165, 125 180, 115 190
             L 100 210
             Z"
          fill="#E5E7EB"
          stroke="#333333"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Eye */}
        <ellipse cx="95" cy="125" rx="7" ry="5" fill="#475569" stroke="#333333" strokeWidth="2" />
        {/* Nose */}
        <path d="M 118 135 Q 128 145 118 155" fill="none" stroke="#333333" strokeWidth="2.5" strokeLinecap="round" />
        {/* Mouth — gentle, open listening expression */}
        <path d="M 105 170 Q 115 175 125 168" fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
        {/* Ear */}
        <ellipse cx="72" cy="138" rx="7" ry="12" fill="#E5E7EB" stroke="#333333" strokeWidth="2.5" />
        <path d="M 72 132 Q 68 138 72 144" fill="none" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" />
        {/* Hair suggestion */}
        <path d="M 38 120 Q 50 78 90 72 Q 125 68 132 105" fill="none" stroke="#333333" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Right head profile — facing left */}
      <g>
        {/* Head shape */}
        <path
          d="M 325 210
             C 355 210, 370 180, 370 145
             C 370 105, 345 75, 310 75
             C 285 75, 270 95, 265 115
             L 265 145
             C 265 165, 275 180, 285 190
             L 300 210
             Z"
          fill="#E5E7EB"
          stroke="#333333"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Eye */}
        <ellipse cx="305" cy="125" rx="7" ry="5" fill="#475569" stroke="#333333" strokeWidth="2" />
        {/* Nose */}
        <path d="M 282 135 Q 272 145 282 155" fill="none" stroke="#333333" strokeWidth="2.5" strokeLinecap="round" />
        {/* Mouth — gentle, open listening expression */}
        <path d="M 295 170 Q 285 175 275 168" fill="none" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
        {/* Ear — this one becomes the focus badge ear */}
        <ellipse cx="328" cy="138" rx="7" ry="12" fill="#E5E7EB" stroke="#333333" strokeWidth="2.5" />
        <path d="M 328 132 Q 332 138 328 144" fill="none" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" />
        {/* Hair suggestion */}
        <path d="M 362 120 Q 350 78 310 72 Q 275 68 268 105" fill="none" stroke="#333333" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Slate-grey ear icon badge on the right profile */}
      <g>
        {/* Badge background circle */}
        <circle cx="328" cy="138" r="20" fill="#475569" stroke="#333333" strokeWidth="2.5" />
        {/* Stylized ear icon inside badge */}
        <path
          d="M 324 128
             C 316 128, 312 138, 316 146
             C 320 152, 328 150, 332 144
             C 336 138, 334 130, 328 128
             C 322 126, 318 132, 320 138
             C 322 142, 326 142, 328 138"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* Emergency Red circular focus frame around the ear badge */}
      <circle cx="328" cy="138" r="28" fill="none" stroke="#F20822" strokeWidth="3" strokeDasharray="6 4" opacity="0.9" />
      {/* Red pulse ring */}
      <circle cx="328" cy="138" r="34" fill="none" stroke="#F20822" strokeWidth="1.5" opacity="0.35" />

      {/* Red accent dots along the bridge to show active connection */}
      <circle cx="170" cy="120" r="3.5" fill="#F20822" opacity="0.85" />
      <circle cx="200" cy="105" r="4" fill="#F20822" opacity="1" />
      <circle cx="230" cy="120" r="3.5" fill="#F20822" opacity="0.85" />

      {/* Small red sound/connection wave arcs near the bridge */}
      <path d="M 180 110 Q 200 92 220 110" fill="none" stroke="#F20822" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M 185 118 Q 200 100 215 118" fill="none" stroke="#F20822" strokeWidth="1.5" strokeLinecap="round" opacity="1" />

      {/* Subtle red action target near left profile — indicating speaking/listening */}
      <circle cx="130" cy="145" r="5" fill="#F20822" stroke="#333333" strokeWidth="1.5" opacity="1" />
      <circle cx="130" cy="145" r="10" fill="none" stroke="#F20822" strokeWidth="1.5" opacity="0.5" />

      {/* Subtle red target near right profile mouth */}
      <circle cx="270" cy="145" r="5" fill="#F20822" stroke="#333333" strokeWidth="1.5" opacity="0.85" />
      <circle cx="270" cy="145" r="10" fill="none" stroke="#F20822" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}
