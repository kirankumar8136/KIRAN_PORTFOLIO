import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
 * 1. ASGARDIAN MJÖLNIR GLTF 3D MODEL LOADER
 * Loads the authentic 3D model of Thor's hammer (Mjölnir),
 * centers pivot, normalizes scale to hero size, applies studio HDR reflections,
 * and sets up dynamic Norse relic materials & crackling lightning aura.
 * =========================================================================
 */
export function loadMjolnirGLTF(
  url = './mjolnir_thors_hammer.glb',
  envMap = null,
  themeColor = '#00d4ff',
  isWireframe = false,
  mode = 'classic'
) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.load(
      url,
      (gltf) => {
        const root = new THREE.Group();
        root.name = 'MjolnirGLTF';

        const gltfScene = gltf.scene;
        gltfScene.updateMatrixWorld(true);

        // Center bounding box and normalize scale to hero size (~2.85 units)
        const box = new THREE.Box3().setFromObject(gltfScene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = 2.85 / (maxDim || 1);

        // Nested container to pivot cleanly at (0, 0, 0)
        const innerContainer = new THREE.Group();
        innerContainer.name = 'HammerInnerContainer';
        innerContainer.add(gltfScene);

        gltfScene.scale.setScalar(targetScale);
        gltfScene.position.set(-center.x * targetScale, -center.y * targetScale, -center.z * targetScale);

        // Traverse and enhance materials with environment reflections
        gltfScene.traverse((child) => {
          if (child.isMesh && child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach((mat) => {
              if (!child.userData.originalMatProps) {
                child.userData.originalMatProps = {
                  color: mat.color ? mat.color.clone() : new THREE.Color(0xffffff),
                  metalness: mat.metalness !== undefined ? mat.metalness : 0.92,
                  roughness: mat.roughness !== undefined ? mat.roughness : 0.28,
                  emissive: mat.emissive ? mat.emissive.clone() : new THREE.Color(0x000000),
                  emissiveIntensity: mat.emissiveIntensity !== undefined ? mat.emissiveIntensity : 0
                };
              }

              if (envMap) {
                mat.envMap = envMap;
                mat.envMapIntensity = 2.2;
              }
              mat.wireframe = isWireframe;
            });
          }
        });

        // Add dynamic animated crackling lightning aura
        const aura = createMjolnirLightningAura(themeColor);
        root.add(aura);
        root.userData.lightningAura = aura;

        root.add(innerContainer);

        // Apply initial relic style
        updateModelStyle(root, themeColor, isWireframe, mode);

        resolve(root);
      },
      undefined,
      (err) => {
        console.warn('GLTFLoader failed to load Mjölnir:', err);
        reject(err);
      }
    );
  });
}

/**
 * Procedural Dynamic 3D Lightning Arc Aura around Mjölnir
 */
