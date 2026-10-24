import * as THREE from 'three';

/**
 * Procedural Studio Environment Map Generator
 * Generates an equirectangular HDR-style studio softbox reflection map
 * for photorealistic automotive clearcoat, chrome, and metallic reflections.
 */
export function createStudioEnvMap(renderer) {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Dark studio backdrop gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#0c121d');
  grad.addColorStop(0.2, '#182436');
  grad.addColorStop(0.5, '#283850');
  grad.addColorStop(0.8, '#101622');
  grad.addColorStop(1, '#05080d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Large overhead studio softbox bank
  const softbox1 = ctx.createRadialGradient(512, 80, 10, 512, 80, 240);
  softbox1.addColorStop(0, '#ffffff');
  softbox1.addColorStop(0.3, '#d8e8f8');
  softbox1.addColorStop(0.8, 'rgba(80, 140, 200, 0.4)');
  softbox1.addColorStop(1, 'rgba(20, 40, 60, 0)');
  ctx.fillStyle = softbox1;
  ctx.fillRect(200, 0, 624, 220);

  // Left lateral fill strip
  ctx.fillStyle = '#60a5fa';
  ctx.fillRect(60, 160, 140, 70);

  // Right warm accent strip
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(820, 160, 140, 70);

  // Subtle floor bounce horizon
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(0, 250, 1024, 12);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  const envMap = pmremGenerator.fromEquirectangular(texture).texture;
  pmremGenerator.dispose();
  return envMap;
}

/**
 * =========================================================================
 * 1. PHOTOREALISTIC NISSAN SKYLINE GT-R (R34) 3D MODEL
 * True-to-scale JDM legend with:
 * - Aggressive aerodynamic widebody unibody with blistered box flares
 * - Front bumper with carbon chin splitter, lower intercooler & twin NACA hood ducts
 * - Xenon projector headlights with amber indicators & GT-R grille badge
 * - Tinted cabin glass greenhouse with pillars & aerodynamic side mirrors
 * - Iconic tall dual-pedestal GT-R racing spoiler with carbon endplates
 * - Signature asymmetric quad round taillights with ruby glow
 * - Rear carbon diffuser & 4-inch angled titanium/chrome cannon exhaust
 * - 4 NISMO 6-spoke forged alloy wheels with Brembo calipers & vented rotors
 * =========================================================================
 */
export function createDetailedNissanGTR(themeColor = '#ff003c', isWireframe = false, envMap = null) {
  const carGroup = new THREE.Group();
  carGroup.name = 'NissanGTR';

  // --- Specialized Materials ---
  const paintMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(themeColor),
    wireframe: isWireframe,
    metalness: 0.88,
    roughness: 0.16,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    reflectivity: 0.98,
    envMap: envMap,
    envMapIntensity: 1.6,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: isWireframe ? 0.45 : 0.06
  });
  paintMat.userData = { type: 'paint' };

  const carbonMat = new THREE.MeshStandardMaterial({
    color: 0x14161b,
    wireframe: isWireframe,
    metalness: 0.5,
    roughness: 0.35,
    envMap: envMap,
    envMapIntensity: 1.2,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: isWireframe ? 0.35 : 0.0
  });
  carbonMat.userData = { type: 'carbon' };

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a1420,
    wireframe: isWireframe,
    metalness: 0.1,
    roughness: 0.04,
    transmission: isWireframe ? 0.0 : 0.72,
    transparent: true,
    opacity: isWireframe ? 1.0 : 0.78,
    envMap: envMap,
    envMapIntensity: 2.2,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: isWireframe ? 0.35 : 0.05
  });
  glassMat.userData = { type: 'glass' };

  const wheelRimMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    wireframe: isWireframe,
    metalness: 0.96,
    roughness: 0.14,
    envMap: envMap,
    envMapIntensity: 2.0,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: isWireframe ? 0.4 : 0.0
  });
  wheelRimMat.userData = { type: 'metal' };

  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x181a1e,
    wireframe: isWireframe,
    metalness: 0.08,
    roughness: 0.88,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: isWireframe ? 0.3 : 0.0
  });
  tireMat.userData = { type: 'tire' };

  const brakeRotorMat = new THREE.MeshStandardMaterial({
    color: 0x9ca3af,
    wireframe: isWireframe,
    metalness: 0.92,
    roughness: 0.28,
    envMap: envMap
  });

  const caliperMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Brembo Gold
    wireframe: isWireframe,
    metalness: 0.65,
    roughness: 0.25,
    emissive: 0xd97706,
    emissiveIntensity: isWireframe ? 0.4 : 0.15
  });

  const taillightMat = new THREE.MeshStandardMaterial({
    color: 0xff0528,
    wireframe: isWireframe,
    emissive: 0xff0020,
    emissiveIntensity: 1.6,
    metalness: 0.3,
    roughness: 0.08
  });

  const reverseLightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    wireframe: isWireframe,
    emissive: 0xffffff,
    emissiveIntensity: 1.2,
    metalness: 0.2,
    roughness: 0.1
  });

  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xf0f8ff,
    wireframe: isWireframe,
    emissive: 0x90d4ff,
    emissiveIntensity: 1.4,
    metalness: 0.85,
    roughness: 0.1
  });

  const turnSignalMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    wireframe: isWireframe,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.1,
    roughness: 0.2
  });

  const intercoolerMat = new THREE.MeshStandardMaterial({
    color: 0xc4cdd5,
    wireframe: isWireframe,
    metalness: 0.9,
    roughness: 0.35,
    envMap: envMap
  });

  // --- 1. Sculpted Car Body Shell ---
  const bodyVerts = [];
  const bodyIndices = [];

  function addQuad(verts, indices, a, b, c, d) {
    indices.push(a, b, c);
    indices.push(a, c, d);
  }

  // Cross-sectional rings defining the R34 silhouette (Z front to back)
  const bodySections = [
    // 0: Splitter Front Edge (Z = 2.45)
    [[0.00, -0.38, 2.45], [0.38, -0.38, 2.43], [0.74, -0.39, 2.36], [0.94, -0.40, 2.22], [0.94, -0.34, 2.22]],
    // 1: Lower Bumper Mouth & Intercooler (Z = 2.24)
    [[0.00, -0.15, 2.30], [0.40, -0.15, 2.28], [0.78, -0.18, 2.20], [0.96, -0.25, 2.12], [0.96, -0.36, 2.12]],
    // 2: Grille & Headlight Apex (Z = 2.02)
    [[0.00,  0.20, 2.04], [0.38,  0.20, 2.02], [0.78,  0.18, 1.96], [0.99, -0.04, 1.90], [0.99, -0.34, 1.90]],
    // 3: Front Blistered Fender Peak (Z = 1.42)
    [[0.00,  0.31, 1.42], [0.42,  0.30, 1.42], [0.82,  0.28, 1.42], [1.07,  0.15, 1.42], [1.07, -0.32, 1.42]],
    // 4: Cowl / Windshield Base (Z = 0.74)
    [[0.00,  0.37, 0.74], [0.40,  0.36, 0.74], [0.80,  0.33, 0.74], [0.99,  0.12, 0.74], [0.99, -0.34, 0.74]],
    // 5: Windshield Top / Front Roof (Z = 0.16)
    [[0.00,  0.81, 0.16], [0.34,  0.80, 0.16], [0.63,  0.75, 0.16], [0.97,  0.10, 0.16], [0.97, -0.34, 0.16]],
    // 6: Mid Roof (Z = -0.36)
    [[0.00,  0.81, -0.36], [0.34,  0.80, -0.36], [0.63,  0.75, -0.36], [0.97,  0.10, -0.36], [0.97, -0.34, -0.36]],
    // 7: Rear Window Base / C-Pillar (Z = -0.98)
    [[0.00,  0.45, -0.98], [0.38,  0.44, -0.98], [0.78,  0.41, -0.98], [0.99,  0.15, -0.98], [0.99, -0.34, -0.98]],
    // 8: Rear Blistered Fender Flare (Z = -1.42)
    [[0.00,  0.45, -1.42], [0.42,  0.44, -1.42], [0.84,  0.41, -1.42], [1.09,  0.17, -1.42], [1.09, -0.32, -1.42]],
    // 9: Trunk Decklid & Wing Base (Z = -2.00)
    [[0.00,  0.46, -2.00], [0.38,  0.45, -2.00], [0.78,  0.42, -2.00], [0.99,  0.12, -2.00], [0.99, -0.34, -2.00]],
    // 10: Rear Fascia / Taillight Plane (Z = -2.25)
    [[0.00,  0.39, -2.25], [0.36,  0.38, -2.25], [0.75,  0.35, -2.22], [0.95,  0.06, -2.18], [0.95, -0.32, -2.18]],
    // 11: Rear Bumper Diffuser Base (Z = -2.38)
    [[0.00, -0.30, -2.38], [0.36, -0.30, -2.36], [0.72, -0.31, -2.30], [0.91, -0.34, -2.24], [0.91, -0.38, -2.24]]
  ];

  const pPerRing = 5;
  const numRings = bodySections.length;
  const rightOffsets = [];

  // Right side coordinates
  bodySections.forEach((ring) => {
    rightOffsets.push(bodyVerts.length / 3);
    ring.forEach(([x, y, z]) => bodyVerts.push(x, y, z));
  });

  // Right side quads
  for (let r = 0; r < numRings - 1; r++) {
    const r1 = rightOffsets[r];
    const r2 = rightOffsets[r + 1];
    for (let p = 0; p < pPerRing - 1; p++) {
      addQuad(bodyVerts, bodyIndices, r1 + p, r1 + p + 1, r2 + p + 1, r2 + p);
    }
  }

  // Left side coordinates (mirrored across X)
  const leftOffsets = [];
  bodySections.forEach((ring) => {
    leftOffsets.push(bodyVerts.length / 3);
    ring.forEach(([x, y, z]) => bodyVerts.push(-x, y, z));
  });

  // Left side quads (reversed winding for outward normals)
  for (let r = 0; r < numRings - 1; r++) {
    const r1 = leftOffsets[r];
    const r2 = leftOffsets[r + 1];
    for (let p = 0; p < pPerRing - 1; p++) {
      addQuad(bodyVerts, bodyIndices, r1 + p, r2 + p, r2 + p + 1, r1 + p + 1);
    }
  }

  // Stitch underbody floorpan (from right sill p=4 to left sill p=4)
  for (let r = 0; r < numRings - 1; r++) {
    const rR1 = rightOffsets[r];
    const rR2 = rightOffsets[r + 1];
    const lR1 = leftOffsets[r];
    const lR2 = leftOffsets[r + 1];
    addQuad(bodyVerts, bodyIndices, rR1 + 4, lR1 + 4, lR2 + 4, rR2 + 4);
  }

  const bodyGeom = new THREE.BufferGeometry();
  bodyGeom.setAttribute('position', new THREE.Float32BufferAttribute(bodyVerts, 3));
  bodyGeom.setIndex(bodyIndices);
  bodyGeom.computeVertexNormals();
  const bodyMesh = new THREE.Mesh(bodyGeom, paintMat);
  carGroup.add(bodyMesh);

  // --- 2. Tinted Glass Canopy (Windshield, Rear Screen & Side Windows) ---
  const glassGeom = new THREE.BufferGeometry();
  const glassVerts = [
    // Windshield
    0.0, 0.37, 0.73,
    0.38, 0.36, 0.73,
    0.34, 0.80, 0.17,
    0.0, 0.81, 0.17,
    -0.34, 0.80, 0.17,
    -0.38, 0.36, 0.73,
    // Rear Window
    0.0, 0.81, -0.37,
    0.34, 0.80, -0.37,
    0.38, 0.44, -0.97,
    0.0, 0.45, -0.97,
    -0.38, 0.44, -0.97,
    -0.34, 0.80, -0.37,
    // Right Side Glass
    0.34, 0.80, 0.16,
    0.77, 0.48, 0.20,
    0.77, 0.48, -0.40,
    0.34, 0.80, -0.36,
    // Left Side Glass
    -0.34, 0.80, 0.16,
    -0.77, 0.48, 0.20,
    -0.77, 0.48, -0.40,
    -0.34, 0.80, -0.36
  ];
  const glassIndices = [
    0, 1, 2,  0, 2, 3,  0, 3, 4,  0, 4, 5,       // Windshield
    6, 7, 8,  6, 8, 9,  6, 9, 10, 6, 10, 11,     // Rear Window
    12, 13, 14,  12, 14, 15,                     // Right Side
    16, 18, 17,  16, 19, 18                      // Left Side
  ];
  glassGeom.setAttribute('position', new THREE.Float32BufferAttribute(glassVerts, 3));
  glassGeom.setIndex(glassIndices);
  glassGeom.computeVertexNormals();
  const glassMesh = new THREE.Mesh(glassGeom, glassMat);
  carGroup.add(glassMesh);

  // --- 3. Front Lower Splitter & Intercooler (Carbon Fiber + Radiator) ---
  const splitterGeom = new THREE.BoxGeometry(1.92, 0.05, 0.48);
  splitterGeom.translate(0, -0.38, 2.26);
  const splitterMesh = new THREE.Mesh(splitterGeom, carbonMat);
  carGroup.add(splitterMesh);

  // Front Intercooler Radiator core
  const icGeom = new THREE.BoxGeometry(0.88, 0.22, 0.08);
  icGeom.translate(0, -0.22, 2.22);
  const icMesh = new THREE.Mesh(icGeom, intercoolerMat);
  carGroup.add(icMesh);

  // GT-R Red Grille Emblem
  const badgeGeom = new THREE.BoxGeometry(0.12, 0.05, 0.03);
  badgeGeom.translate(0.18, 0.08, 2.05);
  const badgeMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c });
  const badgeMesh = new THREE.Mesh(badgeGeom, badgeMat);
  carGroup.add(badgeMesh);

  // Twin NACA Hood Vents (Carbon)
  [-0.22, 0.22].forEach((x) => {
    const ventGeom = new THREE.BoxGeometry(0.12, 0.02, 0.28);
    ventGeom.rotateX(-0.1);
    ventGeom.translate(x, 0.32, 1.25);
    const ventMesh = new THREE.Mesh(ventGeom, carbonMat);
    carGroup.add(ventMesh);
  });

  // Aerodynamic Side Mirrors
  [-0.98, 0.98].forEach((x) => {
    const mirrorStem = new THREE.CylinderGeometry(0.02, 0.025, 0.12);
    mirrorStem.rotateZ(x > 0 ? -0.4 : 0.4);
    mirrorStem.translate(x, 0.28, 0.62);
    const stemMesh = new THREE.Mesh(mirrorStem, carbonMat);
    carGroup.add(stemMesh);

    const mirrorCap = new THREE.BoxGeometry(0.18, 0.10, 0.12);
    mirrorCap.translate(x + (x > 0 ? 0.07 : -0.07), 0.32, 0.62);
    const capMesh = new THREE.Mesh(mirrorCap, paintMat);
    carGroup.add(capMesh);

    // Reflective glass insert
    const mGlass = new THREE.BoxGeometry(0.02, 0.08, 0.10);
    mGlass.translate(x + (x > 0 ? 0.04 : -0.04), 0.32, 0.60);
    const mGlassMesh = new THREE.Mesh(mGlass, wheelRimMat);
    carGroup.add(mGlassMesh);
  });

  // --- 4. Iconic GT-R Dual-Pedestal Rear Wing ---
  const wingGroup = new THREE.Group();

  // Dual upright aero struts
  [-0.54, 0.54].forEach((xPos) => {
    const strutGeom = new THREE.BoxGeometry(0.04, 0.44, 0.18);
    strutGeom.rotateX(-0.12);
    strutGeom.translate(xPos, 0.66, -1.96);
    const strutMesh = new THREE.Mesh(strutGeom, carbonMat);
    wingGroup.add(strutMesh);
  });

  // Curved aerofoil wing blade
  const bladeGeom = new THREE.BoxGeometry(1.86, 0.04, 0.28);
  bladeGeom.rotateX(-0.06);
  bladeGeom.translate(0, 0.88, -1.99);
  const bladeMesh = new THREE.Mesh(bladeGeom, paintMat);
  wingGroup.add(bladeMesh);

  // Carbon fiber endplates
  [-0.94, 0.94].forEach((xPos) => {
    const epGeom = new THREE.BoxGeometry(0.02, 0.24, 0.36);
    epGeom.translate(xPos, 0.88, -1.99);
    const epMesh = new THREE.Mesh(epGeom, carbonMat);
    wingGroup.add(epMesh);
  });
  carGroup.add(wingGroup);

  // --- 5. Signature Quad Circular Taillights (Authentic R34 Asymmetric Diameter) ---
  const taillights = [
    { x:  0.65, y: 0.22, z: -2.25, r: 0.092, isOuter: true },
    { x:  0.42, y: 0.22, z: -2.25, r: 0.074, isOuter: false },
    { x: -0.65, y: 0.22, z: -2.25, r: 0.092, isOuter: true },
    { x: -0.42, y: 0.22, z: -2.25, r: 0.074, isOuter: false }
  ];

  taillights.forEach((t) => {
    // Outer chrome bezel ring
    const bezelGeom = new THREE.CylinderGeometry(t.r + 0.012, t.r + 0.012, 0.03, 24);
    bezelGeom.rotateX(Math.PI / 2);
    bezelGeom.translate(t.x, t.y, t.z);
    const bezelMesh = new THREE.Mesh(bezelGeom, carbonMat);
    carGroup.add(bezelMesh);

    // Glowing red lens
    const lensGeom = new THREE.CylinderGeometry(t.r, t.r, 0.04, 24);
    lensGeom.rotateX(Math.PI / 2);
    lensGeom.translate(t.x, t.y, t.z + 0.005);
    const lensMesh = new THREE.Mesh(lensGeom, taillightMat);
    carGroup.add(lensMesh);

    // Center circular reverse / reflector insert for inner light
    if (!t.isOuter) {
      const coreGeom = new THREE.CylinderGeometry(t.r * 0.42, t.r * 0.42, 0.045, 16);
      coreGeom.rotateX(Math.PI / 2);
      coreGeom.translate(t.x, t.y, t.z + 0.008);
      const coreMesh = new THREE.Mesh(coreGeom, reverseLightMat);
      carGroup.add(coreMesh);
    }
  });

  // --- 6. Front Xenon Projector Headlights & Indicators ---
  [-0.68, 0.68].forEach((xPos) => {
    // Headlamp housing
    const hlGeom = new THREE.BoxGeometry(0.26, 0.10, 0.14);
    hlGeom.rotateY(xPos > 0 ? -0.16 : 0.16);
    hlGeom.translate(xPos, 0.10, 1.98);
    const hlMesh = new THREE.Mesh(hlGeom, headlightMat);
    carGroup.add(hlMesh);

    // Amber corner turn indicator
    const sigGeom = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    sigGeom.translate(xPos + (xPos > 0 ? 0.16 : -0.16), 0.09, 1.94);
    const sigMesh = new THREE.Mesh(sigGeom, turnSignalMat);
    carGroup.add(sigMesh);
  });

  // --- 7. Rear Carbon Diffuser & Titanium Exhaust Cannon ---
  const diffuserGeom = new THREE.BoxGeometry(1.84, 0.06, 0.38);
  diffuserGeom.translate(0, -0.32, -2.28);
  const diffuserMesh = new THREE.Mesh(diffuserGeom, carbonMat);
  carGroup.add(diffuserMesh);

  // 3 Diffuser Aero Vertical Strakes
  [-0.45, 0.0, 0.45].forEach((x) => {
    const strakeGeom = new THREE.BoxGeometry(0.03, 0.10, 0.34);
    strakeGeom.translate(x, -0.36, -2.28);
    const strakeMesh = new THREE.Mesh(strakeGeom, carbonMat);
    carGroup.add(strakeMesh);
  });

  // 4-inch Angled Titanium Exhaust Tip
  const exhaustGeom = new THREE.CylinderGeometry(0.065, 0.065, 0.28, 20);
  exhaustGeom.rotateX(Math.PI / 2 + 0.08);
  exhaustGeom.rotateY(0.12);
  exhaustGeom.translate(-0.62, -0.32, -2.36);
  const exhaustMat = new THREE.MeshStandardMaterial({
    color: 0x93c5fd,
    metalness: 0.98,
    roughness: 0.1,
    envMap: envMap
  });
  const exhaustMesh = new THREE.Mesh(exhaustGeom, exhaustMat);
  carGroup.add(exhaustMesh);

  // Inner black tailpipe hole
  const holeGeom = new THREE.CylinderGeometry(0.048, 0.048, 0.29, 16);
  holeGeom.rotateX(Math.PI / 2 + 0.08);
  holeGeom.rotateY(0.12);
  holeGeom.translate(-0.62, -0.32, -2.36);
  const holeMesh = new THREE.Mesh(holeGeom, tireMat);
  carGroup.add(holeMesh);

  // --- 8. 4 NISMO 6-Spoke Forged Alloy Wheels with Brembo Calipers ---
  function createWheelAssembly(x, y, z, isLeft) {
    const wGroup = new THREE.Group();
    wGroup.position.set(x, y, z);

    // Tread & Sidewall Tire
    const tireGeom = new THREE.CylinderGeometry(0.34, 0.34, 0.24, 28);
    tireGeom.rotateZ(Math.PI / 2);
    const tireMesh = new THREE.Mesh(tireGeom, tireMat);
    wGroup.add(tireMesh);

    // Stepped Deep-Dish Rim Barrel
    const rimGeom = new THREE.CylinderGeometry(0.26, 0.26, 0.25, 28);
    rimGeom.rotateZ(Math.PI / 2);
    const rimMesh = new THREE.Mesh(rimGeom, wheelRimMat);
    wGroup.add(rimMesh);

    // Cross-Drilled Ventilated Brake Disc
    const rotorGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.05, 20);
    rotorGeom.rotateZ(Math.PI / 2);
    const rotorMesh = new THREE.Mesh(rotorGeom, brakeRotorMat);
    wGroup.add(rotorMesh);

    // Gold Brembo Brake Caliper
    const caliperGeom = new THREE.BoxGeometry(0.07, 0.12, 0.08);
    caliperGeom.translate(isLeft ? -0.04 : 0.04, 0.14, 0.05);
    const caliperMesh = new THREE.Mesh(caliperGeom, caliperMat);
    wGroup.add(caliperMesh);

    // 6 Forged Rim Spokes
    const spokeOffset = isLeft ? -0.11 : 0.11;
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const spokeGeom = new THREE.BoxGeometry(0.04, 0.23, 0.035);
      spokeGeom.rotateX(angle);
      spokeGeom.translate(spokeOffset, 0, 0);
      const spokeMesh = new THREE.Mesh(spokeGeom, wheelRimMat);
      wGroup.add(spokeMesh);
    }

    // Center Hub Nut
    const centerNut = new THREE.CylinderGeometry(0.045, 0.045, 0.06, 12);
    centerNut.rotateZ(Math.PI / 2);
    centerNut.translate(spokeOffset * 1.05, 0, 0);
    const centerNutMesh = new THREE.Mesh(centerNut, carbonMat);
    wGroup.add(centerNutMesh);

    return wGroup;
  }

  carGroup.add(createWheelAssembly( 1.04, -0.15,  1.42, false));
  carGroup.add(createWheelAssembly(-1.04, -0.15,  1.42, true));
  carGroup.add(createWheelAssembly( 1.06, -0.15, -1.42, false));
  carGroup.add(createWheelAssembly(-1.06, -0.15, -1.42, true));

  // Scale and center car
  carGroup.scale.set(1.15, 1.15, 1.15);
  carGroup.position.set(0, 0.2, 0);

  return carGroup;
}

