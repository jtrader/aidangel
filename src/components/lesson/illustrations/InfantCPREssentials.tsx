interface Props {
  className?: string;
  title?: string;
}

/**
 * Infant CPR Essentials
 * Simplified side profile of an infant lying flat on a firm surface.
 * A hand model applies chest compressions using exactly two fingers
 * (index and middle) on the centre of the chest, just below the nipple line.
 * A vertical Emergency Red arrow marks the precise 1.5-inch (4 cm) compression depth.
 */
export default function InfantCPREssentials({
  className,
  title = "Infant lying on a firm surface with two-finger chest compressions at 1.5-inch depth",
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
      aria-labelledby="infant-cpr-title"
    >
      <title id="infant-cpr-title">{title}</title>

      <defs>
        <marker
          id="cpr-depth-arrow"
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

      {/* Firm surface / ground line */}
      <line x1="30" y1="215" x2="370" y2="215"
        stroke={SLATE_2} strokeWidth="2" strokeDasharray="4 6" />

      {/* === Infant body (side profile, lying flat) === */}
      {/* Head — large relative to body for baby proportions */}
      <ellipse cx="82" cy="148" rx="38" ry="32"
        fill={SILVER} stroke={OUTLINE} strokeWidth="2.5" />
      {/* Ear */}
      <ellipse cx="108" cy="148" rx="6" ry="10"
        fill={SILVER_2} stroke={OUTLINE} strokeWidth="2" />
      {/* Eye (closed, sleeping profile) */}
      <path d="M68 142 Q74 146 80 142"
        fill="none" stroke={OUTLINE} strokeWidth="2" strokeLinecap="round" />
      {/* Nose */}
      <path d="M56 148 L52 154"
        fill="none" stroke={OUTLINE} strokeWidth="2" strokeLinecap="round" />
      {/* Mouth */}
      <path d="M56 158 Q60 162 64 158"
        fill="none" stroke={OUTLINE} strokeWidth="1.8" strokeLinecap="round" />

      {/* Neck */}
      <path d="M114 168 L114 178 L138 178 L138 168 Z"
        fill={SILVER_2} stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />

      {/* Torso / chest */}
      <path
        d="M138 168
           L310 168
           Q340 168 340 190
           L340 210
           Q340 215 310 215
           L138 215 Z"
        fill={SILVER}
        stroke={OUTLINE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Nipple line marker (subtle dashed line) */}
      <line x1="170" y1="178" x2="310" y2="178"
        stroke={SLATE_2} strokeWidth="1.5" strokeDasharray="3 4" opacity="1" />

      {/* Abdomen / navel area */}
      <ellipse cx="280" cy="195" rx="8" ry="5" fill={SILVER_2} stroke={OUTLINE} strokeWidth="1.5" />

      {/* Left arm (upper, behind torso) */}
      <path
        d="M150 172
           Q120 180 110 200
           Q108 212 118 214"
        fill="none" stroke={OUTLINE} strokeWidth="8" strokeLinecap="round" />
      <path
        d="M150 172
           Q120 180 110 200
           Q108 212 118 214"
        fill="none" stroke={SILVER} strokeWidth="4" strokeLinecap="round" />

      {/* Right arm (lower, reaching forward) */}
      <path
        d="M220 172
           Q260 180 280 200
           Q290 210 300 212"
        fill="none" stroke={OUTLINE} strokeWidth="8" strokeLinecap="round" />
      <path
        d="M220 172
           Q260 180 280 200
           Q290 210 300 212"
        fill="none" stroke={SILVER} strokeWidth="4" strokeLinecap="round" />

      {/* Left leg */}
      <path
        d="M330 210
           Q360 210 370 205
           Q380 200 382 195"
        fill="none" stroke={OUTLINE} strokeWidth="9" strokeLinecap="round" />
      <path
        d="M330 210
           Q360 210 370 205
           Q380 200 382 195"
        fill="none" stroke={SILVER} strokeWidth="5" strokeLinecap="round" />
      {/* Left foot */}
      <ellipse cx="388" cy="192" rx="10" ry="7" fill={SILVER} stroke={OUTLINE} strokeWidth="2" />

      {/* Right leg (bent slightly) */}
      <path
        d="M330 215
           Q350 230 360 225
           Q372 220 375 215"
        fill="none" stroke={OUTLINE} strokeWidth="9" strokeLinecap="round" />
      <path
        d="M330 215
           Q350 230 360 225
           Q372 220 375 215"
        fill="none" stroke={SILVER} strokeWidth="5" strokeLinecap="round" />
      {/* Right foot */}
      <ellipse cx="382" cy="212" rx="9" ry="6" fill={SILVER} stroke={OUTLINE} strokeWidth="2" />

      {/* === Two fingers (index + middle) on chest === */}
      {/* Wrist / hand base */}
      <path
        d="M180 80
           Q195 80 200 90
           L220 150
           L190 150
           L170 90 Z"
        fill={SLATE}
        stroke={OUTLINE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Index finger — pressing down onto chest */}
      <path
        d="M215 145
           L232 145
           L236 175
           Q236 182 228 182
           L214 182
           L210 150 Z"
        fill={SILVER}
        stroke={OUTLINE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Middle finger — pressing down onto chest */}
      <path
        d="M200 148
           L217 148
           L221 178
           Q221 185 213 185
           L199 185
           L195 153 Z"
        fill={SILVER_2}
        stroke={OUTLINE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Finger knuckle lines */}
      <path d="M214 158 L230 156" stroke={OUTLINE} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M200 160 L216 158" stroke={OUTLINE} strokeWidth="1.2" strokeLinecap="round" opacity="1" />

      {/* === Compression depth indicator === */}
      {/* Vertical red action arrow (1.5 in / 4 cm) */}
      <line
        x1="260" y1="80"
        x2="260" y2="170"
        stroke={RED} strokeWidth="4"
        markerEnd="url(#cpr-depth-arrow)"
      />

      {/* Depth measurement bracket lines */}
      <line x1="250" y1="80" x2="270" y2="80" stroke={RED} strokeWidth="2" />
      <line x1="250" y1="170" x2="270" y2="170" stroke={RED} strokeWidth="2" />

      {/* Depth label */}
      <text x="280" y="128" fontSize="12" fontWeight="bold" fill={RED} fontFamily="sans-serif">
        4 cm / 1.5 in
      </text>

      {/* Inward pressure arrows pointing to finger contact zone */}
      <line x1="150" y1="160" x2="195" y2="160"
        stroke={RED} strokeWidth="3" markerEnd="url(#cpr-depth-arrow)" />
      <line x1="270" y1="160" x2="240" y2="160"
        stroke={RED} strokeWidth="3" markerEnd="url(#cpr-depth-arrow)" />

      {/* Red focus ring around the compression target zone */}
      <ellipse cx="218" cy="165" rx="42" ry="22"
        fill="none" stroke={RED_LT} strokeWidth="2" strokeDasharray="3 5" opacity="1" />

      {/* Hidden caption for screen readers */}
      <text x="200" y="244" textAnchor="middle"
        fontSize="11" fill={SLATE} fontFamily="sans-serif">
        Use two fingers on the centre of the chest, just below the nipple line.
      </text>
    </svg>
  );
}
