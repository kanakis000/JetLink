import React from 'react';

const baseStyles = {
  padding: '8px 10px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  fontSize: 14,
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
