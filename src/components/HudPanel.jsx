import React from 'react';
import { playBlipSound } from '../utils/audio';

export function HudPanel({ isOpen, mode, setMode, theme, setTheme, onClose, onToast }) {
  if (!isOpen) return null;

  const modes = [
    { key: 'storm', label: 'Thunder Realm', icon: 'fa-solid fa-cloud-bolt' },
    { key: 'bifrost', label: 'Bifrost Sky', icon: 'fa-solid fa-wand-magic-sparkles' },
    { key: 'mjolnir', label: 'Mjolnir Core', icon: 'fa-solid fa-bolt' }
  ];

  const themes = [
    { key: 'thor', label: 'Electric Thor', class: 'thor' },
    { key: 'bifrost', label: 'Asgardian Gold', class: 'bifrost' },
    { key: 'stormbreaker', label: 'Stormbreaker Sky', class: 'stormbreaker' },
    { key: 'crimson', label: 'Crimson Bifrost', class: 'crimson' }
  ];

  const handleModeChange = (m) => {
    playBlipSound(850, 0.05);
    setMode(m.key);
    if (onToast) onToast(`3D Environment: ${m.label.toUpperCase()}`);
  };

  const handleThemeChange = (t) => {
    playBlipSound(1000, 0.05);
    setTheme(t.key);
    if (onToast) onToast(`Spectrum: ${t.label.toUpperCase()}`);
  };

  return (
    <div id="hud-panel" className="cyber-hud-panel open">
      <div className="hud-panel-header">
        <span className="hud-title">
          <i className="fa-solid fa-sliders"></i> 3D ENGINE CONTROLLER
        </span>
        <button className="hud-close-x" onClick={onClose} aria-label="Close HUD">
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div className="hud-section">
        <span className="hud-label">ENVIRONMENT MODE</span>
        <div className="hud-button-group">
          {modes.map((m) => (
            <button
              key={m.key}
              className={`hud-opt-btn ${mode === m.key ? 'active' : ''}`}
              onClick={() => handleModeChange(m)}
            >
              <i className={m.icon}></i> {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="hud-section">
        <span className="hud-label">CHROMATIC SPECTRUM</span>
        <div className="hud-color-swatches">
          {themes.map((t) => (
            <button
              key={t.key}
              className={`color-swatch ${t.class} ${theme === t.key ? 'active' : ''}`}
              onClick={() => handleThemeChange(t)}
              title={t.label}
            />
          ))}
        </div>
      </div>

      <div className="hud-footer">
        <small>// Real-time WebGL Parallax & Physics</small>
      </div>
    </div>
  );
}