/**
 * =========================================================================
 * 2. PHOTOREALISTIC ARCHITECTURAL EIFFEL TOWER 3D MODEL
 * True-to-scale Parisian monument with:
 * - 4 Parabolic sweeping corner piers with 3D structural lattice girders
 * - 4 Heavy foundational stone masonry pedestals & grand base arches
 * - 1st Platform promenade with perimeter balustrade & structural cornice
 * - 2nd Platform observation deck & double-tier viewing gallery
 * - Converging slender pyramidal lattice spire with X-truss bracing
 * - 3rd Platform summit dome, lantern cupola & radio antenna mast with beacon
 * =========================================================================
 */
export function createDetailedEiffelTower(themeColor = '#ff003c', isWireframe = false, envMap = null) {
  const towerGroup = new THREE.Group();
  towerGroup.name = 'EiffelTower';

  // Materials
  const ironMat = new THREE.MeshStandardMaterial({
    color: isWireframe ? new THREE.Color(themeColor) : 0x76808e,
    wireframe: isWireframe,
    metalness: 0.92,
    roughness: 0.32,
    envMap: envMap,
    envMapIntensity: 1.5,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: isWireframe ? 0.45 : 0.06
  });
  ironMat.userData = { type: 'iron' };

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x3d434c,
    wireframe: isWireframe,
    metalness: 0.3,
    roughness: 0.85,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: isWireframe ? 0.3 : 0.0
  });
  stoneMat.userData = { type: 'stone' };

  const platformMat = new THREE.MeshStandardMaterial({
    color: 0x485260,
    wireframe: isWireframe,
    metalness: 0.8,
    roughness: 0.35,
    envMap: envMap,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: isWireframe ? 0.4 : 0.04
  });
  platformMat.userData = { type: 'platform' };

  const beaconMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    wireframe: isWireframe,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: 2.2,
    metalness: 0.1
  });
  beaconMat.userData = { type: 'beacon' };

  // --- 1. Foundational Stone Plinths (4 Base Pillars) ---
  const plinthSigns = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
  plinthSigns.forEach(([sx, sz]) => {
    const plinthGeom = new THREE.BoxGeometry(0.55, 0.22, 0.55);
    plinthGeom.translate(sx * 1.68, -2.48, sz * 1.68);
    const plinthMesh = new THREE.Mesh(plinthGeom, stoneMat);
    towerGroup.add(plinthMesh);
  });

  // --- 2. Parabolic Lattice Piers & X-Truss Towers ---
  const levels = [
    { y: -2.42, w: 1.68, t: 0.36 }, // Base footing
    { y: -2.05, w: 1.48, t: 0.32 }, // Arch mid
    { y: -1.65, w: 1.28, t: 0.28 }, // Below plat 1
    { y: -1.25, w: 1.10, t: 0.24 }, // Plat 1 lower
    { y: -1.05, w: 1.00, t: 0.22 }, // Plat 1 deck
    { y: -0.55, w: 0.80, t: 0.18 }, // Tier 2 mid
    { y:  0.00, w: 0.60, t: 0.15 }, // Tier 2 upper
    { y:  0.42, w: 0.46, t: 0.12 }, // Plat 2 deck
    { y:  0.95, w: 0.35, t: 0.09 }, // Spire lower
    { y:  1.45, w: 0.25, t: 0.07 }, // Spire mid
    { y:  1.95, w: 0.16, t: 0.05 }, // Spire upper
    { y:  2.45, w: 0.09, t: 0.035 } // Summit lantern base
  ];

  const verts = [];
  const indices = [];

  function addQuad(v0, v1, v2, v3) {
    indices.push(v0, v1, v2);
    indices.push(v0, v2, v3);
  }

  const ringOffsets = [];
  levels.forEach((lvl) => {
    ringOffsets.push(verts.length / 3);
    plinthSigns.forEach(([sx, sz]) => {
      const cx = sx * lvl.w;
      const cz = sz * lvl.w;
      const t = lvl.t;
      verts.push(
        cx, lvl.y, cz,
        cx - sx * t, lvl.y, cz,
        cx - sx * t, lvl.y, cz - sz * t,
        cx, lvl.y, cz - sz * t
      );
    });
  });

  for (let l = 0; l < levels.length - 1; l++) {
    const r1 = ringOffsets[l];
    const r2 = ringOffsets[l + 1];

    for (let p = 0; p < 4; p++) {
      const p1 = r1 + p * 4;
      const p2 = r2 + p * 4;

      // 4 faces of each pillar column
      for (let s = 0; s < 4; s++) {
        const a = p1 + s;
        const b = p1 + ((s + 1) % 4);
        const c = p2 + ((s + 1) % 4);
        const d = p2 + s;
        addQuad(a, b, c, d);
      }

      // Inter-pillar diagonal structural X-trusses
      const nextP = (p + 1) % 4;
      const pNext1 = r1 + nextP * 4;
      const pNext2 = r2 + nextP * 4;
      indices.push(p1, pNext1, pNext2);
      indices.push(p1, pNext2, p2);
      indices.push(p1 + 1, pNext1 + 1, pNext2 + 1);
      indices.push(p1 + 1, pNext2 + 1, p2 + 1);
    }
  }

  // --- 3. 4 Grand Parabolic Base Arches ---
  const archSteps = 14;
  for (let p = 0; p < 4; p++) {
    const nextP = (p + 1) % 4;
    const [sx1, sz1] = plinthSigns[p];
    const [sx2, sz2] = plinthSigns[nextP];
    const startIdx = verts.length / 3;

    for (let k = 0; k <= archSteps; k++) {
      const u = k / archSteps;
      const angle = u * Math.PI;
      const x = sx1 * 1.52 * (1 - u) + sx2 * 1.52 * u;
      const z = sz1 * 1.52 * (1 - u) + sz2 * 1.52 * u;
      const y = -2.42 + Math.sin(angle) * 1.25;
      verts.push(x, y, z);
      verts.push(x * 0.90, y + 0.10, z * 0.90);
    }

    for (let k = 0; k < archSteps; k++) {
      const a = startIdx + k * 2;
      const b = startIdx + k * 2 + 1;
      const c = startIdx + (k + 1) * 2 + 1;
      const d = startIdx + (k + 1) * 2;
      addQuad(a, b, c, d);
    }
  }

  const ironGeom = new THREE.BufferGeometry();
  ironGeom.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  ironGeom.setIndex(indices);
  ironGeom.computeVertexNormals();
  const ironMesh = new THREE.Mesh(ironGeom, ironMat);
  towerGroup.add(ironMesh);

  // --- 4. Platform 1 Promenade Deck (Double Tier) ---
  const plat1Lower = new THREE.BoxGeometry(2.38, 0.16, 2.38);
  plat1Lower.translate(0, -0.98, 0);
  towerGroup.add(new THREE.Mesh(plat1Lower, platformMat));

  const plat1Upper = new THREE.BoxGeometry(2.15, 0.08, 2.15);
  plat1Upper.translate(0, -0.86, 0);
  towerGroup.add(new THREE.Mesh(plat1Upper, ironMat));

  // Platform 1 Balustrade Handrails
  [-1.12, 1.12].forEach((pos) => {
    const railX = new THREE.BoxGeometry(2.28, 0.06, 0.03);
    railX.translate(0, -0.80, pos);
    towerGroup.add(new THREE.Mesh(railX, ironMat));

    const railZ = new THREE.BoxGeometry(0.03, 0.06, 2.28);
    railZ.translate(pos, -0.80, 0);
    towerGroup.add(new THREE.Mesh(railZ, ironMat));
  });

  // --- 5. Platform 2 Observation Deck ---
  const plat2Deck = new THREE.BoxGeometry(1.32, 0.14, 1.32);
  plat2Deck.translate(0, 0.48, 0);
  towerGroup.add(new THREE.Mesh(plat2Deck, platformMat));

  const plat2Upper = new THREE.BoxGeometry(1.14, 0.07, 1.14);
  plat2Upper.translate(0, 0.58, 0);
  towerGroup.add(new THREE.Mesh(plat2Upper, ironMat));

  // --- 6. Platform 3 Summit Cupola, Dome, Beacon & Spire Mast ---
  const domeBase = new THREE.CylinderGeometry(0.14, 0.18, 0.22, 16);
  domeBase.translate(0, 2.54, 0);
  towerGroup.add(new THREE.Mesh(domeBase, platformMat));

  const beaconSphere = new THREE.SphereGeometry(0.09, 16, 16);
  beaconSphere.translate(0, 2.68, 0);
  towerGroup.add(new THREE.Mesh(beaconSphere, beaconMat));

  // Radio/TV Transmission Needle Spire
  const antennaGeom = new THREE.CylinderGeometry(0.016, 0.045, 0.85, 8);
  antennaGeom.translate(0, 3.12, 0);
  towerGroup.add(new THREE.Mesh(antennaGeom, ironMat));

  // Antenna top flashing strobe light
  const topStrobe = new THREE.SphereGeometry(0.035, 8, 8);
  topStrobe.translate(0, 3.56, 0);
  towerGroup.add(new THREE.Mesh(topStrobe, beaconMat));

  towerGroup.scale.set(1.1, 1.1, 1.1);
  return towerGroup;
}

