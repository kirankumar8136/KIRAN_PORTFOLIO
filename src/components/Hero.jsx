import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { playBlipSound, playLaserSound, playLevelUpSound, playThunderSound } from '../utils/audio';

export function Hero() {
  const [avatarPulse, setAvatarPulse] = useState(false);

  // Typewriter effect
  const phrases = [
    "God of Thunder & Lightning Tech",
    "AI & Data Science Specialist",
    "3D Architectural CAD Designer",
    "Unreal Engine 5 Game Developer",
    "Mjolnir & Stormbreaker Systems",
    "Computer Hardware Engineer"
  ];
  const [currentText, setCurrentText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIdx];
    let timeout;

    if (!isDeleting && charIdx < currentPhrase.length) {
      timeout = setTimeout(() => {
        setCurrentText(currentPhrase.substring(0, charIdx + 1));
        setCharIdx(charIdx + 1);
      }, 70);
    } else if (!isDeleting && charIdx === currentPhrase.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2200);
    } else if (isDeleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setCurrentText(currentPhrase.substring(0, charIdx - 1));
        setCharIdx(charIdx - 1);
      }, 35);
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setPhraseIdx((phraseIdx + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, phraseIdx]);

  const handleAvatarClick = () => {
    playThunderSound();
    setAvatarPulse(true);
    setTimeout(() => {
      setAvatarPulse(false);
    }, 600);
  };

  return (
    <section className="hero-section" id="home">
      <div className="hero-grid">
        
        {/* Left: Hero Intel */}
        <div className="hero-intel">
          <div className="status-badge">
            <span className="pulse-indicator"></span>
            <span className="badge-text">⚡ STATUS: ASGARDIAN REALM DEFENDER // GOD OF THUNDER</span>
          </div>

          <div className="hero-title-group">
            <p className="hero-greeting">// HELLO MIDGARD, THIS IS</p>
            <h1 className="hero-name">
              KIRAN <span className="neon-text">KUMAR K</span>
            </h1>
            <div className="typewriter-container">
              <span className="terminal-prefix">&gt;</span>
              <span className="typing-target">{currentText}</span>
              <span className="typing-cursor">_</span>
            </div>
          </div>

          <p className="hero-bio">
            Multidisciplinary creator engineering next-generation experiences at the intersection of{' '}
            <strong>Artificial Intelligence</strong>, <strong>3D Architectural CAD</strong>,{' '}
            <strong>Unreal Engine Game Development</strong>, and <strong>Enterprise Hardware Systems</strong>.{' '}
            Currently pursuing BCA Honors in AI & Data Science.
          </p>

          {/* Quick Metrics Matrix */}
          <div className="hero-metrics">
            <div className="metric-box fun-bounce-card">
              <span className="metric-num">5+</span>
              <span className="metric-label">Years 3D & Design</span>
            </div>
            <div className="metric-box fun-bounce-card">
              <span className="metric-num">BCA</span>
              <span className="metric-label">AI & Data Science</span>
            </div>
            <div className="metric-box fun-bounce-card">
              <span className="metric-num">99%</span>
              <span className="metric-label">Hardware Prowess</span>
            </div>
          </div>

          {/* Hero Call to Actions */}
          <div className="hero-actions">
            <a 
              href="#contact" 
              className="btn btn-cyber-primary"
              onClick={() => playLaserSound()}
            >
              <span>Initiate Contact</span>
              <i className="fa-solid fa-arrow-right"></i>
            </a>

            <a 
              href="#gallery" 
              className="btn btn-cyber-accent"
              onClick={() => playLevelUpSound()}
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              <span>AI Photo Stories</span>
              <span className="btn-mini-tag">HOT</span>
            </a>

            <a 
              href="#lab" 
              className="btn btn-cyber-secondary"
              onClick={() => playBlipSound(880, 0.05)}
            >
              <i className="fa-solid fa-cube"></i>
              <span>3D Lab</span>
            </a>

            <a 
              href="/Arc cirtificate.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-cyber-ghost"
              title="AutoDesk Certificate PDF"
            >
              <i className="fa-solid fa-certificate"></i>
              <span>Credentials</span>
            </a>
          </div>

          {/* Social Conduits */}
          <div className="social-conduits">
            <span className="conduit-title">// CONNECT:</span>
            <div className="conduit-links">
              <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-circle">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="social-circle">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href={PERSONAL_INFO.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-circle">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href={PERSONAL_INFO.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-circle">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Right: 3D Holographic Avatar Frame (Clean, No Cooling Glasses) */}
        <div className="hero-visual">
          <div 
            className={`holo-frame-wrapper ${avatarPulse ? 'jiggle-animation' : ''}`}
            onClick={handleAvatarClick}
            title="Kiran Kumar K // Holographic Station"
          >
            {/* HUD Corner Markers */}
            <span className="corner-bracket top-left"></span>
            <span className="corner-bracket top-right"></span>
            <span className="corner-bracket bottom-left"></span>
            <span className="corner-bracket bottom-right"></span>

            {/* Orbital 3D Tech Rings */}
            <div className="orbital-ring ring-outer"></div>
            <div className="orbital-ring ring-middle"></div>
            <div className="orbital-ring ring-inner"></div>

            {/* Scanner Line FX */}
            <div className="scanner-sweep"></div>

            {/* Portrait Image (Pure center without glasses) */}
            <div className="avatar-portal">
              <img src="/thor.jpg" alt="Thor: God of Thunder" className="avatar-img" />
            </div>

            {/* Floating Cyber Tags */}
            <div className="float-tag tag-top">
              <i className="fa-solid fa-bolt"></i>
              <span>GOD OF THUNDER</span>
            </div>
            <div className="float-tag tag-bottom">
              <i className="fa-solid fa-cloud-bolt"></i>
              <span>MJOLNIR & STORMBREAKER</span>
            </div>
            <div className="float-tag tag-right">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              <span>BIFROST POWER</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
