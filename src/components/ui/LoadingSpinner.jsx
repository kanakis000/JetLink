import React from 'react';

export default function LoadingSpinner({ size = 36, style = {} }) {
  return (
    <svg
      style={{ display: 'block', margin: '0 auto', ...style }}
      width={size}
      height={size}
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="var(--ui-spinner-stroke)"
        strokeWidth="var(--ui-spinner-stroke-width)"
        strokeLinecap="round"
        strokeDasharray="31.415, 31.415"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
