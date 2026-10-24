import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Colossal 3D Interactive Megastructure Centerpiece Background
 * Replaces falling binary digits with a massive, high-detail sci-fi 3D object:
 * - Colossal Singularity Reactor / Titan Mech Spire / Hyper-Torus
 * - Multi-tiered concentric gyroscopic gimbal rings & Dyson mega-framework
 * - Internal pulsating polyhedral crystal core with dynamic lighting
 * - Autonomous orbiting sensor drone swarm & holographic telemetry reticles
 * - Volumetric deep-space cyber ember nebula (1,600 particles)
 * - Dynamic 3D interactive cursor parallax, drag-to-spin inertia, and click shockwave
 */
export function Background3D({ mode = 'reactor', theme = 'red' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Palette Configurations
    const palettes = {
      red: {
        primary: '#ff003c',
        secondary: '#dc2626',
        core: 0xff003c,
        coreInterior: 0xff3366,
        metalDark: 0x180d11,
        metalLight: 0x3d1c24,
        ringTruss: 0x241016,
        highlight: 0xff2a55,
        laser: 0xff003c,
        lightPoint: 0xff1744,
        ambient: 0x120407,
        particle: 0xff1e46
      },
      ruby: {
        primary: '#e11d48',
        secondary: '#be123c',
        core: 0xe11d48,
        coreInterior: 0xfb7185,
        metalDark: 0x160c11,
        metalLight: 0x381822,
        ringTruss: 0x220e15,
        highlight: 0xf43f5e,
        laser: 0xe11d48,
        lightPoint: 0xf43f5e,
        ambient: 0x100307,
        particle: 0xe11d48
      },
      matrix: {
        primary: '#10b981',
        secondary: '#059669',
        core: 0x10b981,
        coreInterior: 0x34d399,
        metalDark: 0x0a1611,
        metalLight: 0x143324,
        ringTruss: 0x0d2419,
        highlight: 0x34d399,
        laser: 0x10b981,
        lightPoint: 0x10b981,
        ambient: 0x03120b,
        particle: 0x10b981
      },
      amber: {
        primary: '#f59e0b',
        secondary: '#d97706',
        core: 0xf59e0b,
        coreInterior: 0xfbbf24,
        metalDark: 0x19140a,
        metalLight: 0x362812,
        ringTruss: 0x241b0d,
        highlight: 0xfbbf24,
        laser: 0xf59e0b,
        lightPoint: 0xf59e0b,
        ambient: 0x140c03,
        particle: 0xf59e0b
      },
      cyan: {
        primary: '#00f0ff',
        secondary: '#0ea5e9',
        core: 0x00f0ff,
        coreInterior: 0x38bdf8,
        metalDark: 0x0a131c,
        metalLight: 0x15293d,
        ringTruss: 0x0e1f30,
        highlight: 0x38bdf8,
        laser: 0x00f0ff,
        lightPoint: 0x00f0ff,
        ambient: 0x040b14,
        particle: 0x00f0ff
      }
    };

    const curPalette = palettes[theme] || palettes.red;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(curPalette.ambient, 0.015);

    let width = window.innerWidth;
    let height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 22);

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // Root Transformation Groups
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    const megaGroup = new THREE.Group();
    worldGroup.add(megaGroup);

    // Dynamic animatable elements registry
    const animatables = {
      gimbal1: null,
      gimbal2: null,
      gimbal3: null,
      coreCrystal: null,
      coreInner: null,
      coreCage: null,
      conduitCells: [],
      radiators: [],
      drones: [],
      spireShields: [],
      torusNodes: [],
      holoReticles: []
    };

    // 3. Shared Materials
    const metalMat = new THREE.MeshStandardMaterial({
      color: curPalette.metalDark,
      roughness: 0.28,
      metalness: 0.92,
      emissive: curPalette.metalDark,
      emissiveIntensity: 0.15
    });

    const titaniumMat = new THREE.MeshStandardMaterial({
      color: curPalette.metalLight,
      roughness: 0.18,
      metalness: 0.96,
      emissive: curPalette.core,
      emissiveIntensity: 0.08
    });

    const coreCrystalMat = new THREE.MeshPhysicalMaterial({
      color: curPalette.core,
      roughness: 0.12,
      metalness: 0.45,
      transmission: 0.55,
      transparent: true,
      opacity: 0.92,
      emissive: curPalette.core,
      emissiveIntensity: 1.8
    });

    const coreInnerMat = new THREE.MeshBasicMaterial({
      color: curPalette.coreInterior
    });

    const laserMat = new THREE.MeshStandardMaterial({
      color: curPalette.highlight,
      emissive: curPalette.highlight,
      emissiveIntensity: 2.2,
      roughness: 0.1,
      metalness: 0.9
    });

    const cageLineMat = new THREE.LineBasicMaterial({
      color: curPalette.highlight,
      transparent: true,
      opacity: 0.75
    });

    const holoLineMat = new THREE.LineBasicMaterial({
      color: curPalette.primary,
      transparent: true,
      opacity: 0.35
    });

    // =========================================================================
    // BUILDER: COLOSSAL SINGULARITY REACTOR (MODE: 'reactor')
    // =========================================================================
    function buildSingularityReactor() {
      // 1. Inner Singularity Heart
      const coreGroup = new THREE.Group();
      megaGroup.add(coreGroup);

      // Faceted Crystalline Core
      const coreGeom = new THREE.IcosahedronGeometry(2.2, 1);
      const coreMesh = new THREE.Mesh(coreGeom, coreCrystalMat);
      coreGroup.add(coreMesh);
      animatables.coreCrystal = coreMesh;

      // Inner blazing seed
      const innerGeom = new THREE.OctahedronGeometry(1.2, 0);
      const innerMesh = new THREE.Mesh(innerGeom, coreInnerMat);
      coreGroup.add(innerMesh);
      animatables.coreInner = innerMesh;

      // Exoskeleton Wireframe Cage
      const cageGeom = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.55, 1));
      const cageMesh = new THREE.LineSegments(cageGeom, cageLineMat);
      coreGroup.add(cageMesh);
      animatables.coreCage = cageMesh;

      // 12 Vertex Energy Spheres
      const sphereGeom = new THREE.SphereGeometry(0.12, 10, 10);
      const nodePosArr = coreGeom.attributes.position.array;
      const addedNodes = new Set();
      for (let i = 0; i < nodePosArr.length; i += 3) {
        const key = `${nodePosArr[i].toFixed(2)},${nodePosArr[i+1].toFixed(2)},${nodePosArr[i+2].toFixed(2)}`;
        if (!addedNodes.has(key)) {
          addedNodes.add(key);
          const nodeMesh = new THREE.Mesh(sphereGeom, laserMat);
          nodeMesh.position.set(nodePosArr[i] * 1.16, nodePosArr[i+1] * 1.16, nodePosArr[i+2] * 1.16);
          coreGroup.add(nodeMesh);
        }
      }

      // 6 Heavy Hydraulic Support Pylons radiating outward
      const pylonGeom = new THREE.CylinderGeometry(0.14, 0.14, 6.2, 12);
      const pylonRingGeom = new THREE.TorusGeometry(0.24, 0.05, 8, 20);

      const axes = [
        [1, 0, 0], [-1, 0, 0],
        [0, 1, 0], [0, -1, 0],
        [0, 0, 1], [0, 0, -1]
      ];
      axes.forEach(([x, y, z]) => {
        const pylon = new THREE.Mesh(pylonGeom, titaniumMat);
        const dir = new THREE.Vector3(x, y, z);
        pylon.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        pylon.position.copy(dir.clone().multiplyScalar(1.8));
        coreGroup.add(pylon);

        const pylonCollar = new THREE.Mesh(pylonRingGeom, laserMat);
        pylonCollar.quaternion.copy(pylon.quaternion);
        pylonCollar.position.copy(dir.clone().multiplyScalar(3.2));
        pylonCollar.rotateX(Math.PI / 2);
        coreGroup.add(pylonCollar);
      });

      // Dual Hexagonal Radiators
      for (let r = 0; r < 2; r++) {
        const radGroup = new THREE.Group();
        const hexRingGeom = new THREE.TorusGeometry(3.2 + r * 0.4, 0.08, 6, 6);
        const hexRing = new THREE.Mesh(hexRingGeom, titaniumMat);
        radGroup.add(hexRing);

        // 6 Radial Vents
        for (let v = 0; v < 6; v++) {
          const ventAngle = (v / 6) * Math.PI * 2;
          const vent = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.2), laserMat);
          vent.position.set(Math.cos(ventAngle) * 3.3, Math.sin(ventAngle) * 3.3, 0);
          vent.rotation.z = ventAngle;
          radGroup.add(vent);
        }
        radGroup.rotation.x = r === 0 ? 0.3 : -0.3;
        megaGroup.add(radGroup);
        animatables.radiators.push(radGroup);
      }

      // =======================================================================
      // GIMBAL RING 1 (Inner Mechanical Ring)
      // =======================================================================
      const gimbal1 = new THREE.Group();
      megaGroup.add(gimbal1);
      animatables.gimbal1 = gimbal1;

      const ring1Geom = new THREE.TorusGeometry(4.8, 0.16, 16, 80);
      const ring1Mesh = new THREE.Mesh(ring1Geom, metalMat);
      gimbal1.add(ring1Mesh);

      // 16 Mechanical Segment Teeth Brackets
      const toothGeom = new THREE.BoxGeometry(0.32, 0.42, 0.22);
      for (let i = 0; i < 16; i++) {
        const ang = (i / 16) * Math.PI * 2;
        const tooth = new THREE.Mesh(toothGeom, titaniumMat);
        tooth.position.set(Math.cos(ang) * 4.8, Math.sin(ang) * 4.8, 0);
        tooth.rotation.z = ang;
        gimbal1.add(tooth);
      }

      // 4 Capacitor Battery Cylinders
      const capGeom = new THREE.CylinderGeometry(0.24, 0.24, 1.1, 14);
      for (let c = 0; c < 4; c++) {
        const cAng = (c / 4) * Math.PI * 2 + Math.PI / 4;
        const cap = new THREE.Mesh(capGeom, metalMat);
        cap.position.set(Math.cos(cAng) * 4.8, Math.sin(cAng) * 4.8, 0);
        cap.rotation.z = cAng;
        const capBand = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.04, 8, 16), laserMat);
        cap.add(capBand);
        gimbal1.add(cap);
      }

      // =======================================================================
      // GIMBAL RING 2 (Middle Titanium Accelerator Ring)
      // =======================================================================
      const gimbal2 = new THREE.Group();
      gimbal2.rotation.x = Math.PI / 4;
      gimbal2.rotation.y = Math.PI / 6;
      megaGroup.add(gimbal2);
      animatables.gimbal2 = gimbal2;

      const ring2Geom = new THREE.TorusGeometry(7.6, 0.14, 16, 96);
      const ring2Mesh = new THREE.Mesh(ring2Geom, titaniumMat);
      gimbal2.add(ring2Mesh);

      // 32 Telemetry Notches & 8 Optical Sensor Pods
      const notchGeom = new THREE.BoxGeometry(0.1, 0.48, 0.14);
      for (let i = 0; i < 32; i++) {
        const ang = (i / 32) * Math.PI * 2;
        const notch = new THREE.Mesh(notchGeom, i % 4 === 0 ? laserMat : metalMat);
        notch.position.set(Math.cos(ang) * 7.6, Math.sin(ang) * 7.6, 0);
        notch.rotation.z = ang;
        gimbal2.add(notch);
      }

      const podGeom = new THREE.SphereGeometry(0.28, 12, 12);
      for (let p = 0; p < 8; p++) {
        const pAng = (p / 8) * Math.PI * 2;
        const pod = new THREE.Mesh(podGeom, laserMat);
        pod.position.set(Math.cos(pAng) * 7.6, Math.sin(pAng) * 7.6, 0.2);
        gimbal2.add(pod);
      }

      // =======================================================================
      // GIMBAL RING 3 (Outer Megastructure Dyson Ring)
      // =======================================================================
      const gimbal3 = new THREE.Group();
      gimbal3.rotation.x = -Math.PI / 5;
      megaGroup.add(gimbal3);
      animatables.gimbal3 = gimbal3;

      const outerRadius = 11.6;
      const ring3Main = new THREE.Mesh(new THREE.TorusGeometry(outerRadius, 0.22, 16, 110), metalMat);
      gimbal3.add(ring3Main);

      // Parallel secondary truss rail
      const ring3Rail = new THREE.Mesh(new THREE.TorusGeometry(outerRadius + 0.7, 0.09, 12, 90), titaniumMat);
      gimbal3.add(ring3Rail);

      // 24 Cross Struts between main ring and outer rail
      const strutGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.7, 8);
      for (let s = 0; s < 24; s++) {
        const sAng = (s / 24) * Math.PI * 2;
        const strut = new THREE.Mesh(strutGeom, titaniumMat);
        strut.position.set(Math.cos(sAng) * (outerRadius + 0.35), Math.sin(sAng) * (outerRadius + 0.35), 0);
        strut.rotation.z = sAng - Math.PI / 2;
        gimbal3.add(strut);
      }

      // 12 Outward Docking Spires
      const spireGeom = new THREE.ConeGeometry(0.28, 2.2, 6);
      for (let d = 0; d < 12; d++) {
        const dAng = (d / 12) * Math.PI * 2;
        const spire = new THREE.Mesh(spireGeom, titaniumMat);
        spire.position.set(Math.cos(dAng) * (outerRadius + 1.6), Math.sin(dAng) * (outerRadius + 1.6), 0);
        spire.rotation.z = dAng - Math.PI / 2;
        gimbal3.add(spire);

        // Tip Beacon Light
        const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), laserMat);
        beacon.position.set(0, 1.1, 0);
        spire.add(beacon);
      }

      // 24 Segmented Glowing Conduit Cells (For animated energy wave chasing)
      const cellGeom = new THREE.BoxGeometry(0.4, 0.16, 0.32);
      for (let c = 0; c < 24; c++) {
        const cAng = (c / 24) * Math.PI * 2;
        const cellMat = new THREE.MeshStandardMaterial({
          color: curPalette.core,
          emissive: curPalette.core,
          emissiveIntensity: 0.8,
          roughness: 0.2
        });
        const cell = new THREE.Mesh(cellGeom, cellMat);
        cell.position.set(Math.cos(cAng) * outerRadius, Math.sin(cAng) * outerRadius, 0.18);
        cell.rotation.z = cAng;
        gimbal3.add(cell);
        animatables.conduitCells.push(cell);
      }

      // =======================================================================
      // HOLOGRAPHIC TELEMETRY TARGETING RETICLES
      // =======================================================================
      const reticleRadii = [6.0, 9.4, 13.8];
      reticleRadii.forEach((r, idx) => {
        const circlePts = [];
        const segs = 64;
        for (let i = 0; i <= segs; i++) {
          const theta = (i / segs) * Math.PI * 2;
          circlePts.push(new THREE.Vector3(Math.cos(theta) * r, Math.sin(theta) * r, 0));
        }
        const circleGeom = new THREE.BufferGeometry().setFromPoints(circlePts);
        const reticleLine = new THREE.LineLoop(circleGeom, holoLineMat);
        reticleLine.rotation.x = idx * 0.2;
        reticleLine.rotation.y = idx * 0.15;
        megaGroup.add(reticleLine);
        animatables.holoReticles.push({ line: reticleLine, speed: 0.003 * (idx % 2 === 0 ? 1 : -1) });
      });

      // =======================================================================
      // AUTONOMOUS SENSOR DRONE FLEET
      // =======================================================================
      const droneGeom = new THREE.ConeGeometry(0.18, 0.5, 4);
      for (let d = 0; d < 28; d++) {
        const drone = new THREE.Mesh(droneGeom, laserMat);
        const orbitRadius = 5.5 + Math.random() * 8.5;
        const orbitSpeed = (0.4 + Math.random() * 0.8) * (Math.random() > 0.5 ? 1 : -1);
        const orbitInc = (Math.random() - 0.5) * Math.PI * 0.8;
        const startPhase = Math.random() * Math.PI * 2;

        megaGroup.add(drone);
        animatables.drones.push({
          mesh: drone,
          radius: orbitRadius,
          speed: orbitSpeed,
          inclination: orbitInc,
          phase: startPhase
        });
      }
    }

    // =========================================================================
    // BUILDER: TITAN MECH SPIRE / MONOLITH (MODE: 'spire')
    // =========================================================================
    function buildTitanSpire() {
      const spireGroup = new THREE.Group();
      megaGroup.add(spireGroup);

      // Central Tall Faceted Hexagonal Monolith
      const monolithGeom = new THREE.CylinderGeometry(1.2, 2.2, 17, 6);
      const monolith = new THREE.Mesh(monolithGeom, titaniumMat);
      spireGroup.add(monolith);

      // Central glowing fissure / core channel
      const fissureGeom = new THREE.CylinderGeometry(0.25, 0.35, 17.2, 8);
      const fissure = new THREE.Mesh(fissureGeom, laserMat);
      spireGroup.add(fissure);

      // Wireframe overlay on monolith
      const wireGeom = new THREE.WireframeGeometry(new THREE.CylinderGeometry(1.25, 2.25, 17.1, 6));
      const wire = new THREE.LineSegments(wireGeom, cageLineMat);
      spireGroup.add(wire);

      // 8 Floating Segmented Armor Shield Plates
      for (let i = 0; i < 8; i++) {
        const shieldGeom = new THREE.BoxGeometry(1.2, 3.2, 0.25);
        const shield = new THREE.Mesh(shieldGeom, metalMat);
        const ang = (i / 8) * Math.PI * 2;
        const dist = 3.6 + (i % 2) * 0.8;
        const yPos = -6 + (i / 7) * 12;
        shield.position.set(Math.cos(ang) * dist, yPos, Math.sin(ang) * dist);
        shield.lookAt(0, yPos, 0);
        spireGroup.add(shield);
        animatables.spireShields.push({
          mesh: shield,
          baseAngle: ang,
          dist: dist,
          yPos: yPos,
          speed: 0.3 * (i % 2 === 0 ? 1 : -1)
        });
      }

      // 4 Horizontal Scanning Radar Rings
      for (let r = 0; r < 4; r++) {
        const ringGeom = new THREE.TorusGeometry(3.2 + r * 1.2, 0.08, 12, 64);
        const ring = new THREE.Mesh(ringGeom, laserMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -5 + r * 3.4;
        spireGroup.add(ring);
      }

      // Top Apex Beacon Flare
      const apexGeom = new THREE.OctahedronGeometry(1.4, 0);
      const apex = new THREE.Mesh(apexGeom, coreCrystalMat);
      apex.position.y = 9.8;
      spireGroup.add(apex);
      animatables.coreCrystal = apex;
    }

    // =========================================================================
    // BUILDER: HYPER-DIMENSIONAL SINGULARITY KNOT (MODE: 'torus')
    // =========================================================================
    function buildHyperTorus() {
      const knotGroup = new THREE.Group();
      megaGroup.add(knotGroup);

      // Massive Interlocking 4D Torus Knot
      const knotGeom = new THREE.TorusKnotGeometry(4.8, 1.3, 220, 32, 2, 3);
      const knot = new THREE.Mesh(knotGeom, coreCrystalMat);
      knotGroup.add(knot);
      animatables.coreCrystal = knot;

      // Wireframe overlay
      const knotWireGeom = new THREE.WireframeGeometry(new THREE.TorusKnotGeometry(4.85, 1.32, 100, 16, 2, 3));
      const knotWire = new THREE.LineSegments(knotWireGeom, cageLineMat);
      knotGroup.add(knotWire);
      animatables.coreCage = knotWire;

      // Dual Equatorial Resonance Rings
      for (let r = 0; r < 2; r++) {
        const ringGeom = new THREE.TorusGeometry(8.2 + r * 1.6, 0.12, 16, 80);
        const ring = new THREE.Mesh(ringGeom, titaniumMat);
        ring.rotation.x = r === 0 ? Math.PI / 3 : -Math.PI / 3;
        knotGroup.add(ring);
        if (r === 0) animatables.gimbal1 = ring;
        if (r === 1) animatables.gimbal2 = ring;
      }

      // 36 Traveling Quantum Energy Nodes
      const nodeGeom = new THREE.SphereGeometry(0.18, 10, 10);
      for (let i = 0; i < 36; i++) {
        const node = new THREE.Mesh(nodeGeom, laserMat);
        knotGroup.add(node);
        animatables.torusNodes.push({
          mesh: node,
          t: (i / 36) * Math.PI * 4,
          speed: 0.4 + (i % 3) * 0.1
        });
      }
    }

    // Instantiate chosen mode
    if (mode === 'spire') {
      buildTitanSpire();
    } else if (mode === 'torus') {
      buildHyperTorus();
    } else {
      buildSingularityReactor();
    }

    // =========================================================================
    // 4. VOLUMETRIC DEEP-SPACE CYBER EMBERS (1,600 PARTICLES)
    // =========================================================================
    const particleCount = 1600;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      // Spherical distribution
      const r = 4.0 + Math.random() * 32.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[idx] = basePositions[idx] = x;
      positions[idx + 1] = basePositions[idx + 1] = y;
      positions[idx + 2] = basePositions[idx + 2] = z;

      velocities[idx] = (Math.random() - 0.5) * 0.02;
      velocities[idx + 1] = (Math.random() - 0.5) * 0.02;
      velocities[idx + 2] = (Math.random() - 0.5) * 0.02;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Circular particle texture generator for high-definition glow dots
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    const radGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    radGrad.addColorStop(0, '#ffffff');
    radGrad.addColorStop(0.25, curPalette.primary);
    radGrad.addColorStop(0.7, 'rgba(255, 0, 60, 0.25)');
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pCtx.fillStyle = radGrad;
    pCtx.fillRect(0, 0, 64, 64);
    const particleTex = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.45,
      map: particleTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: new THREE.Color(curPalette.particle)
    });

    const particleSystem = new THREE.Points(particleGeom, particleMat);
    worldGroup.add(particleSystem);

    // =========================================================================
    // 5. DYNAMIC INTERACTIVE LIGHTING RIG
    // =========================================================================
    // Ambient cosmic fill
    const ambientLight = new THREE.AmbientLight(curPalette.ambient, 1.4);
    scene.add(ambientLight);

    // Central core pulsating point light
    const corePointLight = new THREE.PointLight(curPalette.core, 3.8, 38);
    corePointLight.position.set(0, 0, 0);
    scene.add(corePointLight);

    // Dynamic mouse cursor 3D spotlight
    const cursorLight = new THREE.PointLight(curPalette.lightPoint, 3.0, 32);
    cursorLight.position.set(0, 0, 8);
    scene.add(cursorLight);

    // Key directional highlights
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(16, 22, 18);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(curPalette.secondary, 2.4);
    dirLight2.position.set(-18, -14, -12);
    scene.add(dirLight2);

    // =========================================================================
    // 6. INTERACTIVE PHYSICS, MOUSE, TOUCH, SCROLL & SHOCKWAVE STATE
    // =========================================================================
    const mouse = {
      targetX: 0,
      targetY: 0,
      curX: 0,
      curY: 0,
      screenX: width / 2,
      screenY: height / 2,
      isDown: false,
      lastDownX: 0,
      lastDownY: 0
    };

    // Inertial rotation from dragging
    const dragPhysics = {
      isDragging: false,
      prevX: 0,
      prevY: 0,
      velX: 0,
      velY: 0,
      rotX: 0,
      rotY: 0
    };

    // Scroll parallax interpolation
    let scrollYPct = 0;
    let targetCameraY = 0;
    let targetCameraZ = 22;

    // Reactor overload shockwaves
    const shockwaves = [];
    let coreFlareIntensity = 0.0;

    // Resize Handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    // Mouse Tracking
    const handlePointerMove = (e) => {
      mouse.screenX = e.clientX;
      mouse.screenY = e.clientY;
      mouse.targetX = (e.clientX / width - 0.5) * 2;
      mouse.targetY = -(e.clientY / height - 0.5) * 2;

      if (dragPhysics.isDragging) {
        const deltaX = e.clientX - dragPhysics.prevX;
        const deltaY = e.clientY - dragPhysics.prevY;
        dragPhysics.velY += deltaX * 0.005;
        dragPhysics.velX += deltaY * 0.005;
        dragPhysics.prevX = e.clientX;
        dragPhysics.prevY = e.clientY;
      }
    };

    const handlePointerDown = (e) => {
      // Ignore if user clicked on an interactive UI control
      if (e.target.closest('button, a, input, textarea, select, .hud-panel, .modal-dialog, .cert-filter-btn')) {
        return;
      }

      dragPhysics.isDragging = true;
      dragPhysics.prevX = e.clientX;
      dragPhysics.prevY = e.clientY;
      mouse.lastDownX = e.clientX;
      mouse.lastDownY = e.clientY;
    };

    const triggerShockwave = (clientX, clientY) => {
      // Trigger Core Energy Flare
      coreFlareIntensity = 1.0;

      // Create Holographic Shockwave Ring
      const swGeom = new THREE.RingGeometry(0.5, 0.9, 48);
      const swMat = new THREE.MeshBasicMaterial({
        color: curPalette.highlight,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide
      });
      const swMesh = new THREE.Mesh(swGeom, swMat);
      swMesh.rotation.x = Math.PI / 2;
      megaGroup.add(swMesh);

      shockwaves.push({
        mesh: swMesh,
        radius: 0.5,
        maxRadius: 28.0,
        speed: 0.75,
        opacity: 0.95
      });

      // Scatter nearby particles with blast impulse
      const pArr = particleGeom.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const px = pArr[idx];
        const py = pArr[idx + 1];
        const pz = pArr[idx + 2];
        const dist = Math.hypot(px, py, pz);
        if (dist > 0.001 && dist < 18.0) {
          const impulse = (1.0 - dist / 18.0) * 0.9;
          velocities[idx] += (px / dist) * impulse;
          velocities[idx + 1] += (py / dist) * impulse;
          velocities[idx + 2] += (pz / dist) * impulse;
        }
      }
    };

    const handlePointerUp = (e) => {
      if (dragPhysics.isDragging) {
        dragPhysics.isDragging = false;
        const distMoved = Math.hypot(e.clientX - mouse.lastDownX, e.clientY - mouse.lastDownY);
        // If it was a quick tap/click without dragging, trigger the shockwave!
        if (distMoved < 6) {
          triggerShockwave(e.clientX, e.clientY);
        }
      }
    };

    const handleScroll = () => {
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      scrollYPct = window.scrollY / maxScroll;
      targetCameraY = -scrollYPct * 5.5;
      targetCameraZ = 22 - scrollYPct * 3.5;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // =========================================================================
    // 7. MAIN 60FPS THREE.JS RENDER LOOP
    // =========================================================================
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth cursor parallax interpolation
      mouse.curX += (mouse.targetX - mouse.curX) * 0.06;
      mouse.curY += (mouse.targetY - mouse.curY) * 0.06;

      // Update 3D Cursor Point Light
      cursorLight.position.x = mouse.curX * 14;
      cursorLight.position.y = mouse.curY * 11;
      cursorLight.position.z = 8.5;

      // Drag inertia physics damping
      dragPhysics.rotX += dragPhysics.velX;
      dragPhysics.rotY += dragPhysics.velY;
      dragPhysics.velX *= 0.93;
      dragPhysics.velY *= 0.93;

      // Camera tilt & scroll smoothing
      camera.position.x += (mouse.curX * 2.8 - camera.position.x) * 0.06;
      camera.position.y += (mouse.curY * 2.2 + targetCameraY - camera.position.y) * 0.06;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.06;
      camera.lookAt(0, targetCameraY * 0.35, 0);

      // Mega-Structure Core Rotations
      worldGroup.rotation.x = dragPhysics.rotX + mouse.curY * 0.18;
      worldGroup.rotation.y = dragPhysics.rotY + mouse.curX * 0.25 + scrollYPct * Math.PI * 0.8;

      // =======================================================================
      // ANIMATE SPECIFIC COMPONENTS
      // =======================================================================
      // 1. Organic Heartbeat Core Pulse
      const heartPulse = 1.0 + Math.sin(elapsedTime * 2.8) * 0.06 + Math.sin(elapsedTime * 5.6) * 0.02;
      if (animatables.coreCrystal) {
        animatables.coreCrystal.scale.set(heartPulse, heartPulse, heartPulse);
        animatables.coreCrystal.rotation.y += 0.008;
        animatables.coreCrystal.rotation.z += 0.005;

        // Flare boost from click shockwave
        if (coreFlareIntensity > 0.001) {
          animatables.coreCrystal.material.emissiveIntensity = 1.8 + coreFlareIntensity * 3.5;
          coreFlareIntensity *= 0.94;
        } else {
          animatables.coreCrystal.material.emissiveIntensity = 1.8 + Math.sin(elapsedTime * 3.0) * 0.4;
        }
      }

      if (animatables.coreInner) {
        animatables.coreInner.rotation.x -= 0.015;
        animatables.coreInner.rotation.y -= 0.018;
      }

      if (animatables.coreCage) {
        animatables.coreCage.rotation.x -= 0.006;
        animatables.coreCage.rotation.y += 0.009;
      }

      // 2. Gimbal Rings Gyroscopic Motion
      if (animatables.gimbal1) {
        animatables.gimbal1.rotation.z += 0.009;
        animatables.gimbal1.rotation.x += 0.005;
      }

      if (animatables.gimbal2) {
        animatables.gimbal2.rotation.z -= 0.007;
        animatables.gimbal2.rotation.y += 0.006;
      }

      if (animatables.gimbal3) {
        animatables.gimbal3.rotation.z += 0.004;
      }

      // Radiator hex rings counter-spin
      animatables.radiators.forEach((rad, idx) => {
        rad.rotation.z += (idx === 0 ? 0.012 : -0.012);
      });

      // Conduit Cells Sequential Energy Chase Wave
      const cellLen = animatables.conduitCells.length;
      if (cellLen > 0) {
        const waveStep = (elapsedTime * 14) % cellLen;
        animatables.conduitCells.forEach((cell, idx) => {
          const dist = Math.abs(idx - waveStep);
          const wrappedDist = Math.min(dist, cellLen - dist);
          if (wrappedDist < 2.5) {
            const glowVal = (1.0 - wrappedDist / 2.5) * 2.8;
            cell.material.emissiveIntensity = glowVal;
            cell.scale.set(1.15, 1.15, 1.15);
          } else {
            cell.material.emissiveIntensity = 0.5;
            cell.scale.set(1.0, 1.0, 1.0);
          }
        });
      }

      // Holographic Reticles
      animatables.holoReticles.forEach((item) => {
        item.line.rotation.z += item.speed;
      });

      // Drones Orbiting on Keplerian Planes
      animatables.drones.forEach((d) => {
        d.phase += d.speed * delta;
        const x = Math.cos(d.phase) * d.radius;
        const y = Math.sin(d.phase) * d.radius * Math.cos(d.inclination);
        const z = Math.sin(d.phase) * d.radius * Math.sin(d.inclination);
        d.mesh.position.set(x, y, z);
        d.mesh.lookAt(0, 0, 0);
      });

      // Spire Floating Armor Shields
      animatables.spireShields.forEach((s) => {
        s.baseAngle += s.speed * delta;
        const floatY = s.yPos + Math.sin(elapsedTime * 2.0 + s.baseAngle) * 0.4;
        s.mesh.position.set(Math.cos(s.baseAngle) * s.dist, floatY, Math.sin(s.baseAngle) * s.dist);
        s.mesh.lookAt(0, floatY, 0);
      });

      // Torus Knot Traveling Nodes
      animatables.torusNodes.forEach((n) => {
        n.t += n.speed * delta;
        const p = 2;
        const q = 3;
        const rKnot = 4.8;
        const tubeKnot = 1.3;
        const u = n.t;
        const cu = Math.cos(u);
        const su = Math.sin(u);
        const quOverP = (q / p) * u;
        const cqu = Math.cos(quOverP);
        const squ = Math.sin(quOverP);
        const x = (rKnot + tubeKnot * cqu) * cu;
        const y = (rKnot + tubeKnot * cqu) * su;
        const z = tubeKnot * squ;
        n.mesh.position.set(x, y, z);
      });

      // 3. Shockwave Ring Expansions
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += sw.speed;
        sw.opacity = Math.max(0, 1.0 - sw.radius / sw.maxRadius);
        sw.mesh.scale.set(sw.radius, sw.radius, 1);
        sw.mesh.material.opacity = sw.opacity;

        if (sw.radius >= sw.maxRadius) {
          megaGroup.remove(sw.mesh);
          sw.mesh.geometry.dispose();
          sw.mesh.material.dispose();
          shockwaves.splice(s, 1);
        }
      }

      // 4. Volumetric Cyber Embers Dynamics
      const pPos = particleGeom.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;

        // Apply velocities with damping
        pPos[idx] += velocities[idx];
        pPos[idx + 1] += velocities[idx + 1];
        pPos[idx + 2] += velocities[idx + 2];

        velocities[idx] *= 0.96;
        velocities[idx + 1] *= 0.96;
        velocities[idx + 2] *= 0.96;

        // Subtle gravitational pull back to base orbit
        const dx = basePositions[idx] - pPos[idx];
        const dy = basePositions[idx + 1] - pPos[idx + 1];
        const dz = basePositions[idx + 2] - pPos[idx + 2];
        pPos[idx] += dx * 0.015;
        pPos[idx + 1] += dy * 0.015;
        pPos[idx + 2] += dz * 0.015;

        // Slow organic cosmic drift
        pPos[idx] += Math.sin(elapsedTime * 0.4 + i) * 0.012;
        pPos[idx + 1] += Math.cos(elapsedTime * 0.35 + i) * 0.012;
      }
      particleGeom.attributes.position.needsUpdate = true;

      // Core point light pulse
      corePointLight.intensity = 3.6 + Math.sin(elapsedTime * 2.8) * 0.8 + coreFlareIntensity * 4.0;

      // Render Scene
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount or mode/theme switch
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('scroll', handleScroll);

      // Dispose Geometries & Materials
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [mode, theme]);

  return <canvas ref={canvasRef} id="bg-canvas" />;
}