export function createMjolnirLightningAura(color = '#00d4ff') {
  const auraGroup = new THREE.Group();
  auraGroup.name = 'LightningAura';

  const boltCount = 4;
  const bolts = [];

  for (let b = 0; b < boltCount; b++) {
    const points = [];
    const segCount = 7;
    for (let i = 0; i <= segCount; i++) {
      points.push(new THREE.Vector3(0, 0, 0));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      linewidth: 2
    });
    const line = new THREE.Line(geom, mat);
    auraGroup.add(line);
    bolts.push(line);
  }
  auraGroup.userData.bolts = bolts;

  // Orbiting electric sparks
  const sparkCount = 36;
  const pGeom = new THREE.BufferGeometry();
  const positions = new Float32Array(sparkCount * 3);
  for (let i = 0; i < sparkCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 3.0;
    positions[i + 1] = (Math.random() - 0.5) * 2.6;
    positions[i + 2] = (Math.random() - 0.5) * 2.2;
  }
  pGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({
    color: new THREE.Color(color),
    size: 0.08,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const sparkPoints = new THREE.Points(pGeom, pMat);
  auraGroup.add(sparkPoints);
  auraGroup.userData.sparkPoints = sparkPoints;

  return auraGroup;
}

/**
 * Animates the crackling lightning aura on every frame
 */
export function animateLightningAura(auraGroup, time, intensity = 1.0) {
  if (!auraGroup || intensity <= 0) {
    if (auraGroup) auraGroup.visible = false;
    return;
  }
  auraGroup.visible = true;

  const bolts = auraGroup.userData?.bolts;
  if (bolts) {
    bolts.forEach((line, bIdx) => {
      const pos = line.geometry.attributes.position;
      const angle = (bIdx / bolts.length) * Math.PI * 2 + time * 2.4;
      const radius = 1.15 + Math.sin(time * 5.2 + bIdx) * 0.28;

      const startX = Math.cos(angle) * radius;
      const startY = 0.55 + Math.sin(angle * 2) * 0.35;
      const startZ = Math.sin(angle) * radius;

      const endX = Math.cos(angle + 1.25) * (radius * 0.85);
      const endY = -0.45 + Math.cos(angle) * 0.3;
      const endZ = Math.sin(angle + 1.25) * (radius * 0.85);

      const count = pos.count;
      for (let i = 0; i < count; i++) {
        const t = i / (count - 1);
        const jitter = (1.0 - Math.abs(t - 0.5) * 2) * 0.32;
        const jx = (Math.random() - 0.5) * jitter;
        const jy = (Math.random() - 0.5) * jitter;
        const jz = (Math.random() - 0.5) * jitter;

        pos.setXYZ(
          i,
          startX + (endX - startX) * t + jx,
          startY + (endY - startY) * t + jy,
          startZ + (endZ - startZ) * t + jz
        );
      }
      pos.needsUpdate = true;
      line.material.opacity = (0.35 + Math.random() * 0.65) * Math.min(intensity, 1.0);
    });
  }

  const sparks = auraGroup.userData?.sparkPoints;
  if (sparks) {
    sparks.rotation.y = time * 0.8;
    sparks.rotation.x = Math.sin(time * 0.4) * 0.3;
  }
}

/**
 * =========================================================================
 * 6. THOR'S HAMMER: MJÖLNIR (PHOTOREALISTIC ASGARDIAN URU 3D MODEL)
 * Accurate to the official cinematic and mythological design:
 * - Hand-crafted forged Uru rectangular hammer head with 45° chamfered bevels
 * - Precision-etched Triquetra (Trinity / Odin's Knot) on side faces
 * - Norse Celtic interlacing knotwork filigree along the chamfered panels
 * - Stepped cylindrical collar ferrule with beaded joint
 * - Ribbed rich brown leather handle grip
 * - Silver steel metallic spiral ribbon winding 7.5 times up the handle
 * - Flared Asgardian crown pommel with side ear brackets and end cap
 * - Drooping brown leather wrist strap / lanyard
 * - Interactive crackling electric lightning rune aura & Asgardian sparks
 * =========================================================================
 */

function createMjolnirTriquetraTexture(themeColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Brushed Uru steel background
  const bgGrad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
  bgGrad.addColorStop(0, '#858d98');
  bgGrad.addColorStop(0.7, '#6b737e');
  bgGrad.addColorStop(1, '#535a64');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle brushed metal streaks
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let y = 0; y < 512; y += 4) {
    if (Math.sin(y * 12.3) > 0) {
      ctx.fillRect(0, y, 512, 2);
    }
  }

  // Draw Triquetra (Trinity Knot)
  const cx = 256;
  const cy = 256;
  const r = 95;

  ctx.save();
  ctx.translate(cx, cy);

  // Inset shadow under knot
  ctx.strokeStyle = '#353a41';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  function drawTriquetraPaths() {
    const centers = [
      { x: 0, y: -r * 0.58 },
      { x: -r * 0.5, y: r * 0.32 },
      { x: r * 0.5, y: r * 0.32 }
    ];
    centers.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, r * 0.95, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Central circular ring
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.62, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Dark relief stroke
  drawTriquetraPaths();

  // Engraved silver stroke
  ctx.strokeStyle = '#a4acb7';
  ctx.lineWidth = 6;
  drawTriquetraPaths();

  // Highlight inner stroke
  ctx.strokeStyle = '#d5dbe3';
  ctx.lineWidth = 2.5;
  drawTriquetraPaths();

  // Circular medallion border around Triquetra
  ctx.strokeStyle = '#3a3f47';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(0, 0, 165, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#bcc3cd';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 165, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function createMjolnirKnotworkTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Brushed steel base
  ctx.fillStyle = '#656d78';
  ctx.fillRect(0, 0, 512, 128);

  // Knotwork braid pattern
  ctx.strokeStyle = '#2d333b';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';

  const drawBraids = () => {
    ctx.beginPath();
    for (let x = 0; x < 512; x += 32) {
      ctx.moveTo(x, 32);
      ctx.bezierCurveTo(x + 16, 12, x + 16, 116, x + 32, 96);
      ctx.moveTo(x, 96);
      ctx.bezierCurveTo(x + 16, 116, x + 16, 12, x + 32, 32);
    }
    ctx.stroke();
  };

  // Shadow
  drawBraids();

  // Silver embossed lines
  ctx.strokeStyle = '#b8c0cb';
  ctx.lineWidth = 3.5;
  drawBraids();

  ctx.strokeStyle = '#e4ebf5';
  ctx.lineWidth = 1.5;
  drawBraids();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createDetailedMjolnir(themeColor = '#00d4ff', isWireframe = false, envMap = null, mode = 'classic') {
  const mjolnirGroup = new THREE.Group();
  mjolnirGroup.name = 'Mjolnir';

  const triquetraTex = createMjolnirTriquetraTexture(themeColor);
  const knotworkTex = createMjolnirKnotworkTexture();

  // 1. Materials
  const uruMat = new THREE.MeshPhysicalMaterial({
    color: isWireframe ? new THREE.Color(themeColor) : 0x8a929e,
    wireframe: isWireframe,
    metalness: 0.92,
    roughness: 0.26,
    clearcoat: 0.45,
    clearcoatRoughness: 0.16,
    reflectivity: 0.92,
    envMap: envMap,
    envMapIntensity: 2.2,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: isWireframe ? 0.45 : (mode === 'thunder' ? 0.35 : 0.05)
  });
  uruMat.userData = { type: 'uru' };

  const uruDarkMat = new THREE.MeshStandardMaterial({
    color: isWireframe ? new THREE.Color(themeColor) : 0x565c66,
    wireframe: isWireframe,
    metalness: 0.94,
    roughness: 0.32,
    envMap: envMap,
    envMapIntensity: 1.8,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: isWireframe ? 0.4 : 0.04
  });
  uruDarkMat.userData = { type: 'uru' };

  const triquetraMat = new THREE.MeshStandardMaterial({
    map: triquetraTex,
    color: isWireframe ? new THREE.Color(themeColor) : 0xffffff,
    wireframe: isWireframe,
    metalness: 0.88,
    roughness: 0.28,
    envMap: envMap,
    envMapIntensity: 2.0,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: isWireframe ? 0.45 : (mode === 'thunder' ? 0.4 : 0.06)
  });
  triquetraMat.userData = { type: 'uru' };

  const knotworkMat = new THREE.MeshStandardMaterial({
    map: knotworkTex,
    color: isWireframe ? new THREE.Color(themeColor) : 0xffffff,
    wireframe: isWireframe,
    metalness: 0.9,
    roughness: 0.28,
    envMap: envMap,
    envMapIntensity: 1.9,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: isWireframe ? 0.4 : 0.05
  });
  knotworkMat.userData = { type: 'uru' };

  const silverRibbonMat = new THREE.MeshStandardMaterial({
    color: isWireframe ? new THREE.Color(themeColor) : 0xd8dee6,
    wireframe: isWireframe,
    metalness: 0.96,
    roughness: 0.14,
    envMap: envMap,
    envMapIntensity: 2.5,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: isWireframe ? 0.45 : 0.08
  });
  silverRibbonMat.userData = { type: 'silver' };

  const leatherMat = new THREE.MeshStandardMaterial({
    color: isWireframe ? new THREE.Color(themeColor) : 0x4a2414,
    wireframe: isWireframe,
    metalness: 0.1,
    roughness: 0.72,
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: isWireframe ? 0.35 : 0.02
  });
  leatherMat.userData = { type: 'leather' };

  const lightningRuneMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(themeColor),
    emissive: new THREE.Color(themeColor),
    emissiveIntensity: 2.2,
    roughness: 0.1,
    metalness: 0.9
  });
  lightningRuneMat.userData = { type: 'rune' };

  // =========================================================================
  // 2. THE HAMMER HEAD
  // =========================================================================
  const headGroup = new THREE.Group();
  mjolnirGroup.add(headGroup);

  // Main rectangular Uru block
  const headWidth = 1.52;
  const headHeight = 1.28;
  const headLength = 2.32;
  const mainBlockGeom = new THREE.BoxGeometry(headWidth, headHeight, headLength);
  const mainBlock = new THREE.Mesh(mainBlockGeom, uruMat);
  headGroup.add(mainBlock);

  // 4 Corner Chamfered Bevels with Celtic Knotwork along the length
  const chamferWidth = 0.32;
  const chamferGeom = new THREE.BoxGeometry(chamferWidth, chamferWidth, headLength + 0.02);

  const chamferPositions = [
    { x: headWidth / 2, y: headHeight / 2, rot: Math.PI / 4 },
    { x: -headWidth / 2, y: headHeight / 2, rot: -Math.PI / 4 },
    { x: headWidth / 2, y: -headHeight / 2, rot: -Math.PI / 4 },
    { x: -headWidth / 2, y: -headHeight / 2, rot: Math.PI / 4 }
  ];

  chamferPositions.forEach(cp => {
    const chamfer = new THREE.Mesh(chamferGeom, knotworkMat);
    chamfer.position.set(cp.x, cp.y, 0);
    chamfer.rotation.z = cp.rot;
    headGroup.add(chamfer);
  });

  // Front & Rear Striking Faces (Hammer Ends)
  const faceGeom = new THREE.BoxGeometry(headWidth - 0.08, headHeight - 0.08, 0.14);
  const frontFace = new THREE.Mesh(faceGeom, uruDarkMat);
  frontFace.position.set(0, 0, headLength / 2 + 0.07);
  headGroup.add(frontFace);

  const rearFace = new THREE.Mesh(faceGeom, uruDarkMat);
  rearFace.position.set(0, 0, -headLength / 2 - 0.07);
  headGroup.add(rearFace);

  // End striking bevel collars
  const endCapChamferGeom = new THREE.BoxGeometry(headWidth + 0.04, headHeight + 0.04, 0.06);
  const frontCollar = new THREE.Mesh(endCapChamferGeom, knotworkMat);
  frontCollar.position.set(0, 0, headLength / 2 - 0.02);
  headGroup.add(frontCollar);

  const rearCollar = new THREE.Mesh(endCapChamferGeom, knotworkMat);
  rearCollar.position.set(0, 0, -headLength / 2 + 0.02);
  headGroup.add(rearCollar);

  // Center Waist Recessed Grooves
  const grooveBandGeom = new THREE.BoxGeometry(headWidth + 0.02, headHeight + 0.02, 0.08);
  const groove1 = new THREE.Mesh(grooveBandGeom, uruDarkMat);
  groove1.position.set(0, 0, 0.42);
  headGroup.add(groove1);

  const groove2 = new THREE.Mesh(grooveBandGeom, uruDarkMat);
  groove2.position.set(0, 0, -0.42);
  headGroup.add(groove2);

  // Side Faces: Triquetra (Trinity / Odin's Knot) Emblem Plates
  const triquetraPlaneGeom = new THREE.PlaneGeometry(1.4, 0.95);
  const rightPlate = new THREE.Mesh(triquetraPlaneGeom, triquetraMat);
  rightPlate.position.set(headWidth / 2 + 0.005, 0, 0);
  rightPlate.rotation.y = Math.PI / 2;
  headGroup.add(rightPlate);

  const leftPlate = new THREE.Mesh(triquetraPlaneGeom, triquetraMat);
  leftPlate.position.set(-headWidth / 2 - 0.005, 0, 0);
  leftPlate.rotation.y = -Math.PI / 2;
  headGroup.add(leftPlate);

  // Bottom Circular Medallion Plate
  const bottomMedallion = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.03, 32), uruDarkMat);
  bottomMedallion.position.set(0, -headHeight / 2 - 0.015, 0);
  headGroup.add(bottomMedallion);

  // =========================================================================
  // 3. THE HANDLE COLLAR / FERRULE SOCKET
  // =========================================================================
  const collarGroup = new THREE.Group();
  collarGroup.position.set(0, headHeight / 2, 0);
  headGroup.add(collarGroup);

  const baseCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.1, 32), silverRibbonMat);
  baseCollar.position.set(0, 0.05, 0);
  collarGroup.add(baseCollar);

  const upperCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.08, 32), silverRibbonMat);
  upperCollar.position.set(0, 0.14, 0);
  collarGroup.add(upperCollar);

  const collarTorus = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.035, 16, 32), silverRibbonMat);
  collarTorus.rotation.x = Math.PI / 2;
  collarTorus.position.set(0, 0.18, 0);
  collarGroup.add(collarTorus);

  // =========================================================================
  // 4. THE HANDLE SHAFT & SILVER HELIX RIBBON
  // =========================================================================
  const handleGroup = new THREE.Group();
  const handleLength = 2.75;
  const handleRadius = 0.175;

  // Leather shaft
  const shaftGeom = new THREE.CylinderGeometry(handleRadius, handleRadius + 0.01, handleLength, 32);
  const shaft = new THREE.Mesh(shaftGeom, leatherMat);
  shaft.position.set(0, headHeight / 2 + 0.18 + handleLength / 2, 0);
  mjolnirGroup.add(shaft);

  // The Iconic Silver Spiral Band (Helix Ribbon winding up the handle)
  class MjolnirHelixCurve extends THREE.Curve {
    constructor(r = 0.184, h = 2.7, turns = 7.5) {
      super();
      this.r = r;
      this.h = h;
      this.turns = turns;
    }
    getPoint(t) {
      const phi = t * Math.PI * 2 * this.turns;
      return new THREE.Vector3(
        Math.cos(phi) * this.r,
        (t - 0.5) * this.h,
        Math.sin(phi) * this.r
      );
    }
  }

  const helixGeom = new THREE.TubeGeometry(new MjolnirHelixCurve(handleRadius + 0.012, handleLength, 7.5), 180, 0.024, 12, false);
  const helixMesh = new THREE.Mesh(helixGeom, silverRibbonMat);
  helixMesh.position.copy(shaft.position);
  mjolnirGroup.add(helixMesh);

  // =========================================================================
  // 5. THE POMMEL CAP & ASGARDIAN CROWN SHROUD
  // =========================================================================
  const pommelY = shaft.position.y + handleLength / 2;
  const pommelGroup = new THREE.Group();
  pommelGroup.position.set(0, pommelY, 0);
  mjolnirGroup.add(pommelGroup);

  // Flared crown sleeve
  const crownSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.19, 0.38, 32), silverRibbonMat);
  crownSleeve.position.set(0, 0.19, 0);
  pommelGroup.add(crownSleeve);

  // Side ear shroud brackets (as seen in reference photos)
  const bracketGeom = new THREE.BoxGeometry(0.44, 0.32, 0.18);
  const shroudBracket = new THREE.Mesh(bracketGeom, silverRibbonMat);
  shroudBracket.position.set(0, 0.22, 0);
  pommelGroup.add(shroudBracket);

  // Flared top cap
  const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.24, 0.12, 32), silverRibbonMat);
  topCap.position.set(0, 0.44, 0);
  pommelGroup.add(topCap);

  // End medallion plate
  const endDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.03, 32), uruDarkMat);
  endDisc.position.set(0, 0.51, 0);
  pommelGroup.add(endDisc);

  // Brown leather wrist strap loop hanging from the pommel
  const strapCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, 0.35, 0.18),
    new THREE.Vector3(0, -0.4, 0.45),
    new THREE.Vector3(0, -1.1, 0.35),
    new THREE.Vector3(0, -1.4, 0.08)
  );
  const strapGeom = new THREE.TubeGeometry(strapCurve, 32, 0.035, 8, false);
  const strap = new THREE.Mesh(strapGeom, leatherMat);
  pommelGroup.add(strap);

  // =========================================================================
  // 6. ENCHANTED LIGHTNING AURA & SPARKS
  // =========================================================================
  const sparkCount = 18;
  const sparkGroup = new THREE.Group();
  const sparkGeom = new THREE.SphereGeometry(0.045, 8, 8);
  for (let i = 0; i < sparkCount; i++) {
    const spark = new THREE.Mesh(sparkGeom, lightningRuneMat);
    const ang = (i / sparkCount) * Math.PI * 2;
    const r = 1.1 + Math.random() * 0.4;
    spark.position.set(Math.cos(ang) * r, (Math.random() - 0.5) * 1.2, Math.sin(ang) * r);
    sparkGroup.add(spark);
  }
  headGroup.add(sparkGroup);

  // Center the pivot of Mjolnir for smooth balanced orbit
  mjolnirGroup.position.set(0, -1.1, 0);

  // Heroic dynamic tilt
  mjolnirGroup.rotation.z = -0.32;
  mjolnirGroup.rotation.x = 0.22;

  return mjolnirGroup;
}

