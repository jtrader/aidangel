/**
 * NosebleedManagement inline SVG illustration.
 *
 * Visual blueprint:
 * - Thick dark charcoal outlines (#333333)
 * - Flat 2D vector shapes with solid light-silver and slate-grey fills
 * - Vibrant Emergency Red accents for action targets
 *
 * Depiction: A clean side profile of a human head distinctly tilting slightly
 * forward over a flat ground plane. A hand model gently pinches the soft lower
 * part of the nose structure. A prominent Emergency Red compression force
 * arrow pushes directly against the nostrils, paired with a downward forward
 * tilt angle arc.
 */

import { cn } from "@/lib/utils";

interface NosebleedManagementProps {
  className?: string;
}

export default function NosebleedManagement({ className }: NosebleedManagementProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid meet"
      className={cn("block w-full max-w-md", className)}
      aria-labelledby="nosebleed-title"
      role="img"
    >
      <title id="nosebleed-title">Nosebleed Management</title>

      {/* Definitions: arrowheads and markers */}
      <defs>
        {/* Arrowhead for compression force */}
        <marker
          id="nose-compress-head"
          markerWidth="10"
          markerHeight="10"
          refX="0"
          refY="5"
          orient="auto"
        >
          <polygon points="0 0, 10 5, 1 9" fill="#F20822" />
        </marker>

        {/* Arrowhead for tilt arc */}
        <marker
          id="nose-tilt-head"
          markerWidth="8"
          markerHeight="8"
          refX="0"
          refY="4"
          orient="auto"
        >
          <polygon points="0 0, 8 4, 0 8" fill="#F20822" />
        </marker>
      </defs>

      {/* Background panel */}
      <rect x="0" y="0" width="400" height="260" fill="#F9FAFB" rx="12" />

      {/* Flat ground plane */}
      <line x1="20" y1="235" x2="380" y2="235" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="240" x2="360" y2="240" stroke="#E2E8F0" strokeWidth="1" strokeLinecap="round" />

      {/* Forward tilt angle arc (ground reference) */}
      <path
        d="M 160 235 A 55 55 2 0 1 200 182"
        fill="none"
        stroke="#F20822"
        strokeWidth="2"
        strokeDasharray="4 3"
        opacity="0.85"
      />
      <path
        d="M 192 184 L 200 182 L 196 191"
        fill="none"
        stroke="#F20822"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Shoulders / body (partial, behind head) */}
      <path
        d="M 210 155 Q 250 155 270 200 Q 280 230 280 235 L 190 235 L 190 170 Z"
        fill="#E5E7EB"
        stroke="#333333"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Neck */}
      <path
        d="M 165 130 L 190 130 L 195 170 L 160 165 Z"
        fill="#E5E7EB"
        stroke="#333333"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Head silhouette - side profile, tilted forward */}
      {/* Chin/jaw */}
      <path
        d="M 115 135 Q 110 145 112 150 Q 115 158 130 162 Q 145 166 160 165 L 165 130 Z"
        fill="#E5E7EB"
        stroke="#333333"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Back of head / cranium */}
      <path
        d="M 165 130 Q 195 90 185 60 Q 175 35 140 40 Q 110 50 105 90 Q 100 120 115 135 Z"
        fill="#E5E7EB"
        stroke="#333333"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Forehead / brow ridge area */}
      <path
        d="M 105 90 Q 102 75 110 65 Q 120 55 140 40"
        fill="none"
        stroke="#333333"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Nose bridge */}
      <path
        d="M 110 65 Q 100 80 95 105 Q 92 120 98 128"
        fill="none"
        stroke="#333333"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Nose tip and nostril area */}
      <path
        d="M 98 128 Q 94 135 96 140 Q 100 145 112 150"
        fill="none"
        stroke="#333333"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Nostril detail */}
      <ellipse cx="101" cy="142" rx="3.5" ry="2" fill="#CBD5E1" stroke="#333333" strokeWidth="1.5" />

      {/* Mouth / lips (slightly open, head tilted forward) */}
      <path
        d="M 118 158 Q 128 162 138 160"
        fill="none"
        stroke="#333333"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 120 156 Q 128 158 135 157"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Eye (closed or simplified) */}
      <path
        d="M 118 88 Q 130 82 140 86"
        fill="none"
        stroke="#333333"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 122 84 Q 130 80 136 83"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Ear (side profile) */}
      <path
        d="M 165 90 Q 180 85 182 105 Q 178 118 168 112 Q 160 105 165 90 Z"
        fill="#CBD5E1"
        stroke="#333333"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M 170 95 Q 175 98 172 108"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Hair outline */}
      <path
        d="M 140 40 Q 160 30 175 38 Q 190 48 185 60 Q 180 55 165 48 Q 145 42 135 52 Q 120 60 115 80 Q 108 95 110 105 Q 108 85 115 65 Q 125 45 140 40 Z"
        fill="#94A3B8"
        stroke="#333333"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Hand model pinching the soft lower nose */}
      {/* Thumb */}
      <path
        d="M 60 115 Q 80 105 98 120 Q 102 130 98 135 Q 88 132 82 125 Q 70 120 60 115 Z"
        fill="#E5E7EB"
        stroke="#333333"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Index finger */}
      <path
        d="M 65 145 Q 85 135 100 140 Q 105 145 100 150 Q 92 148 85 150 Q 75 152 65 145 Z"
        fill="#E5E7EB"
        stroke="#333333"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Middle finger */}
      <path
        d="M 68 155 Q 85 148 98 152 Q 103 156 98 160 Q 90 158 82 160 Q 75 162 68 155 Z"
        fill="#E5E7EB"
        stroke="#333333"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Hand back / wrist area */}
      <path
        d="M 55 110 Q 40 125 48 145 Q 55 165 70 170 Q 90 175 100 165 Q 105 155 98 145 L 95 140 L 65 120 Z"
        fill="#CBD5E1"
        stroke="#333333"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Finger nail highlights */}
      <ellipse cx="92" cy="126" rx="2" ry="3" fill="#E5E7EB" stroke="#94A3B8" strokeWidth="1" />
      <ellipse cx="94" cy="146" rx="2" ry="2.5" fill="#E5E7EB" stroke="#94A3B8" strokeWidth="1" />
      <ellipse cx="92" cy="156" rx="2" ry="2.5" fill="#E5E7EB" stroke="#94A3B8" strokeWidth="1" />

      {/* Red boundary indicator ring around nose pinch zone */}
      <ellipse
        cx="85"
        cy="135"
        rx="35"
        ry="25"
        fill="none"
        stroke="#F20822"
        strokeWidth="2"
        strokeDasharray="5 4"
        opacity="0.7"
      />

      {/* Emergency Red compression force arrow pushing directly against nostrils */}
      <line
        x1="30"
        y1="135"
        x2="78"
        y2="135"
        stroke="#F20822"
        strokeWidth="5"
        strokeLinecap="round"
        markerEnd="url(#nose-compress-head)"
      />
      {/* Arrow shaft highlight */}
      <line
        x1="32"
        y1="135"
        x2="70"
        y2="135"
        stroke="#FF4D5A"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Small red action target dot at nose pinch point */}
      <circle cx="99" cy="138" r="4" fill="#F20822" />
      <circle cx="99" cy="138" r="7" fill="none" stroke="#F20822" strokeWidth="1.5" opacity="1" />

      {/* Pulse ring around action target */}
      <circle cx="99" cy="138" r="11" fill="none" stroke="#F20822" strokeWidth="1.5" opacity="0.8">
        <animate
          attributeName="r"
          values="11;16;11"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.8; 1; 0.8"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Forward tilt indicator arrow (showing head-tilt direction) */}
      <path
        d="M 145 185 Q 125 210 95 220"
        fill="none"
        stroke="#F20822"
        strokeWidth="3"
        strokeLinecap="round"
        markerEnd="url(#nose-tilt-head)"
        opacity="0.9"
      />
      {/* Tilt label area — small action dot */}
      <circle cx="95" cy="220" r="3" fill="#F20822" />

      {/* Blood droplets (subtle, showing forward flow) */}
      <circle cx="105" cy="155" r="2.5" fill="#F20822" opacity="0.85" />
      <circle cx="110" cy="165" r="3" fill="#F20822" opacity="0.7" />
      <circle cx="118" cy="175" r="2" fill="#F20822" opacity="1" />
      {/* Droplet trails */}
      <path d="M 105 158 Q 107 162 110 165" fill="none" stroke="#F20822" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M 110 168 Q 114 172 118 175" fill="none" stroke="#F20822" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

      {/* Subtle forward lean emphasis lines */}
      <path d="M 140 170 L 130 180" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" opacity="1" />
      <path d="M 148 175 L 138 185" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" opacity="1" />
      <path d="M 155 180 L 145 190" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" opacity="1" />

      {/* Small text node for screen readers / i18n (hidden) */}
      <text x="0" y="0" fontSize="0" fill="none" aria-hidden="true">
        Side profile of head tilting forward with hand pinching nose, compression arrow, and tilt arc
      </text>
    </svg>
  );
}
