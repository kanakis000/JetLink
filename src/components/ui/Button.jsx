import React from 'react';

const baseStyles = {
  padding: '8px 14px',
  borderRadius: 6,
  border: 'none',
  cursor: 'pointer',
  fontSize: 14,
};

const variants = {
  primary: {
    background: '#0b66ff',
    color: '#fff',
  },
  secondary: {
    background: '#f3f4f6',
    color: '#111827',
  },
  link: {
    background: 'transparent',
    color: '#0b66ff',
    padding: 0,
  },
};

export default function Button({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  style = {},
  ...rest
}) {
  const variantStyle = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{ ...baseStyles, ...variantStyle, opacity: disabled ? 0.6 : 1, ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}
