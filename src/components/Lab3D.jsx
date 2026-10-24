import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { playBlipSound, playLaserSound } from '../utils/audio';
import { 
  createStudioEnvMap,
  createDetailedNissanGTR, 
  createDetailedEiffelTower, 
  createDetailedCinquefoilKnot,
  createDetailedTorusKnot,
  createDetailedQuantumCore,
  updateModelStyle
} from '../utils/models3D';

export function Lab3D({ onToast }) {
  const canvasRef = useRef(null);
  const [currentShape, setCurrentShape] = useState('eiffel');
  const [currentColor, setCurrentColor] = useState('#ff003c');
  const [isWireframe, setIsWireframe] = useState(false); // Default to realistic Solid Shaded mode!
  const [autoRotate, setAutoRotate] = useState(true);

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const currentModelGroupRef = useRef(null);
  const envMapRef = useRef(null);
  const fillLightRef = useRef(null);
  const groundGridRef = useRef(null);

  // Store user interaction states in refs to prevent closure staling
  const stateRef = useRef({
    shape: 'eiffel',
    color: '#ff003c',
    wireframe: false,
    autoRotate: true,
    targetZoom: 5.6,
    currentZoom: 5.6
  });

  useEffect(() => {
    stateRef.current.shape = currentShape;
    stateRef.current.color = currentColor;
    stateRef.current.wireframe = isWireframe;
    stateRef.current.autoRotate = autoRotate;
  }, [currentShape, currentColor, isWireframe, autoRotate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const w = canvas.clientWidth || 600;
    const h = canvas.clientHeight || 420;

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(0, 0.4, 5.6);
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
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // 3. Procedural Studio Softbox Environment Map
    const envMap = createStudioEnvMap(renderer);
    scene.environment = envMap;
    envMapRef.current = envMap;

    // 4. Cinematic 3-Point Lighting Studio
    // Key Light (Overhead daylight softbox)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    // Dynamic Emissive Fill Light
    const fillLight = new THREE.PointLight(0x00f0ff, 3.2, 25);
    fillLight.position.set(-5, 3, 4);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    // Rim / Silhouette Backlight
    const rimLight = new THREE.DirectionalLight(0x60a5fa, 2.0);
    rimLight.position.set(0, -2, -6);
    scene.add(rimLight);

    // Warm Horizon Kick Light
    const kickLight = new THREE.PointLight(0xf472b6, 1.8, 20);
    kickLight.position.set(5, -3, -3);
    scene.add(kickLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    // 5. Holographic Ground Showroom Pedestal
    const groundGroup = new THREE.Group();
    groundGroup.position.set(0, -2.4, 0);

    const gridHelper = new THREE.GridHelper(8, 20, 0x00f0ff, 0x1e293b);
    gridHelper.position.y = 0.01;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.35;
    groundGroup.add(gridHelper);

    const ringGeom = new THREE.RingGeometry(0.5, 3.5, 48);
    ringGeom.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    groundGroup.add(ringMesh);

    scene.add(groundGroup);
    groundGridRef.current = groundGroup;

    // 6. Instantiate Initial Detailed Model (Eiffel Tower)
    const initialModel = createDetailedEiffelTower('#ff003c', false, envMap);
    scene.add(initialModel);
    currentModelGroupRef.current = initialModel;

    // 7. Interactive Mouse / Touch Drag Orbit Controls with Damping
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let rotSpeedX = 0;
    let rotSpeedY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onMouseMove = (e) => {
      if (!isDragging || !currentModelGroupRef.current) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      rotSpeedY = deltaX * 0.008;
      rotSpeedX = deltaY * 0.008;

      currentModelGroupRef.current.rotation.y += rotSpeedY;
      currentModelGroupRef.current.rotation.x = Math.max(
        -0.6,
        Math.min(0.6, currentModelGroupRef.current.rotation.x + rotSpeedX)
      );

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    // Mouse Wheel Zoom
    const onWheel = (e) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.004;
      stateRef.current.targetZoom = Math.max(2.8, Math.min(8.5, stateRef.current.targetZoom + zoomDelta));
    };

    // Mobile Touch Support
    const onTouchStart = (e) => {
      if (e.touches.length > 0) {
        isDragging = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length === 0 || !currentModelGroupRef.current) return;
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;

      rotSpeedY = deltaX * 0.012;
      rotSpeedX = deltaY * 0.012;

      currentModelGroupRef.current.rotation.y += rotSpeedY;
      currentModelGroupRef.current.rotation.x = Math.max(
        -0.6,
        Math.min(0.6, currentModelGroupRef.current.rotation.x + rotSpeedX)
      );

      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });

    // 8. Responsive Canvas Resize
    const handleResize = () => {
      if (!canvas.parentElement) return;
      const width = canvas.parentElement.clientWidth;
      const height = canvas.parentElement.clientHeight || 420;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 9. 60FPS High-Definition Render Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth camera zoom interpolation
      stateRef.current.currentZoom += (stateRef.current.targetZoom - stateRef.current.currentZoom) * 0.1;
      camera.position.z = stateRef.current.currentZoom;

      const model = currentModelGroupRef.current;
      if (model) {
        if (!isDragging) {
          // Inertial rotational damping
          rotSpeedX *= 0.92;
          rotSpeedY *= 0.92;
          model.rotation.y += rotSpeedY;
          model.rotation.x += rotSpeedX;

          // Auto-rotation when enabled
          if (stateRef.current.autoRotate) {
            model.rotation.y += 0.007;
          }
        }
      }

      // Slowly rotate ground showroom grid
      if (groundGridRef.current) {
        groundGridRef.current.rotation.y += 0.0015;
      }

      renderer.render(scene, camera);
    };
    animate();

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

  // Switch 3D Model Group
  const changeShape = (shapeKey) => {
    playBlipSound(950, 0.06);
    setCurrentShape(shapeKey);

    const scene = sceneRef.current;
    const envMap = envMapRef.current;
    if (!scene) return;

    // Remove existing model
    if (currentModelGroupRef.current) {
      scene.remove(currentModelGroupRef.current);
    }

    let newModel;
    const wireframe = isWireframe;
    const color = currentColor;

    if (shapeKey === 'gtr') {
      newModel = createDetailedNissanGTR(color, wireframe, envMap);
      // Dynamic initial 3/4 front quarter viewing angle
      newModel.rotation.set(0.12, -0.65, 0);
      stateRef.current.targetZoom = 5.2;
    } else if (shapeKey === 'eiffel') {
      newModel = createDetailedEiffelTower(color, wireframe, envMap);
      newModel.rotation.set(0.05, 0.45, 0);
      stateRef.current.targetZoom = 5.6;
    } else if (shapeKey === 'cinquefoil' || shapeKey === 'head') {
      newModel = createDetailedCinquefoilKnot(color, wireframe, envMap);
      newModel.rotation.set(0.1, 0, 0);
      stateRef.current.targetZoom = 5.2;
    } else if (shapeKey === 'torus') {
      newModel = createDetailedTorusKnot(color, wireframe, envMap);
      newModel.rotation.set(0, 0, 0);
      stateRef.current.targetZoom = 5.0;
    } else if (shapeKey === 'core') {
      newModel = createDetailedQuantumCore(color, wireframe, envMap);
      newModel.rotation.set(0, 0, 0);
      stateRef.current.targetZoom = 5.4;
    }

    if (newModel) {
      scene.add(newModel);
      currentModelGroupRef.current = newModel;
    }

    const labels = {
      eiffel: 'EIFFEL TOWER (ARCHITECTURAL CAD)',
      gtr: 'NISSAN SKYLINE GT-R R34 (JDM LEGEND)',
      cinquefoil: 'CINQUEFOIL TORUS KNOT (3, 5)',
      torus: 'TREFOIL TORUS KNOT (2, 3)',
      core: 'QUANTUM CORE REACTOR'
    };
    if (onToast) onToast(`Model Loaded: ${labels[shapeKey] || shapeKey.toUpperCase()}`);
  };

  // Change Emissive Spectrum & Lighting Accent
  const changeColor = (hex, label) => {
    playLaserSound();
    setCurrentColor(hex);

    if (currentModelGroupRef.current) {
      updateModelStyle(currentModelGroupRef.current, hex, isWireframe);
    }

    if (fillLightRef.current) {
      fillLightRef.current.color.set(hex);
    }

    if (onToast) onToast(`Spectrum: ${label}`);
  };

  // Toggle Shading Mode (Solid Photorealistic Shaded vs Lattice Wireframe)
  const toggleWireframe = () => {
    playBlipSound(1250, 0.05);
    const nextVal = !isWireframe;
    setIsWireframe(nextVal);

    if (currentModelGroupRef.current) {
      updateModelStyle(currentModelGroupRef.current, currentColor, nextVal);
    }

    if (onToast) {
      onToast(`Render Mode: ${nextVal ? 'LATTICE WIREFRAME' : 'PHOTOREALISTIC SOLID'}`);
    }
  };

  // Toggle Auto-Rotation
  const toggleAutoRotate = () => {
    playBlipSound(800, 0.04);
    setAutoRotate(!autoRotate);
    if (onToast) {
      onToast(`Auto-Rotate: ${!autoRotate ? 'ENABLED' : 'PAUSED'}`);
    }
  };

  // Zoom Helpers
  const adjustZoom = (delta) => {
    playBlipSound(1000, 0.03);
    stateRef.current.targetZoom = Math.max(2.8, Math.min(8.5, stateRef.current.targetZoom + delta));
  };

  const shapes = [
    { key: 'eiffel', label: 'Eiffel Tower', icon: 'fa-solid fa-monument' },
    { key: 'gtr', label: 'Nissan GT-R R34', icon: 'fa-solid fa-car-side' },
    { key: 'cinquefoil', label: 'Cinquefoil Knot', icon: 'fa-solid fa-certificate' },
    { key: 'torus', label: 'Trefoil Knot', icon: 'fa-solid fa-infinity' },
    { key: 'core', label: 'Quantum Core', icon: 'fa-solid fa-atom' }
  ];

  const colors = [
    { hex: '#ff003c', label: 'Crimson Laser' },
    { hex: '#ec4899', label: 'Neon Pink' },
    { hex: '#10b981', label: 'Emerald Grid' },
    { hex: '#f59e0b', label: 'Amber Core' }
  ];

  // Dynamic engineering specs based on the active model
  const modelSpecs = {
    eiffel: {
      title: 'EIFFEL TOWER (PARISIAN CAD)',
      details: '330m Wrought Iron • 4 Parabolic Arches • Dual Observation Decks & Summit Beacon',
      material: isWireframe ? 'Lattice Blueprints' : 'Puddle Iron Metallic PBR'
    },
    gtr: {
      title: 'NISSAN SKYLINE GT-R R34',
      details: 'RB26DETT Twin-Turbo • NISMO 6-Spoke Wheels • Carbon Diffuser & R34 Taillights',
      material: isWireframe ? 'Aero Wireframe' : 'High-Gloss Clearcoat & Carbon PBR'
    },
    cinquefoil: {
      title: 'CINQUEFOIL TORUS KNOT (3, 5)',
      details: '5-Lobed Non-Trivial Star Knot • Titanium PBR • Dual-Strand Laser Core & Orbit Rings',
      material: isWireframe ? 'Higher-Order Lattice' : 'Iridescent Titanium & Laser PBR'
    },
    head: {
      title: 'CINQUEFOIL TORUS KNOT (3, 5)',
      details: '5-Lobed Non-Trivial Star Knot • Titanium PBR • Dual-Strand Laser Core & Orbit Rings',
      material: isWireframe ? 'Higher-Order Lattice' : 'Iridescent Titanium & Laser PBR'
    },
    torus: {
      title: 'TREFOIL TORUS KNOT (2, 3)',
      details: 'Classic 3-Lobed Parametric Braid • Mirror Chrome PBR • Waveguide Core',
      material: isWireframe ? 'Parametric Lattice' : 'Chrome Plated Specular PBR'
    },
    core: {
      title: 'QUANTUM CORE REACTOR',
      details: 'Triple Concentric Gyro Gimbal • Central Energy Node • Resonance Waveguide',
      material: isWireframe ? 'Resonance Vectors' : 'Refractive Crystal & Brushed Alloy'
    }
  };

  const activeSpec = modelSpecs[currentShape] || modelSpecs.eiffel;

  return (
    <section className="section" id="lab">
      <div className="section-header">
        <span className="section-tag">// 02 • REAL-TIME GRAPHICS ENGINE</span>
        <h2 className="section-heading">
          INTERACTIVE <span className="neon-text">3D LAB</span>
        </h2>
        <p className="section-sub">
          Explore realistic 3D architectural monuments, the iconic Nissan GT-R R34 sports coupe, and intricate mathematical torus knot geometries with studio HDR lighting, PBR reflections, and wireframe lattice shaders.
        </p>
      </div>

      <div className="lab-container">
        {/* 3D Viewport */}
        <div className="lab-viewport">
          <canvas ref={canvasRef} id="lab-3d-canvas" style={{ width: '100%', height: '100%' }} />

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
              onClick={() => adjustZoom(-0.8)}
              title="Zoom In"
              style={{
                background: 'rgba(10, 14, 24, 0.85)',
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
              onClick={() => adjustZoom(0.8)}
              title="Zoom Out"
              style={{
                background: 'rgba(10, 14, 24, 0.85)',
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
                background: autoRotate ? 'rgba(255, 0, 60, 0.2)' : 'rgba(10, 14, 24, 0.85)',
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
              {autoRotate ? 'SPINNING' : 'PAUSED'}
            </button>
          </div>

          {/* Bottom Viewport Hint */}
          <div className="viewport-hints">
            <span>
              <i className="fa-solid fa-hand-pointer"></i> Drag to Orbit 360° • Scroll / Pinch to Zoom • Studio HDR
            </span>
          </div>
        </div>

        {/* 3D Controls Sidecar */}
        <div className="lab-controls">
          <div className="control-box">
            <span className="control-box-title">
              <i className="fa-solid fa-cube"></i> 3D STRUCTURAL MODEL
            </span>
            <div className="lab-pill-grid">
              {shapes.map((s) => (
                <button
                  key={s.key}
                  className={`lab-pill ${currentShape === s.key ? 'active' : ''}`}
                  onClick={() => changeShape(s.key)}
                >
                  <i className={s.icon} style={{ marginRight: '6px' }}></i>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="control-box">
            <span className="control-box-title">
              <i className="fa-solid fa-palette"></i> SPECTRUM & REFLECTION ACCENT
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
              <i className={isWireframe ? "fa-solid fa-cube" : "fa-solid fa-vector-square"}></i>
              <span>{isWireframe ? 'Switch to Photorealistic Solid' : 'Switch to Lattice Wireframe'}</span>
            </button>
          </div>

          <div className="lab-stats-terminal">
            <div className="stat-row">
              <span className="stat-k">ACTIVE MODEL</span>
              <span className="stat-v neon-accent">{activeSpec.title}</span>
            </div>
            <div className="stat-row">
              <span className="stat-k">SPECIFICATION</span>
              <span className="stat-v" style={{ fontSize: '1.05rem', textAlign: 'right' }}>
                {activeSpec.details}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-k">SURFACE SHADER</span>
              <span className="stat-v">{activeSpec.material}</span>
            </div>
            <div className="stat-row">
              <span className="stat-k">TONE MAPPING</span>
              <span className="stat-v">ACES Filmic Studio HDR</span>
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
