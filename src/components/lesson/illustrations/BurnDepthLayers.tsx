import React from "react";

const STROKE = "#333333";

const BurnDepthLayers: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 280"
      role="img"
      aria-labelledby="burn-depth-layers-title"
      className={className}
      {...props}
    >
      <title id="burn-depth-layers-title">Burn Depth Layers</title>

      {/* Skin layers cross-section */}
      {/* Epidermis (top, light silver) */}
      <rect
        x="40"
        y="60"
        width="320"
        height="36"
        fill="#E8EAED"
        stroke={STROKE}
        strokeWidth="3"
      />
      {/* Dermis (middle, slate grey) */}
      <rect
        x="40"
        y="96"
        width="320"
        height="64"
        fill="#B8BFC6"
        stroke={STROKE}
        strokeWidth="3"
      />
      {/* Subcutaneous tissue (bottom, darker slate) */}
      <rect
        x="40"
        y="160"
        width="320"
        height="80"
        fill="#8A95A0"
        stroke={STROKE}
        strokeWidth="3"
      />

      {/* Burn depth indicators (Emergency Red shading) */}
      {/* 1st degree - epidermis only */}
      <rect
        x="60"
        y="60"
        width="70"
        height="36"
        fill="#FF0000"
        fillOpacity="0.75"
        stroke={STROKE}
        strokeWidth="2"
      />
      {/* 2nd degree - through dermis */}
      <rect
        x="160"
        y="60"
        width="70"
        height="80"
        fill="#FF0000"
        fillOpacity="0.75"
        stroke={STROKE}
        strokeWidth="2"
      />
      {/* Blister bubble on 2nd degree */}
      <ellipse
        cx="195"
        cy="58"
        rx="18"
        ry="10"
        fill="#F5D1D1"
        stroke={STROKE}
        strokeWidth="2.5"
      />
      {/* 3rd degree - full thickness */}
      <rect
        x="260"
        y="60"
        width="70"
        height="180"
        fill="#FF0000"
        fillOpacity="0.85"
        stroke={STROKE}
        strokeWidth="2"
      />

      {/* Labels for layers (left side) */}
      <line x1="40" y1="78" x2="20" y2="78" stroke={STROKE} strokeWidth="2" />
      <text x="18" y="82" textAnchor="end" fontSize="11" fill={STROKE} fontFamily="sans-serif">
        Epidermis
      </text>
      <line x1="40" y1="128" x2="20" y2="128" stroke={STROKE} strokeWidth="2" />
      <text x="18" y="132" textAnchor="end" fontSize="11" fill={STROKE} fontFamily="sans-serif">
        Dermis
      </text>
      <line x1="40" y1="200" x2="20" y2="200" stroke={STROKE} strokeWidth="2" />
      <text x="18" y="196" textAnchor="end" fontSize="11" fill={STROKE} fontFamily="sans-serif">
        Subcutaneous
      </text>
      <text x="18" y="210" textAnchor="end" fontSize="11" fill={STROKE} fontFamily="sans-serif">
        tissue
      </text>

      {/* Degree labels (bottom) */}
      <text
        x="95"
        y="262"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill={STROKE}
        fontFamily="sans-serif"
      >
        1st degree
      </text>
      <text
        x="195"
        y="262"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill={STROKE}
        fontFamily="sans-serif"
      >
        2nd degree
      </text>
      <text
        x="295"
        y="262"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill={STROKE}
        fontFamily="sans-serif"
      >
        3rd degree
      </text>

      {/* Outer border */}
      <rect
        x="40"
        y="60"
        width="320"
        height="180"
        fill="none"
        stroke={STROKE}
        strokeWidth="3"
      />
    </svg>
  );
};

export default BurnDepthLayers;