/**
 * =========================================================================
 * 3. PHOTOREALISTIC CINQUEFOIL TORUS KNOT (3, 5) — STAR-LOBED HYPER KNOT
 * Features:
 * - 5-Lobed Non-Trivial Star Knot T(3, 5) with intertwined continuous loops
 * - Iridescent Titanium PBR with high clearcoat and studio HDR reflections
 * - Internal concentric glowing laser waveguide core
 * - 3 Floating parametric orbital resonance rings
 * =========================================================================
 */
export function createDetailedCinquefoilKnot(themeColor = '#ff003c', isWireframe = false, envMap = null) {
  const knotGroup = new THREE.Group();
  knotGroup.name = 'CinquefoilKnot';

  // Titanium / Iridescent Damascus Metal Material
  const titaniumMat = new THREE.MeshPhysicalMaterial({
    color: isWireframe ? new THREE.Color(themeColor) : new THREE.Color(themeColor),
    wireframe: isWireframe,
    metalness: 0.94,
    roughness: 0.14,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    reflectivity: 0.98,
    envMap: envMap,
    envMapIntensity: 2.2,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: isWireframe ? 0.45 : 0.08
  });
  titaniumMat.userData = { type: 'knot' };

  // Inner Laser Core
  const laserMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(themeColor),
    wireframe: true,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: 1.8
  });
  laserMat.userData = { type: 'laser' };

  // Outer Orbital Ring Material
  const ringMat = new THREE.MeshStandardMaterial({
    color: isWireframe ? new THREE.Color(themeColor) : 0x475569,
    wireframe: isWireframe,
    metalness: 0.95,
    roughness: 0.2,
    envMap: envMap,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: isWireframe ? 0.4 : 0.05
  });
  ringMat.userData = { type: 'metal' };

  // 1. Primary Cinquefoil Knot Geometry (p=3, q=5)
  const knotGeom = new THREE.TorusKnotGeometry(1.26, 0.26, 240, 36, 3, 5);
  const knotMesh = new THREE.Mesh(knotGeom, titaniumMat);
  knotGroup.add(knotMesh);

  // 2. Concentric Internal Laser Waveguide
  const innerKnotGeom = new THREE.TorusKnotGeometry(1.26, 0.075, 180, 16, 3, 5);
  const innerMesh = new THREE.Mesh(innerKnotGeom, laserMat);
  knotGroup.add(innerMesh);

  // 3. Floating Parametric Resonance Rings
  const ring1 = new THREE.TorusGeometry(1.82, 0.02, 12, 64);
  ring1.rotateX(Math.PI / 2);
  knotGroup.add(new THREE.Mesh(ring1, ringMat));

  const ring2 = new THREE.TorusGeometry(1.82, 0.02, 12, 64);
  ring2.rotateY(Math.PI / 3);
  knotGroup.add(new THREE.Mesh(ring2, ringMat));

  const ring3 = new THREE.TorusGeometry(1.82, 0.02, 12, 64);
  ring3.rotateY(-Math.PI / 3);
  knotGroup.add(new THREE.Mesh(ring3, ringMat));

  knotGroup.scale.set(1.1, 1.1, 1.1);
  return knotGroup;
}

