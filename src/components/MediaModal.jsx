import React, { useEffect } from 'react';
import { playBlipSound, playLevelUpSound } from '../utils/audio';
import confetti from 'canvas-confetti';

export function MediaModal({ modalData, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!modalData) return null;

  const { title, url, type, character } = modalData;

  const formatStoryContent = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="story-bold-highlight">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const handleModalHype = (e) => {
    playLevelUpSound();
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="cyber-modal active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-backdrop"></div>
      <div className={`modal-dialog ${type === 'story' ? 'modal-dialog-story' : ''}`}>
        
        {/* Modal Header */}
        <div className="modal-head">
          <span className="modal-title">
            <i className={type === 'story' ? 'fa-solid fa-scroll' : type === 'pdf' ? 'fa-solid fa-file-pdf' : 'fa-solid fa-image'}></i>{' '}
            {title || 'Inspection Deck'}
          </span>
          <button className="modal-close-btn" onClick={() => { playBlipSound(900, 0.04); onClose(); }} aria-label="Close modal">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {type === 'pdf' && (
            <div className="modal-pdf-wrapper">
              <iframe src={url} className="modal-pdf-frame" title={title}></iframe>
              <div className="modal-download-bar">
                <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-cyber-primary">
                  <i className="fa-solid fa-arrow-up-right-from-square"></i> Open In New Tab
                </a>
              </div>
            </div>
          )}

          {type === 'image' && (
            <div className="modal-image-wrapper">
              <img src={url} alt={title} className="modal-image" />
            </div>
          )}

          {type === 'story' && character && (
            <div className="modal-story-container">
              <div className="story-modal-grid">
                {/* Left: Photo Frame */}
                <div className="story-photo-col">
                  <div className="story-img-frame" style={{ borderColor: character.accentColor }}>
                    <img src={character.image} alt={character.name} className="story-modal-img" />
                    <div className="story-img-badge" style={{ backgroundColor: character.accentColor }}>
                      {character.badge}
                    </div>
                  </div>

                  <button className="btn btn-cyber-accent w-full fun-btn-bounce" onClick={handleModalHype}>
                    <span>🚀 Launch Hype Confetti</span>
                  </button>
                </div>

                {/* Right: The Backstory & Stats */}
                <div className="story-intel-col">
                  <div className="story-quote-banner" style={{ borderLeftColor: character.accentColor }}>
                    <i className="fa-solid fa-quote-left"></i> "{character.shortQuote}"
                  </div>

                  <div className="story-section-block">
                    <h4 className="story-section-title">
                      <i className="fa-solid fa-book-sparkles"></i> {character.storySectionTitle || `${character.name} STORY`}
                    </h4>
                    <p className="story-text-p">{formatStoryContent(character.story)}</p>
                  </div>

                  <div className="story-traits-grid">
                    <div className="trait-box">
                      <span className="trait-title"><i className="fa-solid fa-bolt" style={{ color: '#f59e0b' }}></i> SUPERPOWER</span>
                      <p className="trait-desc">{character.superpower}</p>
                    </div>

                    <div className="trait-box">
                      <span className="trait-title"><i className="fa-solid fa-skull-crossbones" style={{ color: '#ec4899' }}></i> FATAL WEAKNESS</span>
                      <p className="trait-desc">{character.weakness}</p>
                    </div>
                  </div>

                  <div className="story-stats-matrix">
                    <h5 className="matrix-title">// MULTIVERSE STATS MATRIX</h5>
                    <div className="matrix-grid">
                      {Object.entries(character.stats).map(([k, v]) => (
                        <div key={k} className="matrix-stat-pill">
                          <span className="matrix-k">{k.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
                          <span className="matrix-v" style={{ color: character.accentColor }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
