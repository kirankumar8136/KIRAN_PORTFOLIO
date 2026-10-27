import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Background3D } from './components/Background3D';
import { Hero } from './components/Hero';
import { Lab3D } from './components/Lab3D';
import { Skills } from './components/Skills';
import { Education } from './components/Education';
import { Certificates } from './components/Certificates';
import { Experience } from './components/Experience';
import { Gallery } from './components/Gallery';
import { TerminalManifesto } from './components/TerminalManifesto';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { MediaModal } from './components/MediaModal';
import { HudPanel } from './components/HudPanel';
import { Toast } from './components/Toast';

export function App() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [hudOpen, setHudOpen] = useState(false);
  const [threeMode, setThreeMode] = useState('storm');
  const [threeTheme, setThreeTheme] = useState('thor');
  const [modalData, setModalData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    if (threeTheme === 'thor') {
      root.style.setProperty('--primary-neon', '#00d4ff');
      root.style.setProperty('--secondary-neon', '#2563eb');
      root.style.setProperty('--accent-neon', '#38bdf8');
      root.style.setProperty('--glass-border-glow', 'rgba(0, 212, 255, 0.45)');
      root.style.setProperty('--bg-darkest', '#030712');
      root.style.setProperty('--bg-darker', '#060e20');
      root.style.setProperty('--bg-card', 'rgba(8, 16, 36, 0.78)');
      root.style.setProperty('--bg-card-hover', 'rgba(14, 26, 56, 0.92)');
    } else if (threeTheme === 'bifrost') {
      root.style.setProperty('--primary-neon', '#fbbf24');
      root.style.setProperty('--secondary-neon', '#f59e0b');
      root.style.setProperty('--accent-neon', '#fde047');
      root.style.setProperty('--glass-border-glow', 'rgba(251, 191, 36, 0.45)');
      root.style.setProperty('--bg-darkest', '#06050b');
      root.style.setProperty('--bg-darker', '#0d0a17');
      root.style.setProperty('--bg-card', 'rgba(16, 12, 28, 0.78)');
      root.style.setProperty('--bg-card-hover', 'rgba(26, 20, 44, 0.92)');
    } else if (threeTheme === 'stormbreaker') {
      root.style.setProperty('--primary-neon', '#38bdf8');
      root.style.setProperty('--secondary-neon', '#1d4ed8');
      root.style.setProperty('--accent-neon', '#93c5fd');
      root.style.setProperty('--glass-border-glow', 'rgba(56, 189, 248, 0.45)');
      root.style.setProperty('--bg-darkest', '#020617');
      root.style.setProperty('--bg-darker', '#040d28');
      root.style.setProperty('--bg-card', 'rgba(6, 14, 38, 0.78)');
      root.style.setProperty('--bg-card-hover', 'rgba(10, 22, 58, 0.92)');
    } else if (threeTheme === 'crimson') {
      root.style.setProperty('--primary-neon', '#ff003c');
      root.style.setProperty('--secondary-neon', '#dc2626');
      root.style.setProperty('--accent-neon', '#ff2a55');
      root.style.setProperty('--glass-border-glow', 'rgba(255, 0, 60, 0.45)');
      root.style.setProperty('--bg-darkest', '#080305');
      root.style.setProperty('--bg-darker', '#0e0508');
      root.style.setProperty('--bg-card', 'rgba(18, 8, 12, 0.78)');
      root.style.setProperty('--bg-card-hover', 'rgba(28, 11, 17, 0.92)');
    }
  }, [threeTheme]);

  // Toast helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const openStoryModal = (char) => {
    setModalData({
      title: `${char.name} // DOSSIER`,
      type: 'story',
      character: char
    });
  };

  return (
    <div className="app-wrapper">
      {/* 3D WebGL Background with Magnetic Particle Interaction */}
      <Background3D mode={threeMode} theme={threeTheme} />

      {/* Cyber Overlay Scanlines & Noise */}
      <div className="cyber-overlay"></div>

      {/* Top Navigation */}
      <Navbar
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onToggleHud={() => setHudOpen(!hudOpen)}
        hudOpen={hudOpen}
      />

      {/* 3D Engine Controller HUD Panel */}
      <HudPanel
        isOpen={hudOpen}
        mode={threeMode}
        setMode={setThreeMode}
        theme={threeTheme}
        setTheme={setThreeTheme}
        onClose={() => setHudOpen(false)}
        onToast={showToast}
      />

      {/* Main Sections */}
      <main>
        <Hero />
        <Lab3D onToast={showToast} />
        <Skills />
        <Education onOpenModal={setModalData} />
        <Certificates onOpenModal={setModalData} />
        <Experience />
        <Gallery onOpenStoryModal={openStoryModal} />
        <TerminalManifesto onToast={showToast} />
        <Contact onToast={showToast} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Inspection Modal for PDF, Image, or AI Character Story */}
      {modalData && (
        <MediaModal modalData={modalData} onClose={() => setModalData(null)} />
      )}

      {/* Cyber HUD Toast */}
      <Toast message={toastMessage} />
    </div>
  );
}
