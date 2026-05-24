interface Props {
  className?: string;
  title?: string;
}

/**
 * Sprain Compression Wrap
 * Side profile of an ankle and foot with an elastic bandage wrapped in an
 * overlapping figure-eight around the joint. A bold Emergency Red tension
 * indicator band winds alongside the slate-grey wrap layers to convey
 * supportive compression without cutting off circulation.
 */
export default function SprainCompressionWrap({
  className,
  title = "Elastic compression bandage wrapped in a figure-eight around the ankle",
}: Props) {
  const OUTLINE = "#333333";
  const SILVER = "#E5E7EB";
  const SILVER_2 = "#CBD5E1";
  const SLATE = "#475569";
  const SLATE_2 = "#94A3B8";
  const RED = "#F20822";
  const RED_LT = "#FF4D5A";

  return (
    <svg
      className={className}
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="sprain-wrap-title"
    >
      <title id="sprain-wrap-title">{title}</title>

      <defs>
        <marker
          id="sprain-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={RED} />
        </marker>
      </defs>

      {/* Ground line */}
      <line x1="30" y1="220" x2="370" y2="220"
        stroke={SLATE_2} strokeWidth="2" strokeDasharray="4 6" />

      {/* === Leg & ankle & foot profile (side view) === */}
      {/* Lower leg (shin/calf), tapering down to the ankle */}
      <path
        d="M170 40
           L230 40
           L222 150
           L178 150 Z"
        fill={SILVER}
        stroke={OUTLINE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Ankle joint */}
      <path
        d="M178 150
           L222 150
           L228 178
           L172 178 Z"
        fill={SILVER_2}
        stroke={OUTLINE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Heel */}
      <path
        d="M172 178
           L228 178
           L228 210
           L196 218
           L172 210 Z"
        fill={SILVER}
        stroke={OUTLINE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Foot extending forward */}
      <path
        d="M196 218
           L320 214
           Q332 214 332 200
           L228 200
           L228 210 Z"
        fill={SILVER}
        stroke={OUTLINE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Ankle bone marker */}
      <circle cx="200" cy="170" r="4" fill={SLATE_2} stroke={OUTLINE} strokeWidth="1.5" />

      {/* === Slate-grey bandage layers (figure-eight wrap) === */}
      {/* Bandage layer 1: across top of foot, up & around back of ankle */}
      <path
        d="M300 198
           Q260 188 220 178
           Q190 170 178 158
           Q174 152 180 146
           Q210 140 232 152"
        fill="none"
        stroke={SLATE}
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M300 198
           Q260 188 220 178
           Q190 170 178 158
           Q174 152 180 146
           Q210 140 232 152"
        fill="none"
        stroke={OUTLINE}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Bandage layer 2: crossing back under heel and up the inside */}
      <path
        d="M232 152
           Q220 162 210 174
           Q200 188 196 204
           Q204 214 222 214
           Q260 210 296 208"
        fill="none"
        stroke={SLATE_2}
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M232 152
           Q220 162 210 174
           Q200 188 196 204
           Q204 214 222 214
           Q260 210 296 208"
        fill="none"
        stroke={OUTLINE}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Bandage layer 3: second pass higher up the ankle for overlap */}
      <path
        d="M286 196
           Q244 184 214 168
           Q188 158 182 140
           Q188 130 210 128
           Q230 132 238 144"
        fill="none"
        stroke={SLATE}
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.95"
      />
      <path
        d="M286 196
           Q244 184 214 168
           Q188 158 182 140
           Q188 130 210 128
           Q230 132 238 144"
        fill="none"
        stroke={OUTLINE}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Wrap edge stitches / texture lines */}
      <path d="M196 142 L208 138 M210 156 L222 152 M212 174 L222 170 M218 192 L232 188 M240 200 L256 196 M262 202 L278 198"
        stroke={OUTLINE} strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />

      {/* === Emergency Red tension indicator band (figure-eight) === */}
      {/* Top arc of figure-eight */}
      <path
        d="M236 144
           Q210 134 196 144
           Q188 156 198 166
           Q214 174 232 168"
        fill="none"
        stroke={RED}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Crossover & bottom arc beneath the heel */}
      <path
        d="M232 168
           Q220 178 210 192
           Q204 206 220 210
           Q252 208 280 204"
        fill="none"
        stroke={RED}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Tick marks along the red tension band */}
      <g stroke={RED_LT} strokeWidth="2" strokeLinecap="round">
        <line x1="208" y1="140" x2="206" y2="134" />
        <line x1="220" y1="142" x2="220" y2="136" />
        <line x1="208" y1="170" x2="206" y2="176" />
        <line x1="222" y1="172" x2="224" y2="178" />
        <line x1="240" y1="200" x2="242" y2="206" />
        <line x1="260" y1="202" x2="262" y2="208" />
      </g>

      {/* Inward compression arrows around the joint */}
      <line x1="160" y1="158" x2="176" y2="158"
        stroke={RED} strokeWidth="3" markerEnd="url(#sprain-arrow)" />
      <line x1="252" y1="158" x2="236" y2="158"
        stroke={RED} strokeWidth="3" markerEnd="url(#sprain-arrow)" />
      <line x1="206" y1="100" x2="206" y2="116"
        stroke={RED} strokeWidth="3" markerEnd="url(#sprain-arrow)" />

      {/* Focus ring around the joint */}
      <circle cx="208" cy="170" r="50"
        fill="none" stroke={RED_LT} strokeWidth="2" strokeDasharray="3 5" opacity="0.85" />

      {/* Hidden caption for screen readers */}
      <text x="200" y="244" textAnchor="middle"
        fontSize="11" fill={SLATE} fontFamily="sans-serif">
        Firm but not tight — check toes stay warm and pink.
      </text>
    </svg>
  );
}