/**
 * Retained for backward-compatibility if referenced
 */
export function createDetailedCyberHead(themeColor = '#ff003c', isWireframe = false, envMap = null) {
  const headGroup = new THREE.Group();
  headGroup.name = 'CyberHead';

  const skinMat = new THREE.MeshPhysicalMaterial({
    color: isWireframe ? new THREE.Color(themeColor) : 0x1c2434,
    wireframe: isWireframe,
    metalness: 0.82,
    roughness: 0.22,
    clearcoat: 0.85,
    clearcoatRoughness: 0.10,
    reflectivity: 0.94,
    envMap: envMap,
    envMapIntensity: 1.8,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: isWireframe ? 0.45 : 0.08
  });
  skinMat.userData = { type: 'skin' };

  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0xff003c,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: 1.6,
    metalness: 0.9,
    roughness: 0.08
  });
  eyeMat.userData = { type: 'eye' };

  const circuitMat = new THREE.MeshStandardMaterial({
    color: 0x0b1018,
    metalness: 0.9,
    roughness: 0.15,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: 0.6
  });

  const vertices = [];
  const indices = [];

  function addTri(a, b, c) {
    indices.push(a, b, c);
  }

  function addQuad(a, b, c, d) {
    indices.push(a, b, c);
    indices.push(a, c, d);
  }

  const landmarks = [
    [0.00,  1.84,  0.22], [0.00,  1.50,  0.92], [0.00,  1.04,  1.22],
    [0.00,  0.54,  1.32], [0.00,  0.24,  1.42], [0.00, -0.20,  1.62],
    [0.00, -0.60,  1.80], [0.00, -0.86,  1.46], [0.00, -1.10,  1.50],
    [0.00, -1.30,  1.44], [0.00, -1.54,  1.40], [0.00, -1.80,  1.34],
    [0.00, -2.14,  1.50], [0.00, -2.50,  1.06],
    [0.55,  1.74,  0.30], [0.66,  1.40,  0.82], [0.70,  0.96,  1.06],
    [0.54,  0.50,  1.22], [0.88,  0.44,  0.92], [0.38,  0.16,  1.14],
    [0.80,  0.12,  0.90], [0.60,  0.28,  1.08], [0.60, -0.02,  1.02],
    [0.30, -0.56,  1.48], [0.86, -0.40,  1.04], [1.16, -0.54,  0.62],
    [0.50, -1.26,  1.24], [0.82, -1.26,  0.84], [0.50, -2.08,  1.30],
    [0.98, -1.74,  0.66], [1.14, -1.28,  0.10], [1.30, -0.08, -0.15],
    [1.12,  0.96, -0.10], [0.00,  1.62, -0.78], [0.00,  0.82, -1.48],
    [0.00, -0.42, -1.52], [0.80,  0.72, -1.18], [0.74, -0.38, -1.18],
    [0.00, -2.74, -0.10], [0.64, -2.64, -0.10]
  ];

  const leftMap = [];
  landmarks.forEach(([x, y, z], idx) => {
    vertices.push(x, y, z);
    if (Math.abs(x) < 0.001) leftMap.push(idx);
    else {
      leftMap.push(vertices.length / 3);
      vertices.push(-x, y, z);
    }
  });

  const quads = [
    [0, 1, 15, 14], [1, 2, 16, 15], [2, 3, 17, 16],
    [16, 17, 18, 32], [15, 16, 32, 32], [14, 15, 32, 32],
    [3, 4, 19, 17], [17, 19, 21, 18], [18, 21, 20, 18],
    [19, 22, 20, 19], [18, 20, 31, 32],
    [4, 5, 23, 19], [5, 6, 23, 23], [19, 23, 24, 22],
    [22, 24, 25, 20], [20, 25, 31, 31],
    [6, 7, 23, 23], [7, 8, 26, 23], [23, 26, 27, 24],
    [24, 27, 29, 25], [8, 9, 26, 26], [9, 10, 26, 26],
    [10, 11, 26, 26], [11, 12, 28, 26], [26, 28, 29, 27],
    [12, 13, 28, 28], [28, 13, 38, 28], [28, 29, 39, 38],
    [29, 30, 25, 25], [30, 31, 25, 25],
    [0, 14, 32, 33], [33, 32, 31, 36], [31, 30, 37, 36],
    [33, 36, 34, 34], [36, 37, 35, 34], [37, 30, 39, 35],
    [30, 39, 38, 38], [35, 39, 38, 38]
  ];

  quads.forEach(([a, b, c, d]) => {
    if (c === d) addTri(a, b, c);
    else addQuad(a, b, c, d);
  });

  quads.forEach(([a, b, c, d]) => {
    const la = leftMap[a];
    const lb = leftMap[b];
    const lc = leftMap[c];
    const ld = leftMap[d];
    if (c === d) addTri(la, lc, lb);
    else {
      indices.push(la, lc, lb);
      indices.push(la, ld, lc);
    }
  });

  const headGeom = new THREE.BufferGeometry();
  headGeom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  headGeom.setIndex(indices);
  headGeom.computeVertexNormals();
  const headMesh = new THREE.Mesh(headGeom, skinMat);
  headGroup.add(headMesh);

  [-0.58, 0.58].forEach((xPos) => {
    const eyeGeom = new THREE.SphereGeometry(0.13, 18, 18);
    eyeGeom.translate(xPos, 0.12, 0.98);
    const eyeMesh = new THREE.Mesh(eyeGeom, eyeMat);
    headGroup.add(eyeMesh);

    const ringGeom = new THREE.TorusGeometry(0.08, 0.015, 8, 24);
    ringGeom.translate(xPos, 0.12, 1.08);
    const ringMesh = new THREE.Mesh(ringGeom, circuitMat);
    headGroup.add(ringMesh);
  });

  [-1.24, 1.24].forEach((xPos) => {
    const portGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 16);
    portGeom.rotateZ(Math.PI / 2);
    portGeom.translate(xPos, -0.06, -0.12);
    const portMesh = new THREE.Mesh(portGeom, circuitMat);
    headGroup.add(portMesh);
  });

  headGroup.scale.set(1.18, 1.18, 1.18);
  headGroup.position.set(0, 0.1, 0);
  return headGroup;
}

