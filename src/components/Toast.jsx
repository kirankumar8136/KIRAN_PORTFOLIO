import React from 'react';

export function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="cyber-toast visible">
      <div className="toast-indicator"></div>
      <span className="toast-msg">{message}</span>
    </div>
  );
}
