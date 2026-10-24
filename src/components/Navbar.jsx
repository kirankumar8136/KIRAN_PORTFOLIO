import React, { useState, useEffect } from 'react';
import { playBlipSound, toggleAudio } from '../utils/audio';

export function Navbar({ soundEnabled, setSoundEnabled, onToggleHud, hudOpen }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['home', 'lab', 'skills', 'education', 'certificates', 'experience', 'gallery', 'contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    playBlipSound(1050, 0.05);
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAudioClick = () => {
    const enabled = toggleAudio();
    setSoundEnabled(enabled);
  };

  const navItems = [
    { id: 'home', num: '01', label: 'Home' },
    { id: 'lab', num: '02', label: '3D Lab' },
    { id: 'skills', num: '03', label: 'Skills' },
    { id: 'education', num: '04', label: 'Education' },
    { id: 'certificates', num: '05', label: 'Certificates' },
    { id: 'experience', num: '06', label: 'Experience' },
    { id: 'gallery', num: '07', label: 'AI Gallery', badge: 'NEW' },
    { id: 'contact', num: '08', label: 'Contact' }
  ];

  return (
    <header className={`hud-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-inner">
        {/* BRAND LOGO - KIRAN */}
        <a 
          href="#home" 
          className="cyber-logo" 
          onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
          title="Kiran Kumar K"
        >
          <span className="logo-bracket">[</span>
          <span className="logo-text">KIRAN</span>
          <span className="logo-bracket">]</span>
          <span className="live-dot" title="Systems Online"></span>
        </a>

        {/* HUD NAV LINKS */}
        <nav id="navbar" className={`hud-nav ${mobileMenuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-link ${activeSection === item.id ? 'active' : ''} ${item.badge ? 'nav-link-special' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.id);
              }}
              onMouseEnter={() => playBlipSound(700, 0.02, 'triangle')}
            >
              <span className="nav-num">{item.num}</span> 
              {item.label}
              {item.badge && <span className="nav-pulse-badge">{item.badge}</span>}
            </a>
          ))}
        </nav>

        {/* HEADER ACTIONS */}
        <div className="header-actions">
          {/* Web Audio Toggle */}
          <button
            id="audio-toggle"
            className={`hud-btn icon-only ${soundEnabled ? 'active' : ''}`}
            onClick={handleAudioClick}
            title={soundEnabled ? 'Audio FX Enabled' : 'Muted (Click to enable sci-fi UI sounds)'}
          >
            <i className={`fa-solid ${soundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
          </button>

          {/* 3D HUD Controller Toggle */}
          <button
            id="hud-toggle"
            className={`hud-btn ${hudOpen ? 'active' : ''}`}
            onClick={() => {
              playBlipSound(800, 0.04);
              onToggleHud();
            }}
            title="Configure 3D Environment"
          >
            <i className="fa-solid fa-cube"></i>
            <span className="btn-text">3D FX</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
}