/**
 * =========================================================================
 * 4. PARAMETRIC TORUS KNOT (CHROME & EMISSIVE ENERGY RIBBON)
 * =========================================================================
 */
export function createDetailedTorusKnot(themeColor = '#ff003c', isWireframe = false, envMap = null) {
  const knotGroup = new THREE.Group();
  knotGroup.name = 'TorusKnot';

  const chromeMat = new THREE.MeshPhysicalMaterial({
    color: isWireframe ? new THREE.Color(themeColor) : 0xe0e7ef,
    wireframe: isWireframe,
    metalness: 0.98,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    envMap: envMap,
    envMapIntensity: 2.2,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: isWireframe ? 0.45 : 0.08
  });
  chromeMat.userData = { type: 'chrome' };

  const knotGeom = new THREE.TorusKnotGeometry(1.2, 0.38, 160, 32);
  const knotMesh = new THREE.Mesh(knotGeom, chromeMat);
  knotGroup.add(knotMesh);

  // Inner energy laser ribbon
  const innerKnotGeom = new THREE.TorusKnotGeometry(1.2, 0.12, 120, 16, 2, 3);
  const innerMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(themeColor),
    wireframe: true,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: 1.5
  });
  innerMat.userData = { type: 'laser' };
  const innerMesh = new THREE.Mesh(innerKnotGeom, innerMat);
  knotGroup.add(innerMesh);

  return knotGroup;
}

