import React from 'react';
import Button from './Button';

export default function EmptyState({ title = 'No items', message = '', icon = null, action = null, style = {} }) {
  return (
    <div style={{ textAlign: 'center', padding: 28, color: '#6b7280', ...style }}>
      <div style={{ fontSize: 42, marginBottom: 8 }}>{icon}</div>
      <h3 style={{ margin: '8px 0', color: '#111827' }}>{title}</h3>
      {message && <p style={{ marginTop: 0 }}>{message}</p>}
      {action && (
        <div style={{ marginTop: 12 }}>
          <Button onClick={action.onClick} variant={action.variant || 'primary'}>{action.label}</Button>
        </div>
      )}
    </div>
  );
}
