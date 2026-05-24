import React from "react";

interface AsthmaInhalerSpacerProps {
  title?: string;
  className?: string;
}

const AsthmaInhalerSpacer: React.FC<AsthmaInhalerSpacerProps> = ({
  title = "Asthma inhaler with spacer",
  className,
}) => {
  return (
    <svg
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>

      {/* Base surface line */}
      <line
        x1="30"
        y1="235"
        x2="370"
        y2="235"
        stroke="#333333"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Spacer chamber — main horizontal tube */}
      <rect
        x="80"
        y="130"
        width="200"
        height="60"
        rx="30"
        fill="#E5E7EB"
        stroke="#333333"
        strokeWidth="3"
      />

      {/* Inner hollow cavity */}
      <rect
        x="95"
        y="145"
        width="170"
        height="30"
        rx="15"
        fill="#F9FAFB"
        stroke="#333333"
        strokeWidth="2"
      />

      {/* Face-mask connector (left end) */}
      <path
        d="M 80 142 L 50 148 L 50 172 L 80 178 Z"
        fill="#D1D5DB"
        stroke="#333333"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect
        x="30"
        y="148"
        width="22"
        height="30"
        rx="7"
        fill="#E5E7EB"
        stroke="#333333"
        strokeWidth="3"
      />

      {/* Inhaler docking port on top of spacer */}
      <ellipse
        cx="160"
        cy="130"
        rx="20"
        ry="9"
        fill="#475569"
        stroke="#333333"
        strokeWidth="3"
      />

      {/* Inhaler canister — blue puffer body */}
      <rect
        x="142"
        y="35"
        width="36"
        height="100"
        rx="5"
        fill="#93C5FD"
        stroke="#333333"
        strokeWidth="3"
      />
      {/* Canister top cap */}
      <rect
        x="140"
        y="25"
        width="40"
        height="15"
        rx="4"
        fill="#60A5FA"
        stroke="#333333"
        strokeWidth="3"
      />
      {/* Canister label band */}
      <rect
        x="142"
        y="70"
        width="36"
        height="20"
        rx="2"
        fill="#BFDBFE"
        stroke="#333333"
        strokeWidth="2"
      />
      {/* Valve stem entering spacer */}
      <rect
        x="150"
        y="130"
        width="20"
        height="14"
        rx="3"
        fill="#475569"
        stroke="#333333"
        strokeWidth="3"
      />

      {/* Red puff activation starburst ring at valve connection */}
      <g transform="translate(160, 144)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="0"
            y1="0"
            x2="0"
            y2="-16"
            stroke="#F20822"
            strokeWidth="4"
            strokeLinecap="round"
            transform={`rotate(${angle})`}
          />
        ))}
        <circle
          cx="0"
          cy="0"
          r="8"
          fill="none"
          stroke="#F20822"
          strokeWidth="3"
        />
        <circle cx="0" cy="0" r="3" fill="#F20822" />
      </g>

      {/* Right end cap */}
      <rect
        x="275"
        y="135"
        width="25"
        height="50"
        rx="10"
        fill="#D1D5DB"
        stroke="#333333"
        strokeWidth="3"
      />

      {/* Aerosol mist lines inside spacer */}
      <line
        x1="115"
        y1="158"
        x2="150"
        y2="158"
        stroke="#333333"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      <line
        x1="125"
        y1="166"
        x2="160"
        y2="166"
        stroke="#333333"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
};

export default React.memo(AsthmaInhalerSpacer);
