import React from 'react';

const cardStyle = {
  background: '#fff',
  borderRadius: 8,
  padding: 16,
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
};

export default function Card({ title, children, footer, className = '', style = {} }) {
  return (
    <div className={className} style={{ ...cardStyle, ...style }}>
      {title && <h4 style={{ marginTop: 0 }}>{title}</h4>}
      <div>{children}</div>
      {footer && <div style={{ marginTop: 12 }}>{footer}</div>}
    </div>
  );
}
