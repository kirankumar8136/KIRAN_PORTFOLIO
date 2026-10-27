import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { playBlipSound, playLaserSound, playThunderSound } from '../utils/audio';
import { 
  createStudioEnvMap,
  loadMjolnirGLTF,
  createDetailedMjolnir,
  animateLightningAura,
  updateModelStyle
} from '../utils/models3D';

export function Lab3D({ onToast }) {
  const canvasRef = useRef(null);
  const [currentMode, setCurrentMode] = useState('classic');
  const [currentColor, setCurrentColor] = useState('#00d4ff');
  const [isWireframe, setIsWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isGLTFLoaded, setIsGLTFLoaded] = useState(false);

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const currentModelGroupRef = useRef(null);
  const envMapRef = useRef(null);
  const fillLightRef = useRef(null);
  const groundGridRef = useRef(null);
  const flashIntensityRef = useRef(3.4);
  const isGLTFLoadedRef = useRef(false);

  // Store user interaction states in refs to prevent closure staling in render loops
  const stateRef = useRef({
    mode: 'classic',
    color: '#00d4ff',
    wireframe: false,
    autoRotate: true,
    targetZoom: 4.8,
    currentZoom: 4.8
  });

  useEffect(() => {
    stateRef.current.mode = currentMode;
    stateRef.current.color = currentColor;
    stateRef.current.wireframe = isWireframe;
    stateRef.current.autoRotate = autoRotate;
  }, [currentMode, currentColor, isWireframe, autoRotate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const w = canvas.clientWidth || 600;
    const h = canvas.clientHeight || 420;

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(0, 0.2, 4.8);
    cameraRef.current = camera;

    // 2. High-Fidelity WebGL Renderer with ACES Filmic Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // 3. Procedural Studio Softbox Environment Map
    const envMap = createStudioEnvMap(renderer);
    scene.environment = envMap;
    envMapRef.current = envMap;

    // 4. Cinematic 3-Point Lighting Studio
    // Key Light (Overhead daylight softbox)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    // Dynamic Emissive Fill Light
    const fillLight = new THREE.PointLight(0x00d4ff, 3.4, 25);
    fillLight.position.set(-5, 3, 4);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    // Rim / Silhouette Backlight
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    rimLight.position.set(0, -2, -6);
    scene.add(rimLight);

    // Warm Horizon Kick Light
    const kickLight = new THREE.PointLight(0xfbbf24, 1.8, 20);
    kickLight.position.set(5, -3, -3);
    scene.add(kickLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    // 5. Holographic Ground Showroom Pedestal
    const groundGroup = new THREE.Group();
    groundGroup.position.set(0, -2.2, 0);

    const gridHelper = new THREE.GridHelper(8, 20, 0x00d4ff, 0x1e293b);
    gridHelper.position.y = 0.01;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.35;
    groundGroup.add(gridHelper);

    const ringGeom = new THREE.RingGeometry(0.5, 3.5, 48);
    ringGeom.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    groundGroup.add(ringMesh);

    scene.add(groundGroup);
    groundGridRef.current = groundGroup;

    // 6. Fast Instant Display: Procedural Mjölnir Model
    const fallbackModel = createDetailedMjolnir('#00d4ff', false, envMap, 'classic');
    fallbackModel.rotation.set(0.18, 0.42, -0.22);
    scene.add(fallbackModel);
    currentModelGroupRef.current = fallbackModel;

    // 7. Asynchronously Load Authentic 3D GLTF Model: mjolnir_thors_hammer.glb
    const baseUrl = import.meta.env.BASE_URL || './';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    const modelUrl = `${cleanBase}mjolnir_thors_hammer.glb`;

    loadMjolnirGLTF(
      modelUrl,
      envMap,
      stateRef.current.color,
      stateRef.current.wireframe,
      stateRef.current.mode
    )
      .then((gltfModel) => {
        if (!sceneRef.current) return;
        // Replace initial procedural fallback with actual GLTF model
        if (currentModelGroupRef.current) {
          scene.remove(currentModelGroupRef.current);
        }
        gltfModel.rotation.set(0.18, 0.42, -0.22);
        scene.add(gltfModel);
        currentModelGroupRef.current = gltfModel;
        isGLTFLoadedRef.current = true;
        setIsGLTFLoaded(true);
        if (onToast) onToast("Authentic Thor's Hammer Mjölnir 3D Model Loaded");
      })
      .catch((err) => {
        console.warn('GLTF load failed, using high-fidelity procedural Mjölnir model', err);
      });

    // 8. Interactive Mouse / Touch Drag Orbit Controls with Damping
    let isDragging = false;
    let mouseDownPos = { x: 0, y: 0 };
    let prevMousePos = { x: 0, y: 0 };
    let rotSpeedX = 0;
    let rotSpeedY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      mouseDownPos = { x: e.clientX, y: e.clientY };
      prevMousePos = { x: e.clientX, y: e.clientY };
      rotSpeedX = 0;
      rotSpeedY = 0;
    };

    const onMouseUp = (e) => {
      if (isDragging) {
        // If distance between down and up is under 6px, treat as interactive click/strike
        const dist = Math.hypot(e.clientX - mouseDownPos.x, e.clientY - mouseDownPos.y);
        if (dist < 6) {
          triggerThunderStrike();
        }
      }
      isDragging = false;
    };

    const onMouseMove = (e) => {
      if (!isDragging || !currentModelGroupRef.current) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      rotSpeedY = deltaX * 0.007;
      rotSpeedX = deltaY * 0.007;

      currentModelGroupRef.current.rotation.y += rotSpeedY;
      currentModelGroupRef.current.rotation.x += rotSpeedX;

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    // Zoom on wheel
    const onWheel = (e) => {
      e.preventDefault();
      stateRef.current.targetZoom = Math.max(2.8, Math.min(7.5, stateRef.current.targetZoom + e.deltaY * 0.003));
    };

    // Touch event handlers for mobile devices
    let touchStartDist = 0;
    let touchStartPos = { x: 0, y: 0 };

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 1 && isDragging && currentModelGroupRef.current) {
        const deltaX = e.touches[0].clientX - prevMousePos.x;
        const deltaY = e.touches[0].clientY - prevMousePos.y;

        rotSpeedY = deltaX * 0.007;
        rotSpeedX = deltaY * 0.007;

        currentModelGroupRef.current.rotation.y += rotSpeedY;
        currentModelGroupRef.current.rotation.x += rotSpeedX;

        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = touchStartDist - currentDist;
        stateRef.current.targetZoom = Math.max(2.8, Math.min(7.5, stateRef.current.targetZoom + diff * 0.005));
        touchStartDist = currentDist;
      }
    };

    const onTouchEnd = (e) => {
      if (isDragging && e.changedTouches && e.changedTouches.length === 1) {
        const t = e.changedTouches[0];
        const dist = Math.hypot(t.clientX - touchStartPos.x, t.clientY - touchStartPos.y);
        if (dist < 8) {
          triggerThunderStrike();
        }
      }
      isDragging = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });

    // Handle container resize
    const handleResize = () => {
      if (!canvas || !rendererRef.current || !cameraRef.current) return;
      const width = canvas.clientWidth || 600;
      const height = canvas.clientHeight || 420;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    // 9. 60FPS Render & Physics Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth zoom interpolation
      stateRef.current.currentZoom += (stateRef.current.targetZoom - stateRef.current.currentZoom) * 0.1;
      camera.position.z = stateRef.current.currentZoom;

      if (currentModelGroupRef.current) {
        // Animate dynamic lightning aura
        const aura = currentModelGroupRef.current.userData?.lightningAura;
        if (aura) {
          const intensity = stateRef.current.mode === 'thunder' ? 1.0 : (stateRef.current.wireframe ? 0.7 : 0.3);
          animateLightningAura(aura, elapsedTime, intensity);
        }

        // Auto-rotation when not user-dragging
        if (stateRef.current.autoRotate && !isDragging) {
          currentModelGroupRef.current.rotation.y += 0.008;
        }

        // Inertia damping
        if (!isDragging) {
          rotSpeedX *= 0.92;
          rotSpeedY *= 0.92;
          currentModelGroupRef.current.rotation.x += rotSpeedX;
          currentModelGroupRef.current.rotation.y += rotSpeedY;
        }
      }

      // Smooth fillLight flash decay after lightning strike
      if (fillLightRef.current && flashIntensityRef.current > 3.4) {
        flashIntensityRef.current = THREE.MathUtils.lerp(flashIntensityRef.current, 3.4, 0.08);
        fillLightRef.current.intensity = flashIntensityRef.current;
      }

      // Rotate ground grid hologram subtly
      if (groundGridRef.current) {
        groundGridRef.current.rotation.y -= 0.002;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Thunder Strike interactive blast triggered on tap / click
  const triggerThunderStrike = () => {
    playThunderSound();
    flashIntensityRef.current = 11.5;
    if (fillLightRef.current) {
      fillLightRef.current.intensity = 11.5;
    }
    if (onToast) onToast('⚡ Mjölnir Awakens: High-Voltage Lightning Strike!');
  };

  // Switch Mjölnir Enchantment / Inspection Mode
  const changeHammerMode = (modeKey) => {
    if (modeKey === 'thunder') {
      triggerThunderStrike();
    } else {
      playBlipSound(950, 0.06);
    }
    setCurrentMode(modeKey);

    const scene = sceneRef.current;
    const envMap = envMapRef.current;
    if (!scene) return;

    if (currentModelGroupRef.current) {
      if (isGLTFLoadedRef.current) {
        // Update GLTF model styling seamlessly
        updateModelStyle(currentModelGroupRef.current, currentColor, isWireframe, modeKey);
      } else {
        // Fallback procedural model update
        scene.remove(currentModelGroupRef.current);
        const newModel = createDetailedMjolnir(currentColor, isWireframe, envMap, modeKey);
        newModel.rotation.set(0.18, 0.42, -0.22);
        scene.add(newModel);
        currentModelGroupRef.current = newModel;
      }
    }

    const labels = {
      classic: 'MJÖLNIR // URU FORGED STEEL',
      thunder: 'MJÖLNIR // THUNDER AWAKENED',
      bifrost: 'MJÖLNIR // BIFROST RADIANCE',
      ragnarok: 'MJÖLNIR // BATTLE-WORN RELIC'
    };
    if (onToast) onToast(`Relic State: ${labels[modeKey] || modeKey.toUpperCase()}`);
  };

  // Change Emissive Spectrum & Lighting Accent
  const changeColor = (hex, label) => {
    playLaserSound();
    setCurrentColor(hex);

    if (currentModelGroupRef.current) {
      updateModelStyle(currentModelGroupRef.current, hex, isWireframe, currentMode);
    }

    if (fillLightRef.current) {
      fillLightRef.current.color.set(hex);
    }

    if (onToast) onToast(`Asgardian Spectrum: ${label}`);
  };

  // Toggle Shading Mode (Solid Photorealistic Shaded vs Lattice Wireframe)
  const toggleWireframe = () => {
    playBlipSound(1250, 0.05);
    const nextVal = !isWireframe;
    setIsWireframe(nextVal);

    if (currentModelGroupRef.current) {
      updateModelStyle(currentModelGroupRef.current, currentColor, nextVal, currentMode);
    }

    if (onToast) {
      onToast(`Render Mode: ${nextVal ? 'LATTICE CAD BLUEPRINT' : 'PHOTOREALISTIC URU PBR'}`);
    }
  };

  // Toggle Auto-Rotation
  const toggleAutoRotate = () => {
    playBlipSound(800, 0.04);
    setAutoRotate(!autoRotate);
    if (onToast) {
      onToast(`Orbit Spin: ${!autoRotate ? 'ENABLED' : 'PAUSED'}`);
    }
  };

  // Zoom Helpers
  const adjustZoom = (delta) => {
    playBlipSound(1000, 0.03);
    stateRef.current.targetZoom = Math.max(2.8, Math.min(7.5, stateRef.current.targetZoom + delta));
  };

  // Hammer Enchantment Modes
  const hammerModes = [
    { key: 'classic', label: 'Uru Forged Steel', icon: 'fa-solid fa-hammer' },
    { key: 'thunder', label: 'Thunder Awakened', icon: 'fa-solid fa-bolt' },
    { key: 'bifrost', label: 'Bifrost Radiance', icon: 'fa-solid fa-wand-magic-sparkles' },
    { key: 'ragnarok', label: 'Battle-Worn Relic', icon: 'fa-solid fa-shield-halved' }
  ];

  const colors = [
    { hex: '#00d4ff', label: 'Thunder Lightning' },
    { hex: '#fbbf24', label: 'Bifrost Gold' },
    { hex: '#38bdf8', label: 'Sky Arc' },
    { hex: '#ff003c', label: 'Crimson Flare' }
  ];

  // Dynamic engineering specs
  const modeSpecs = {
    classic: {
      title: 'MJÖLNIR // URU HAMMER OF THOR',
      details: 'Forged in Nidavellir from the Heart of a Dying Star • Eitri & Dwarven Smiths',
      material: isWireframe ? 'Lattice CAD Blueprint' : 'Brushed Uru Metal, Norse Knotwork & Silver Helix'
    },
    thunder: {
      title: 'MJÖLNIR // GOD OF THUNDER ENCHANTED',
      details: 'Channeled with Atmospheric High-Voltage Lightning & Triquetra Rune Radiance',
      material: isWireframe ? 'Electric Resonance Vectors' : 'Charged Uru Metal with Crackling Lightning Aura'
    },
    bifrost: {
      title: 'MJÖLNIR // BIFROST DIVINE BLESSING',
      details: 'Infused with Asgardian Golden Energy & Cosmic Teleportation Magic',
      material: isWireframe ? 'Gold Wireframe Geometry' : 'Divine Gold Inlay, Polished Silver & Rich Leather'
    },
    ragnarok: {
      title: 'MJÖLNIR // BATTLE-WORN ANCIENT RELIC',
      details: "Weathered in Cosmic Wars • Inscribed with Odin's Worthiness Enchantment",
      material: isWireframe ? 'Hardened Iron Vectors' : 'Patina Weathered Steel & Woven Leather Grip'
    }
  };

  const activeSpec = modeSpecs[currentMode] || modeSpecs.classic;

  return (
    <section className="section" id="lab">
      <div className="section-header">
        <span className="section-tag">// 02 • REAL-TIME 3D FORGE</span>
        <h2 className="section-heading">
          THOR'S HAMMER <span className="neon-text">MJÖLNIR</span>
        </h2>
        <p className="section-sub">
          Forged from enchanted Uru metal in the heart of a dying star in Nidavellir. Examine the legendary hammer in real-time 3D — inspect the sacred Triquetra engraving, silver helical grip, Norse Celtic knotwork, and Asgardian lightning aura. Tap or click Mjölnir to summon thunder strikes.
        </p>
      </div>

      <div className="lab-container">
        {/* 3D Viewport */}
        <div className="lab-viewport">
          <canvas ref={canvasRef} id="lab-3d-canvas" style={{ width: '100%', height: '100%', cursor: 'grab' }} />

          {/* Top-Left 3D Asset Source Badge */}
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(6, 12, 28, 0.85)',
            border: '1px solid var(--glass-border)',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '1.05rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--primary-neon)',
            zIndex: 10
          }}>
            <i className="fa-solid fa-circle-check" style={{ color: '#00d4ff' }}></i>
            <span>{isGLTFLoaded ? 'AUTHENTIC 3D GLB LOADED' : 'INITIALIZING ASGARDIAN ASSET...'}</span>
          </div>

          {/* Top-Right Interactive Camera HUD Controls */}
          <div style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            display: 'flex',
            gap: '8px',
            zIndex: 10
          }}>
            <button
              onClick={() => adjustZoom(-0.6)}
              title="Zoom In"
              style={{
                background: 'rgba(6, 12, 28, 0.85)',
                border: '1px solid var(--glass-border)',
                color: 'var(--primary-neon)',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.2rem'
              }}
            >
              <i className="fa-solid fa-plus"></i>
            </button>
            <button
              onClick={() => adjustZoom(0.6)}
              title="Zoom Out"
              style={{
                background: 'rgba(6, 12, 28, 0.85)',
                border: '1px solid var(--glass-border)',
                color: 'var(--primary-neon)',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.2rem'
              }}
            >
              <i className="fa-solid fa-minus"></i>
            </button>
            <button
              onClick={toggleAutoRotate}
              title="Toggle Auto Rotation"
              style={{
                background: autoRotate ? 'rgba(0, 212, 255, 0.2)' : 'rgba(6, 12, 28, 0.85)',
                border: `1px solid ${autoRotate ? 'var(--primary-neon)' : 'var(--glass-border)'}`,
                color: autoRotate ? '#fff' : 'var(--text-secondary)',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.1rem'
              }}
            >
              <i className="fa-solid fa-arrows-rotate" style={{ marginRight: '6px' }}></i>
              {autoRotate ? 'ORBITING' : 'PAUSED'}
            </button>
          </div>

          {/* Bottom Viewport Hint */}
          <div className="viewport-hints">
            <span>
              <i className="fa-solid fa-bolt" style={{ color: '#00d4ff', marginRight: '6px' }}></i>
              Click Mjölnir to Summon Lightning • Drag to Orbit 360° • Scroll / Pinch to Zoom
            </span>
          </div>
        </div>

        {/* 3D Controls Sidecar */}
        <div className="lab-controls">
          <div className="control-box">
            <span className="control-box-title">
              <i className="fa-solid fa-hammer"></i> ASGARDIAN RELIC STATE
            </span>
            <div className="lab-pill-grid">
              {hammerModes.map((m) => (
                <button
                  key={m.key}
                  className={`lab-pill ${currentMode === m.key ? 'active' : ''}`}
                  onClick={() => changeHammerMode(m.key)}
                >
                  <i className={m.icon} style={{ marginRight: '6px' }}></i>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="control-box">
            <span className="control-box-title">
              <i className="fa-solid fa-palette"></i> SPECTRUM & LIGHTNING ACCENT
            </span>
            <div className="lab-pill-grid">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  className={`lab-pill ${currentColor === c.hex ? 'active' : ''}`}
                  onClick={() => changeColor(c.hex, c.label)}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: c.hex,
                      marginRight: '6px',
                      boxShadow: `0 0 6px ${c.hex}`
                    }}
                  />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="control-box">
            <span className="control-box-title">
              <i className="fa-solid fa-wrench"></i> SHADER RENDER MODE
            </span>
            <button
              className={`btn btn-cyber-secondary w-full ${isWireframe ? 'active' : ''}`}
              onClick={toggleWireframe}
            >
              <i className={isWireframe ? "fa-solid fa-hammer" : "fa-solid fa-vector-square"}></i>
              <span>{isWireframe ? 'Switch to Photorealistic Uru Solid' : 'Switch to Lattice CAD Wireframe'}</span>
            </button>
          </div>

          <div className="lab-stats-terminal">
            <div className="stat-row">
              <span className="stat-k">ACTIVE RELIC</span>
              <span className="stat-v neon-accent">{activeSpec.title}</span>
            </div>
            <div className="stat-row">
              <span className="stat-k">INSCRIPTION</span>
              <span className="stat-v" style={{ fontSize: '1.05rem', textAlign: 'right' }}>
                {activeSpec.details}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-k">SURFACE SHADER</span>
              <span className="stat-v">{activeSpec.material}</span>
            </div>
            <div className="stat-row">
              <span className="stat-k">ODIN'S ENCHANTMENT</span>
              <span className="stat-v" style={{ fontStyle: 'italic', color: '#fbbf24' }}>
                "Whosoever holds this hammer..."
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-k">FRAME RATE</span>
              <span className="stat-v neon-accent">60.0 FPS LOCKED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