/**
 * =========================================================================
 * 5. QUANTUM CORE REACTOR (GYROSCOPIC GIMBAL & CRYSTALLINE NODE)
 * =========================================================================
 */
export function createDetailedQuantumCore(themeColor = '#ff003c', isWireframe = false, envMap = null) {
  const coreGroup = new THREE.Group();
  coreGroup.name = 'QuantumCore';

  const ringMat = new THREE.MeshStandardMaterial({
    color: isWireframe ? new THREE.Color(themeColor) : 0x334155,
    wireframe: isWireframe,
    metalness: 0.95,
    roughness: 0.2,
    envMap: envMap,
    envMapIntensity: 1.8,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: isWireframe ? 0.4 : 0.05
  });
  ringMat.userData = { type: 'metal' };

  const reactorMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(themeColor),
    wireframe: isWireframe,
    metalness: 0.2,
    roughness: 0.05,
    transmission: 0.85,
    transparent: true,
    opacity: 0.9,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: 1.8
  });
  reactorMat.userData = { type: 'reactor' };

  // Inner power icosahedron
  const crystalGeom = new THREE.IcosahedronGeometry(1.0, 1);
  const crystalMesh = new THREE.Mesh(crystalGeom, reactorMat);
  coreGroup.add(crystalMesh);

  // 3 Concentric Gimbal Rings
  const ring1 = new THREE.TorusGeometry(1.6, 0.06, 16, 64);
  const ring1Mesh = new THREE.Mesh(ring1, ringMat);
  coreGroup.add(ring1Mesh);

  const ring2 = new THREE.TorusGeometry(1.9, 0.05, 16, 64);
  ring2.rotateX(Math.PI / 3);
  const ring2Mesh = new THREE.Mesh(ring2, ringMat);
  coreGroup.add(ring2Mesh);

  const ring3 = new THREE.TorusGeometry(2.2, 0.04, 16, 64);
  ring3.rotateY(Math.PI / 3);
  const ring3Mesh = new THREE.Mesh(ring3, ringMat);
  coreGroup.add(ring3Mesh);

  return coreGroup;
}

