import React, { useEffect, useRef, useState } from 'react';
import DitherVeil from './DitherVeil';
import { playThunderSound } from '../utils/audio';

/**
 * Avengers Thor: God of Thunder Interactive Background
 * Features:
 * 1. React Bits <DitherVeil /> rendering Thor with Stormbreaker
 * 2. Real-time procedural branching lightning bolts & thunder strikes
 * 3. Interactive cursor electric arcs & click thunderstrike shockwaves
 * 4. Ambient atmospheric sheet lightning flashes & floating electric storm particles
 */
export function Background3D({ mode = 'storm', theme = 'thor' }) {
  const lightningCanvasRef = useRef(null);

  // Theme-responsive lightning palettes
  const lightningColors = {
    thor: {
      core: '#ffffff',
      glow: '#00d4ff',
      secondary: '#38bdf8',
      accent: '#7dd3fc',
      flash: 'rgba(0, 212, 255, 0.22)',
      paperColor: '#00d4ff',
      rimColor: '#7dd3fc',
      inkColor: '#030712'
    },
    bifrost: {
      core: '#ffffff',
      glow: '#fbbf24',
      secondary: '#f59e0b',
      accent: '#fde047',
      flash: 'rgba(251, 191, 36, 0.22)',
      paperColor: '#fbbf24',
      rimColor: '#fde047',
      inkColor: '#070a14'
    },
    stormbreaker: {
      core: '#ffffff',
      glow: '#38bdf8',
      secondary: '#2563eb',
      accent: '#93c5fd',
      flash: 'rgba(56, 189, 248, 0.22)',
      paperColor: '#38bdf8',
      rimColor: '#93c5fd',
      inkColor: '#020617'
    },
    crimson: {
      core: '#ffffff',
      glow: '#ff003c',
      secondary: '#e11d48',
      accent: '#ff2a55',
      flash: 'rgba(255, 0, 60, 0.22)',
      paperColor: '#ff003c',
      rimColor: '#ff2a55',
      inkColor: '#080305'
    }
  };

  const palette = lightningColors[theme] || lightningColors.thor;

  useEffect(() => {
    const canvas = lightningCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Active lightning bolts, sparks, and shockwaves
    const bolts = [];
    const sparks = [];
    const shockwaves = [];
    let flashOpacity = 0;

    // Mouse coordinates
    const mouse = {
      x: width / 2,
      y: height / 2,
      active: false,
      lastMove: Date.now()
    };

    // Ambient floating electric particles
    const particleCount = 70;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -0.4 - Math.random() * 1.2,
      size: 1 + Math.random() * 2.2,
      alpha: 0.2 + Math.random() * 0.7,
      flickerSpeed: 0.03 + Math.random() * 0.05
    }));

    // Generate branching lightning bolt segments
    function createBolt(x1, y1, x2, y2, branchDepth = 0) {
      const segments = [];
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.hypot(dx, dy);
      const steps = Math.max(8, Math.floor(dist / 22));

      let curX = x1;
      let curY = y1;

      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const targetX = x1 + dx * t;
        const targetY = y1 + dy * t;

        // Jagged fractal displacement
        const spread = (1.0 - Math.abs(t - 0.5) * 1.4) * (28 / (branchDepth + 1));
        const nextX = i === steps ? x2 : targetX + (Math.random() - 0.5) * spread;
        const nextY = i === steps ? y2 : targetY + (Math.random() - 0.5) * spread;

        segments.push({ x1: curX, y1: curY, x2: nextX, y2: nextY });

        // Branching fork probability
        if (branchDepth < 2 && Math.random() < 0.22 && i > 2 && i < steps - 2) {
          const branchAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.2;
          const branchLength = (dist * (0.25 + Math.random() * 0.35)) / (branchDepth + 1);
          const bx2 = nextX + Math.cos(branchAngle) * branchLength;
          const by2 = nextY + Math.sin(branchAngle) * branchLength;
          const subBolt = createBolt(nextX, nextY, bx2, by2, branchDepth + 1);
          segments.push(...subBolt.segments);
        }

        curX = nextX;
        curY = nextY;
      }

      return {
        segments,
        opacity: 1.0,
        decay: 0.045 + Math.random() * 0.03,
        branchDepth,
        flicker: 4
      };
    }

    // Trigger thunderbolt
    function strikeLightning(targetX, targetY, isNatural = false) {
      const startX = targetX + (Math.random() - 0.5) * 200;
      const startY = -20;
      const bolt = createBolt(startX, startY, targetX, targetY);
      bolts.push(bolt);

      // Atmospheric thunder flash
      flashOpacity = isNatural ? 0.35 : 0.5;

      // Spurt of electric sparks at impact
      const sparkCount = isNatural ? 12 : 24;
      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        sparks.push({
          x: targetX,
          y: targetY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          life: 1.0,
          decay: 0.025 + Math.random() * 0.04,
          size: 1.5 + Math.random() * 2.5
        });
      }

      // Add shockwave ring
      shockwaves.push({
        x: targetX,
        y: targetY,
        radius: 4,
        maxRadius: 180,
        speed: 7,
        opacity: 1.0
      });

      // Play audio if sound enabled
      playThunderSound();
    }

    // Natural thunder timer
    let naturalStrikeTimer = null;
    const scheduleNaturalStrike = () => {
      const delay = 3500 + Math.random() * 4500;
      naturalStrikeTimer = setTimeout(() => {
        // Strike towards center-left (near Thor / Stormbreaker)
        const stormX = width * (0.35 + Math.random() * 0.35);
        const stormY = height * (0.4 + Math.random() * 0.4);
        strikeLightning(stormX, stormY, true);
        scheduleNaturalStrike();
      }, delay);
    };
    scheduleNaturalStrike();

    // Window resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // Pointer Move
    const handlePointerMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      mouse.lastMove = Date.now();

      // Occasional crackling micro-arc to cursor
      if (Math.random() < 0.08) {
        const originX = mouse.x + (Math.random() - 0.5) * 90;
        const originY = mouse.y - 70 - Math.random() * 60;
        bolts.push(createBolt(originX, originY, mouse.x, mouse.y, 1));
      }
    };

    // Pointer Down (Thunder strike on click)
    const handlePointerDown = (e) => {
      // Ignore clicks on buttons/inputs to keep them responsive
      if (e.target.closest('button, a, input, textarea, select, .hud-panel, .modal-dialog')) {
        return;
      }
      strikeLightning(e.clientX, e.clientY, false);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);

    // Main 60FPS render loop
    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // 1. Atmospheric Sheet Lightning Flash
      if (flashOpacity > 0.01) {
        ctx.fillStyle = palette.flash.replace(/[\d.]+\)$/, `${flashOpacity})`);
        ctx.fillRect(0, 0, width, height);
        flashOpacity *= 0.86;
      }

      // 2. Ambient Electric Floating Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += Math.sin(Date.now() * p.flickerSpeed) * 0.03;

        // Wrap around screen
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.fillStyle = palette.glow;
        ctx.shadowColor = palette.glow;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = Math.max(0.15, Math.min(1.0, p.alpha));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      // 3. Render Shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += sw.speed;
        sw.opacity = Math.max(0, 1.0 - sw.radius / sw.maxRadius);

        ctx.strokeStyle = palette.glow;
        ctx.shadowColor = palette.glow;
        ctx.shadowBlur = 12;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = sw.opacity * 0.7;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      // 4. Render Electric Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.12; // Gravity
        s.vx *= 0.96;
        s.life -= s.decay;

        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.fillStyle = palette.core;
        ctx.shadowColor = palette.glow;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = s.life;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      // 5. Render Lightning Bolts
      for (let b = bolts.length - 1; b >= 0; b--) {
        const bolt = bolts[b];

        // Flicker intensity
        let flickerAlpha = bolt.opacity;
        if (bolt.flicker > 0) {
          bolt.flicker--;
          if (Math.random() < 0.4) flickerAlpha *= 0.5;
        }

        ctx.save();
        ctx.globalAlpha = flickerAlpha;

        // Outer Electric Cyan Glow Stroke
        ctx.strokeStyle = palette.glow;
        ctx.shadowColor = palette.glow;
        ctx.shadowBlur = 24;
        ctx.lineWidth = bolt.branchDepth === 0 ? 5 : 2.5;
        ctx.beginPath();
        for (let i = 0; i < bolt.segments.length; i++) {
          const seg = bolt.segments[i];
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        }
        ctx.stroke();

        // Inner White-Hot Core Stroke
        ctx.strokeStyle = palette.core;
        ctx.shadowColor = palette.core;
        ctx.shadowBlur = 8;
        ctx.lineWidth = bolt.branchDepth === 0 ? 2 : 1;
        ctx.beginPath();
        for (let i = 0; i < bolt.segments.length; i++) {
          const seg = bolt.segments[i];
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        }
        ctx.stroke();

        ctx.restore();

        bolt.opacity -= bolt.decay;
        if (bolt.opacity <= 0) {
          bolts.splice(b, 1);
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      if (naturalStrikeTimer) clearTimeout(naturalStrikeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [theme]);

  return (
    <div className="thor-bg-container">
      {/* React Bits DitherVeil Component displaying Thor with Stormbreaker */}
      <div className="thor-bg-dither">
        <DitherVeil
          src="/thor.jpg"
          fit="cover"
          pattern="floyd"
          pixelSize={2}
          levels={2}
          palette="duotone"
          inkColor={palette.inkColor}
          paperColor={palette.paperColor}
          rimColor={palette.rimColor}
          rim={0.12}
          contrast={1.22}
          brightness={0.04}
          revealRadius={250}
          softness={0.65}
          linger={1.3}
          wander={true}
          clickBurst={true}
        />
      </div>

      {/* Interactive Branching Lightning & Thunder Canvas */}
      <canvas ref={lightningCanvasRef} className="thor-bg-lightning" />
    </div>
  );
}
