/**
 * ShockManagementBlanket inline SVG illustration.
 *
 * Visual blueprint:
 * - Thick dark charcoal outlines (#333333)
 * - Flat 2D vector shapes with solid light-silver and slate-grey fills
 * - Vibrant Emergency Red accents for action targets
 *
 * Depiction: A flat-lying patient silhouette on a level floor grid.
 * A thick insulation layer blanket vector is draped completely over the torso
 * and limbs, leaving only the face exposed. Emergency Red thermal lock
 * indicator arrows point inward toward the chest core to signify heat retention.
 */

import { cn } from "@/lib/utils";

interface ShockManagementBlanketProps {
  className?: string;
}

export default function ShockManagementBlanket({ className }: ShockManagementBlanketProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0  0 400 260"
      preserveAspectRatio="xMidYMid meet"
      className={cn("block w-full max-w-md", className)}
      aria-labelledby="shock-blanket-title"
      role="img"
    >
      <title id="shock-blanket-title">Shock Management Blanket</title>

      {/* Definitions */}
      <defs>
        {/* Arrowhead for thermal lock arrows */}
        <marker
          id="thermal-arrow-head"
          markerWidth="10"
          markerHeight="10"
          refX="5"
          refY="5"
          orient="auto"
        >
          <polygon points="0 0, 10 5, 0 10" fill="#F20822" />
        </marker>
      </defs>

      {/* Background panel */}
      <rect x="1" y="1" width="398" height="258" fill="#F9FAFB" rx="12" />

      {/* Floor grid — horizontal perspective lines */}
      <line x1="20" y1="215" x2="380" y2="215" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="222" x2="360" y2="222" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="60" y1="229" x2="340" y2="229" stroke="#E2E8F0" strokeWidth="1" strokeLinecap="round" />

      {/* Floor grid — vertical perspective lines */}
      <line x1="80" y1="215" x2="60" y2="240" stroke="#E2E8F0" strokeWidth="1" strokeLinecap="round" />
      <line x1="200" y1="215" x2="200" y2="240" stroke="#E2E8F0" strokeWidth="1" strokeLinecap="round" />
      <line x1="320" y1="215" x2="340" y2="240" stroke="#E2E8F0" strokeWidth="1" strokeLinecap="round" />

      {/* Patient shadow on floor */}
      <ellipse cx="200" cy="218" rx="130" ry="14" fill="#CBD5E1" opacity="0.5" />

      {/* Head silhouette — face exposed, lying flat */}
      {/* Back of head / cranium */}
      <path
        d="M 70  115 Q 68  95  80  78 Q 95  60  120  60 Q 145  60  155  78 Q 162  95  160  115 Q 158  130  145  140 Q 130  148  115  148 Q 95  148  80  140 Q 72  130  70  115 Z"
        fill="#E5E7EB"
        stroke="#333333"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Face profile details (simplified, lying flat) */}
      {/* Forehead */}
      <path
        d="M 72  100 Q 70  85  80  75 Q 95  62  120  62"
        fill="none"
        stroke="#333333"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Eye (closed, relaxed) */}
      <path
        d="M 92  92 Q 102  88  112  92"
        fill="none"
        stroke="#333333"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 96  89 Q 102  86  108  89"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Nose */}
      <path
        d="M 72  100 Q 68  108  72  115"
        fill="none"
        stroke="#333333"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Mouth */}
      <path
        d="M 78  122 Q 88  124  100  122"
        fill="none"
        stroke="#333333"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Ear */}
      <path
        d="M 155  95 Q 162  100  160  112 Q 156  120  150  115 Q 146  108  150  100 Q 152  95  155  95 Z"
        fill="#CBD5E1"
        stroke="#333333"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Hair */}
      <path
        d="M 120  62 Q 140  58  152  70 Q 160  82  158  95 Q 156  85  148  75 Q 138  65  120  68 Q 100  72  85  85 Q 78  95  78  105 Q 76  92  82  78 Q 92  65  120  62 Z"
        fill="#94A3B8"
        stroke="#333333"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Neck */}
      <path
        d="M 145  135 Q 160  145  170  155 L 170  175 L 145  170 Z"
        fill="#E5E7EB"
        stroke="#333333"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Torso / body under blanket (subtle base shape) */}
      <path
        d="M 170  155 Q 200  145  250  148 Q 300  150  330  160 Q 350  170  355  185 Q 358  200  350  210 Q 340  218  310  220 Q 250  222  200  220 Q 160  218  140  210 Q 130  200  140  185 Q 150  165  170  155 Z"
        fill="#CBD5E1"
        stroke="#333333"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Legs under blanket (implied by blanket shape) */}
      {/* Left leg */}
      <path
        d="M 330  160 Q 360  165  375  180 Q 385  195  380  208 Q 375  218  360  218 Q 345  218  335  210 Q 325  200  330  185 Q 328  170  330  160 Z"
        fill="#CBD5E1"
        stroke="#333333"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Right leg (slightly lower, offset) */}
      <path
        d="M 340  175 Q 365  180  375  192 Q 382  205  378  215 Q 372  222  358  222 Q 348  222  340  215 Q 333  205  335  192 Q 335  182  340  175 Z"
        fill="#CBD5E1"
        stroke="#333333"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Blanket — thick insulation layer draped over torso and limbs */}
      {/* Main blanket body */}
      <path
        d="M 160  148
           Q 180  135  220  132
           Q 270  130  310  140
           Q 345  150  355  170
           Q 362  190  355  208
           Q 345  220  300  225
           Q 250  228  200  225
           Q 160  222  145  210
           Q 135  195  140  175
           Q 148  158  160  148 Z"
        fill="#E5E7EB"
        stroke="#333333"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Blanket fold / drape lines (insulation texture) */}
      <path
        d="M 180  148 Q 200  155  220  150"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 230  145 Q 260  152  290  148"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 310  155 Q 330  165  345  180"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 150  178 Q 170  188  195  185"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 210  185 Q 250  192  290  188"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 300  190 Q 325  198  340  205"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Blanket edge overlap (thickness illusion) */}
      <path
        d="M 160  148 Q 180  135  220  132"
        fill="none"
        stroke="#CBD5E1"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 145  210 Q 160  222  200  225"
        fill="none"
        stroke="#CBD5E1"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Chest core zone (target area for thermal retention) */}
      <ellipse
        cx="230"
        cy="175"
        rx="45"
        ry="28"
        fill="none"
        stroke="#F20822"
        strokeWidth="2"
        strokeDasharray="5 4"
        opacity="0.6"
      />

      {/* Emergency Red thermal lock indicator arrows pointing inward to chest core */}
      {/* Arrow from left side */}
      <line
        x1="165"
        y1="175"
        x2="195"
        y2="175"
        stroke="#F20822"
        strokeWidth="5"
        strokeLinecap="round"
        markerEnd="url(#thermal-arrow-head)"
      />
      <line
        x1="167"
        y1="175"
        x2="192"
        y2="175"
        stroke="#FF4D5A"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="1"
      />

      {/* Arrow from right side */}
      <line
        x1="295"
        y1="175"
        x2="265"
        y2="175"
        stroke="#F20822"
        strokeWidth="5"
        strokeLinecap="round"
        markerEnd="url(#thermal-arrow-head)"
      />
      <line
        x1="293"
        y1="175"
        x2="268"
        y2="175"
        stroke="#FF4D5A"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="1"
      />

      {/* Arrow from top side */}
      <line
        x1="230"
        y1="138"
        x2="230"
        y2="158"
        stroke="#F20822"
        strokeWidth="5"
        strokeLinecap="round"
        markerEnd="url(#thermal-arrow-head)"
      />
      <line
        x1="230"
        y1="140"
        x2="230"
        y2="160"
        stroke="#FF4D5A"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="1"
      />

      {/* Arrow from bottom side */}
      <line
        x1="230"
        y1="212"
        x2="230"
        y2="192"
        stroke="#F20822"
        strokeWidth="5"
        strokeLinecap="round"
        markerEnd="url(#thermal-arrow-head)"
      />
      <line
        x1="230"
        y1="210"
        x2="230"
        y2="190"
        stroke="#FF4D5A"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="1"
      />

      {/* Diagonal inward arrows (corners toward core) */}
      {/* Top-left to center */}
      <line
        x1="190"
        y1="150"
        x2="210"
        y2="165"
        stroke="#F20822"
        strokeWidth="4"
        strokeLinecap="round"
        markerEnd="url(#thermal-arrow-head)"
      />
      {/* Top-right to center */}
      <line
        x1="270"
        y1="150"
        x2="250"
        y2="165"
        stroke="#F20822"
        strokeWidth="4"
        strokeLinecap="round"
        markerEnd="url(#thermal-arrow-head)"
      />
      {/* Bottom-left to center */}
      <line
        x1="190"
        y1="200"
        x2="210"
        y2="185"
        stroke="#F20822"
        strokeWidth="4"
        strokeLinecap="round"
        markerEnd="url(#thermal-arrow-head)"
      />
      {/* Bottom-right to center */}
      <line
        x1="270"
        y1="200"
        x2="250"
        y2="185"
        stroke="#F20822"
        strokeWidth="4"
        strokeLinecap="round"
        markerEnd="url(#thermal-arrow-head)"
      />

      {/* Red action target dot at chest core */}
      <circle cx="230" cy="175" r="5" fill="#F20822" />
      <circle cx="230" cy="175" r="9" fill="none" stroke="#F20822" strokeWidth="1.5" />

      {/* Pulse ring around chest core */}
      <circle cx="230" cy="175" r="14" fill="none" stroke="#F20822" strokeWidth="1.5" opacity="0.8">
        <animate
          attributeName="r"
          values="14;20;14"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.8;1;0.8"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Small thermal accent dots around chest */}
      <circle cx="200" cy="165" r="3" fill="#F20822" opacity="0.8" />
      <circle cx="260" cy="165" r="3" fill="#F20822" opacity="0.8" />
      <circle cx="200" cy="185" r="3" fill="#F20822" opacity="0.8" />
      <circle cx="260" cy="185" r="3" fill="#F20822" opacity="0.8" />

      {/* Subtle heat wave arcs around the body */}
      <path
        d="M 150  140 Q 170  125  200  128"
        fill="none"
        stroke="#F20822"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M 260  128 Q 290  125  310  140"
        fill="none"
        stroke="#F20822"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M 140  190 Q 160  208  200  210"
        fill="none"
        stroke="#F20822"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M 260  210 Q 300  208  320  190"
        fill="none"
        stroke="#F20822"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Blanket thickness / insulation indicator lines near edges */}
      <path
        d="M 168  145 Q 185  138  205  136"
        fill="none"
        stroke="#475569"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M 320  155 Q 335  165  345  180"
        fill="none"
        stroke="#475569"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Small text node for screen readers / i18n (hidden) */}
      <text x="0" y="0" fontSize="0" fill="none" aria-hidden="true">
        Patient lying flat on floor covered by an insulation blanket with only face exposed, red thermal arrows pointing inward toward chest core
      </text>
    </svg>
  );
}
