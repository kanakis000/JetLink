import React from 'react';

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const dialogStyle = {
  position: 'relative',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  overlayClassName = '',
  contentClassName = '',
  closeOnOverlayClick = true,
  showCloseButton = false,
  closeButtonLabel = 'Close',
}) {
  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose?.();
    }
  };

  return (
    <div
      style={overlayStyle}
      className={overlayClassName}
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div style={dialogStyle} className={contentClassName} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>{title}</h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                aria-label={closeButtonLabel}
              >
                ✕
              </button>
            )}
          </div>
        )}
        <div>{children}</div>
        {footer && <div style={{ marginTop: 16 }}>{footer}</div>}
      </div>
    </div>
  );
}
