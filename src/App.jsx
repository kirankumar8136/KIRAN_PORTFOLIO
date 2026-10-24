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
  const [threeMode, setThreeMode] = useState('reactor');
  const [threeTheme, setThreeTheme] = useState('red');
  const [modalData, setModalData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    if (threeTheme === 'red') {
      root.style.setProperty('--primary-neon', '#ff003c');
      root.style.setProperty('--secondary-neon', '#dc2626');
      root.style.setProperty('--accent-neon', '#ff2a55');
      root.style.setProperty('--glass-border-glow', 'rgba(255, 0, 60, 0.4)');
      root.style.setProperty('--bg-card', 'rgba(18, 8, 12, 0.78)');
      root.style.setProperty('--bg-card-hover', 'rgba(28, 11, 17, 0.92)');
    } else if (threeTheme === 'ruby') {
      root.style.setProperty('--primary-neon', '#e11d48');
      root.style.setProperty('--secondary-neon', '#be123c');
      root.style.setProperty('--accent-neon', '#f43f5e');
      root.style.setProperty('--glass-border-glow', 'rgba(225, 29, 72, 0.4)');
      root.style.setProperty('--bg-card', 'rgba(16, 7, 10, 0.78)');
      root.style.setProperty('--bg-card-hover', 'rgba(26, 10, 15, 0.92)');
    } else if (threeTheme === 'matrix') {
      root.style.setProperty('--primary-neon', '#10b981');
      root.style.setProperty('--secondary-neon', '#059669');
      root.style.setProperty('--accent-neon', '#34d399');
      root.style.setProperty('--glass-border-glow', 'rgba(16, 185, 129, 0.4)');
      root.style.setProperty('--bg-card', 'rgba(8, 18, 13, 0.78)');
      root.style.setProperty('--bg-card-hover', 'rgba(11, 28, 19, 0.92)');
    } else if (threeTheme === 'amber') {
      root.style.setProperty('--primary-neon', '#f59e0b');
      root.style.setProperty('--secondary-neon', '#d97706');
      root.style.setProperty('--accent-neon', '#fbbf24');
      root.style.setProperty('--glass-border-glow', 'rgba(245, 158, 11, 0.4)');
      root.style.setProperty('--bg-card', 'rgba(20, 14, 8, 0.78)');
      root.style.setProperty('--bg-card-hover', 'rgba(30, 20, 10, 0.92)');
    } else if (threeTheme === 'cyan') {
      root.style.setProperty('--primary-neon', '#00f0ff');
      root.style.setProperty('--secondary-neon', '#0ea5e9');
      root.style.setProperty('--accent-neon', '#ec4899');
      root.style.setProperty('--glass-border-glow', 'rgba(0, 240, 255, 0.35)');
      root.style.setProperty('--bg-card', 'rgba(15, 18, 28, 0.78)');
      root.style.setProperty('--bg-card-hover', 'rgba(22, 27, 42, 0.92)');
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
