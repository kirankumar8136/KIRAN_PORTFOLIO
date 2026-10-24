import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { playWarpSound } from '../utils/audio';

export function Footer() {
  const scrollToTop = (e) => {
    e.preventDefault();
    playWarpSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="cyber-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">KIRAN KUMAR K</span>
            <p className="footer-tagline">
              Designing intelligent computing systems, architectural realities, and interactive 3D worlds.
            </p>
          </div>
          <div className="footer-socials">
            <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="fun-wobble-hover">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="fun-wobble-hover">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href={PERSONAL_INFO.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="fun-wobble-hover">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href={PERSONAL_INFO.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="fun-wobble-hover">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="copyright">© 2026 Kiran Kumar K • Engineered with React 19, WebGL & Three.js</span>
          <a href="#home" onClick={scrollToTop} className="warp-top-btn fun-btn-bounce" title="Warp to Top">
            <span>BACK TO TOP</span>
            <i className="fa-solid fa-chevron-up"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
