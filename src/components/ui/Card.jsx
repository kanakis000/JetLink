import React from 'react';

const cardStyle = {
  background: 'var(--ui-card-bg)',
  borderRadius: 'var(--ui-card-radius)',
  padding: 'var(--ui-card-padding)',
  boxShadow: 'var(--ui-card-shadow)',
};

export default function Card({ title, children, footer, className = '', style = {} }) {
  return (
    <div className={className} style={{ ...cardStyle, ...style }}>
      {title && <h4 style={{ marginTop: 0 }}>{title}</h4>}
      <div>{children}</div>
      {footer && <div style={{ marginTop: 'var(--ui-card-footer-gap)' }}>{footer}</div>}
    </div>
  );
}