/**
 * Updates color and wireframe state across all child meshes in a model group
 * without expensive geometry re-creations.
 */
export function updateModelStyle(group, themeColor, isWireframe) {
  if (!group) return;
  const color = new THREE.Color(themeColor);

  group.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    const mat = child.material;
    mat.wireframe = isWireframe;

    const type = mat.userData?.type;
    if (isWireframe) {
      mat.color.copy(color);
      mat.emissive.copy(color);
      mat.emissiveIntensity = 0.45;
    } else {
      // Solid shaded mode
      if (type === 'paint' || type === 'knot') {
        mat.color.copy(color);
        mat.emissive.copy(color);
        mat.emissiveIntensity = 0.08;
      } else if (type === 'chrome') {
        mat.color.set(0xe0e7ef);
        mat.emissive.copy(color);
        mat.emissiveIntensity = 0.08;
      } else if (type === 'skin') {
        mat.color.set(0x1c2434);
        mat.emissive.copy(color);
        mat.emissiveIntensity = 0.08;
      } else if (type === 'iron') {
        mat.color.set(0x76808e);
        mat.emissive.copy(color);
        mat.emissiveIntensity = 0.06;
      } else if (type === 'glass') {
        mat.color.set(0x0a1420);
        mat.emissive.copy(color);
        mat.emissiveIntensity = 0.05;
      } else if (type === 'eye' || type === 'beacon' || type === 'reactor' || type === 'laser') {
        mat.color.copy(color);
        mat.emissive.copy(color);
        mat.emissiveIntensity = 1.6;
      }
    }
    mat.needsUpdate = true;
  });
}

