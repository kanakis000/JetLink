import React from 'react';
import Button from './Button';

export default function EmptyState({ title = 'No items', message = '', icon = null, action = null, style = {} }) {
  return (
    <div style={{ textAlign: 'center', padding: 'var(--ui-empty-padding)', color: 'var(--ui-empty-text)', ...style }}>
      <div style={{ fontSize: 'var(--ui-empty-icon-size)', marginBottom: 'var(--ui-empty-icon-gap)' }}>{icon}</div>
      <h3 style={{ margin: 'var(--ui-empty-icon-gap) 0', color: 'var(--ui-empty-title)' }}>{title}</h3>
      {message && <p style={{ marginTop: 0 }}>{message}</p>}
      {action && (
        <div style={{ marginTop: 'var(--ui-empty-action-gap)' }}>
          <Button onClick={action.onClick} variant={action.variant || 'primary'}>{action.label}</Button>
        </div>
      )}
    </div>
  );
}