/**
 * Updates color and wireframe state across all child meshes in a model group
 * without expensive geometry re-creations.
 */
export function updateModelStyle(group, themeColor = '#00d4ff', isWireframe = false, mode = 'classic') {
  if (!group) return;
  const color = new THREE.Color(themeColor);

  // Update lightning aura color & visibility
  if (group.userData?.lightningAura) {
    const aura = group.userData.lightningAura;
    const bolts = aura.userData?.bolts;
    if (bolts) {
      bolts.forEach((b) => b.material.color.copy(color));
    }
    if (aura.userData?.sparkPoints) {
      aura.userData.sparkPoints.material.color.copy(color);
    }
    aura.visible = mode === 'thunder' || isWireframe;
  }

  group.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];

    mats.forEach((mat) => {
      mat.wireframe = isWireframe;

      // Handle GLTF model meshes with original texture properties
      if (child.userData.originalMatProps) {
        const orig = child.userData.originalMatProps;
        if (isWireframe) {
          mat.color.copy(color);
          mat.emissive.copy(color);
          mat.emissiveIntensity = 0.5;
        } else {
          mat.color.copy(orig.color);
          mat.metalness = orig.metalness;
          mat.roughness = orig.roughness;

          if (mode === 'classic') {
            mat.emissive.copy(color);
            mat.emissiveIntensity = 0.08;
          } else if (mode === 'thunder') {
            mat.emissive.copy(color);
            mat.emissiveIntensity = 0.55;
            mat.roughness = 0.2;
          } else if (mode === 'bifrost') {
            mat.emissive.set('#fbbf24');
            mat.emissiveIntensity = 0.48;
            mat.roughness = 0.16;
          } else if (mode === 'ragnarok') {
            mat.emissive.set('#ff003c');
            mat.emissiveIntensity = 0.4;
            mat.roughness = 0.38;
          }
        }
        mat.needsUpdate = true;
        return;
      }

      // Handle Procedural Mjolnir mesh
      const type = mat.userData?.type;
      if (isWireframe) {
        mat.color.copy(color);
        mat.emissive.copy(color);
        mat.emissiveIntensity = 0.45;
      } else {
        if (type === 'uru') {
          if (mode === 'bifrost') {
            mat.color.set(0x9ca3af);
            mat.emissive.set('#fbbf24');
            mat.emissiveIntensity = 0.25;
          } else if (mode === 'ragnarok') {
            mat.color.set(0x6b7280);
            mat.emissive.set('#ff003c');
            mat.emissiveIntensity = 0.2;
          } else {
            mat.color.set(0x8a929e);
            mat.emissive.copy(color);
            mat.emissiveIntensity = mode === 'thunder' ? 0.4 : 0.06;
          }
        } else if (type === 'silver') {
          mat.color.set(0xd8dee6);
          mat.emissive.copy(color);
          mat.emissiveIntensity = 0.08;
        } else if (type === 'leather') {
          mat.color.set(0x4a2414);
          mat.emissive.copy(color);
          mat.emissiveIntensity = 0.02;
        } else if (type === 'rune') {
          mat.color.copy(color);
          mat.emissive.copy(color);
          mat.emissiveIntensity = mode === 'thunder' ? 2.8 : 1.8;
        }
      }
      mat.needsUpdate = true;
    });
  });
}
