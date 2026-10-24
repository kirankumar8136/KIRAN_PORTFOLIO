import React from 'react';
import { playBlipSound } from '../utils/audio';

export function HudPanel({ isOpen, mode, setMode, theme, setTheme, onClose, onToast }) {
  if (!isOpen) return null;

  const modes = [
    { key: 'reactor', label: 'Singularity Reactor', icon: 'fa-solid fa-atom' },
    { key: 'spire', label: 'Titan Spire', icon: 'fa-solid fa-monument' },
    { key: 'torus', label: 'Hyper-Torus', icon: 'fa-solid fa-ring' }
  ];

  const themes = [
    { key: 'red', label: 'Crimson Red', class: 'red' },
    { key: 'ruby', label: 'Blood Ruby', class: 'ruby' },
    { key: 'matrix', label: 'Matrix Emerald', class: 'matrix' },
    { key: 'amber', label: 'Solar Amber', class: 'amber' },
    { key: 'cyan', label: 'Cyber Cyan', class: 'cyan' }
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
