import React from 'react';

const baseStyles = {
  padding: 'var(--ui-button-padding)',
  borderRadius: 'var(--ui-button-radius)',
  border: 'none',
  cursor: 'pointer',
  fontSize: 'var(--ui-button-font-size)',
};

const variants = {
  primary: {
    background: 'var(--ui-button-primary-bg)',
    color: 'var(--ui-button-primary-text)',
  },
  secondary: {
    background: 'var(--ui-button-secondary-bg)',
    color: 'var(--ui-button-secondary-text)',
  },
  link: {
    background: 'var(--ui-button-link-bg)',
    color: 'var(--ui-button-link-text)',
    padding: 'var(--ui-button-link-padding)',
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
      style={{ ...baseStyles, ...variantStyle, opacity: disabled ? 'var(--ui-button-disabled-opacity)' : 1, ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}
