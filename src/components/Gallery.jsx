import React, { useState } from 'react';
import { AI_CHARACTERS } from '../data/portfolioData';
import { playBlipSound, playLaserSound, playLevelUpSound } from '../utils/audio';
import confetti from 'canvas-confetti';

export function Gallery({ onOpenStoryModal }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hypes, setHypes] = useState(() => {
    const initial = {};
    AI_CHARACTERS.forEach(c => { initial[c.id] = c.hypes; });
    return initial;
  });

  const categories = [
    { key: 'all', label: 'All Stories (4)' },
    { key: 'vision', label: 'Ambition & Vision' },
    { key: 'squad', label: 'IT Lab Squad' },
    { key: 'journey', label: 'Cinematic Journey' }
  ];

  const filteredCharacters = AI_CHARACTERS.filter(
    (c) => activeCategory === 'all' || c.category === activeCategory
  );

  const handleHypeClick = (e, charId) => {
    e.stopPropagation();
    playLevelUpSound();
    setHypes(prev => ({
      ...prev,
      [charId]: prev[charId] + 1
    }));

    // Trigger local emoji confetti blast
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      origin: { x, y },
      particleCount: 30,
      spread: 70,
      scalar: 1.3,
      colors: ['#ff003c', '#ff2a55', '#dc2626', '#f59e0b', '#8b5cf6']
    });
  };

  const openDossier = (char) => {
    playBlipSound(900, 0.04);
    if (onOpenStoryModal) {
      onOpenStoryModal(char);
    }
  };

  return (
    <section className="section" id="gallery">
      <div className="section-header">
        <span className="section-tag">// 07 • AI LAB & PHOTO STORIES</span>
        <h2 className="section-heading">
          AI VISIONS & <span className="neon-text">PHOTO STORIES</span>
        </h2>
        <p className="section-sub">
          4 hand-crafted AI visual narratives detailing the journey: from late-night dreams and college IT lab sprints to unwavering discipline in the rain.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="cert-filters">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`cert-filter-btn ${activeCategory === cat.key ? 'active' : ''}`}
            onClick={() => {
              playBlipSound(800, 0.03);
              setActiveCategory(cat.key);
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 4-Card Gallery Grid */}
      <div className="gallery-grid gallery-grid-4">
        {filteredCharacters.map((char) => (
          <div
            key={char.id}
            className="gallery-card fun-bounce-card"
            style={{ '--accent': char.accentColor }}
          >
            {/* Photo Frame Container */}
            <div 
              className="gallery-image-wrapper"
              onClick={() => openDossier(char)}
              title="Click to view full photo story dossier"
            >
              <div className="gallery-badge" style={{ borderColor: char.accentColor, color: char.accentColor }}>
                <i className="fa-solid fa-sparkles"></i> {char.badge}
              </div>

              <img 
                src={char.image} 
                alt={char.name} 
                className="gallery-image" 
                loading="lazy" 
              />

              <div className="gallery-overlay-gradient"></div>

              <div className="gallery-quick-quote">
                <i className="fa-solid fa-quote-left"></i> "{char.shortQuote}"
              </div>

              <span className="gallery-expand-hint">
                <i className="fa-solid fa-book-open"></i> Read Story
              </span>
            </div>

            {/* Character Details & Story Excerpt */}
            <div className="gallery-content">
              <div className="gallery-title-row">
                <h3 className="gallery-name">{char.name}</h3>
              </div>

              <p className="gallery-story-brief">
                {char.story.replace(/\*\*/g, '').length > 130 
                  ? `${char.story.replace(/\*\*/g, '').substring(0, 130)}...` 
                  : char.story.replace(/\*\*/g, '')}
              </p>

              {/* Superpower & Trait Preview */}
              <div className="gallery-attributes">
                <div className="attr-item">
                  <span className="attr-label"><i className="fa-solid fa-bolt" style={{ color: '#f59e0b' }}></i> SUPERPOWER:</span>
                  <span className="attr-val">{char.superpower}</span>
                </div>
                <div className="attr-item">
                  <span className="attr-label"><i className="fa-solid fa-triangle-exclamation" style={{ color: '#ec4899' }}></i> QUIRK / WEAKNESS:</span>
                  <span className="attr-val">{char.weakness}</span>
                </div>
              </div>

              {/* Card Action Bar */}
              <div className="gallery-actions">
                <button
                  className="btn btn-cyber-primary fun-btn-bounce"
                  onClick={() => openDossier(char)}
                >
                  <i className="fa-solid fa-scroll"></i>
                  <span>Full Story</span>
                </button>

                {/* Hype Cheer Button */}
                <button
                  className="hype-btn fun-wobble-hover"
                  onClick={(e) => handleHypeClick(e, char.id)}
                  title="Send Hype! Fires Confetti"
                >
                  <span className="hype-icon">🚀</span>
                  <span className="hype-count">{hypes[char.id]}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
