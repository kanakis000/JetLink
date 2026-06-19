import React from 'react';

const baseStyles = {
  padding: 'var(--ui-input-padding)',
  borderRadius: 'var(--ui-input-radius)',
  border: 'var(--ui-input-border)',
  fontSize: 'var(--ui-input-font-size)',
  width: '100%',
  boxSizing: 'border-box',
};

export default function Input({
  value,
  onChange,
  type = 'text',
  placeholder = '',
  name,
  className = '',
  style = {},
  ...rest
}) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      style={{ ...baseStyles, ...style }}
      {...rest}
    />
  );
}
