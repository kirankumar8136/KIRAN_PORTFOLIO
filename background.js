// ==========================================
// ADVANCED 3D WEBGL ENGINE (Three.js)
// Multiple 3D Modes, Interactive Gravity, HUD Controller
// ==========================================

(function() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 280;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // --- State & Themes ---
    const themes = {
        cyan: {
            name: 'Cyber Cyan',
            primary: '#00f0ff',
            secondary: '#3b82f6',
            accent: '#8b5cf6',
            particleColors: ['#00f0ff', '#3b82f6', '#8b5cf6', '#ffffff'],
            lineColor: 0x00f0ff,
            gridColor: 0x00f0ff
        },
        violet: {
            name: 'Neon Violet',
            primary: '#ec4899',
            secondary: '#8b5cf6',
            accent: '#6366f1',
            particleColors: ['#ec4899', '#8b5cf6', '#a855f7', '#ffffff'],
            lineColor: 0xec4899,
            gridColor: 0x8b5cf6
        },
        matrix: {
            name: 'Matrix Emerald',
            primary: '#10b981',
            secondary: '#059669',
            accent: '#34d399',
            particleColors: ['#10b981', '#059669', '#6ee7b7', '#ffffff'],
            lineColor: 0x10b981,
            gridColor: 0x059669
        },
        amber: {
            name: 'Solar Flare',
            primary: '#f59e0b',
            secondary: '#ef4444',
            accent: '#fbbf24',
            particleColors: ['#f59e0b', '#ef4444', '#fbbf24', '#ffffff'],
            lineColor: 0xf59e0b,
            gridColor: 0xef4444
        }
    };

    let currentThemeKey = 'cyan';
    let currentTheme = themes.cyan;
    let currentMode = 'constellation'; // 'constellation', 'grid', 'quantum'

    // Groups for different modes
    const constellationGroup = new THREE.Group();
    const gridGroup = new THREE.Group();
    const quantumGroup = new THREE.Group();

    scene.add(constellationGroup);
    scene.add(gridGroup);
    scene.add(quantumGroup);

    gridGroup.visible = false;
    quantumGroup.visible = false;

    // --- Texture Generator (Soft Radial Glow Sprite) ---
    function createGlowSprite() {
        const c = document.createElement('canvas');
        c.width = 64;
        c.height = 64;
        const ctx = c.getContext('2d');
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.9)');
        grad.addColorStop(0.5, 'rgba(120, 220, 255, 0.35)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
    }
    const spriteTexture = createGlowSprite();

    // ==========================================
    // MODE 1: NEURAL CONSTELLATION & GRAVITY
    // ==========================================
    const particleCount = 1400;
    const pGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const basePositions = [];

    const boundsX = window.innerWidth * 0.9;
    const boundsY = window.innerHeight * 0.9;
    const boundsZ = 400;

    function initConstellationParticles() {
        const palette = currentTheme.particleColors.map(c => new THREE.Color(c));
        for (let i = 0; i < particleCount; i++) {
            const x = (Math.random() - 0.5) * boundsX;
            const y = (Math.random() - 0.5) * boundsY;
            const z = (Math.random() - 0.5) * boundsZ;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            basePositions[i] = {
                x, y, z,
                angleX: Math.random() * Math.PI * 2,
                angleY: Math.random() * Math.PI * 2,
                speed: 0.15 + Math.random() * 0.35,
                radius: 2 + Math.random() * 6
            };

            const col = palette[Math.floor(Math.random() * palette.length)];
            colors[i * 3] = col.r;
            colors[i * 3 + 1] = col.g;
            colors[i * 3 + 2] = col.b;
        }

        pGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        pGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }
    initConstellationParticles();

    const pMaterial = new THREE.PointsMaterial({
        size: 9,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        map: spriteTexture,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(pGeometry, pMaterial);
    constellationGroup.add(particles);

    // Dynamic Connections (Constellation lines)
    const maxLineConnections = 250;
    const linePositions = new Float32Array(maxLineConnections * 6);
    const lineColors = new Float32Array(maxLineConnections * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineSegmentsMaterial ? new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    }) : new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });

    const connectionLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    constellationGroup.add(connectionLines);

    // ==========================================
    // MODE 2: CYBER HORIZON WAVE GRID
    // ==========================================
    const gridWidth = 700;
    const gridDepth = 600;
    const gridSegX = 45;
    const gridSegY = 45;
    const gridGeometry = new THREE.PlaneGeometry(gridWidth, gridDepth, gridSegX, gridSegY);
    gridGeometry.rotateX(-Math.PI / 2.3);

    const gridMaterial = new THREE.MeshBasicMaterial({
        color: currentTheme.gridColor,
        wireframe: true,
        transparent: true,
        opacity: 0.35
    });

    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    gridMesh.position.y = -80;
    gridMesh.position.z = -50;
    gridGroup.add(gridMesh);

    // Ambient floating grid particles
    const gridDustCount = 300;
    const gridDustGeo = new THREE.BufferGeometry();
    const gridDustPos = new Float32Array(gridDustCount * 3);
    for (let i = 0; i < gridDustCount; i++) {
        gridDustPos[i * 3] = (Math.random() - 0.5) * 600;
        gridDustPos[i * 3 + 1] = (Math.random() - 0.5) * 300;
        gridDustPos[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    gridDustGeo.setAttribute('position', new THREE.BufferAttribute(gridDustPos, 3));
    const gridDustMat = new THREE.PointsMaterial({
        size: 6,
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.7,
        map: spriteTexture,
        blending: THREE.AdditiveBlending
    });
    const gridDust = new THREE.Points(gridDustGeo, gridDustMat);
    gridGroup.add(gridDust);

    // ==========================================
    // MODE 3: QUANTUM CORE (3D Holographic Artifact)
    // ==========================================
    // Outer Icosahedron Wireframe
    const icoGeo = new THREE.IcosahedronGeometry(75, 1);
    const icoMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.45
    });
    const outerIco = new THREE.Mesh(icoGeo, icoMat);
    quantumGroup.add(outerIco);

    // Inner Pulsing Octahedron
    const octGeo = new THREE.OctahedronGeometry(45, 0);
    const octMat = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.75
    });
    const innerOct = new THREE.Mesh(octGeo, octMat);
    quantumGroup.add(innerOct);

    // Core Glowing Sphere
    const coreGeo = new THREE.SphereGeometry(18, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.95
    });
    const centerCore = new THREE.Mesh(coreGeo, coreMat);
    quantumGroup.add(centerCore);

    // Orbital Rings
    function createOrbitalRing(radius, tube, rotX, rotY, color) {
        const ringGeo = new THREE.TorusGeometry(radius, tube, 8, 48);
        const ringMat = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = rotX;
        ring.rotation.y = rotY;
        return ring;
    }
    const ring1 = createOrbitalRing(105, 1.2, Math.PI / 4, 0, 0x00f0ff);
    const ring2 = createOrbitalRing(120, 1.2, -Math.PI / 3, Math.PI / 6, 0xec4899);
    quantumGroup.add(ring1);
    quantumGroup.add(ring2);

    // Orbital Electrons
    const electronCount = 80;
    const electronGeo = new THREE.BufferGeometry();
    const electronPos = new Float32Array(electronCount * 3);
    for (let i = 0; i < electronCount; i++) {
        const angle = (i / electronCount) * Math.PI * 2;
        const rad = 95 + (i % 3) * 15;
        electronPos[i * 3] = Math.cos(angle) * rad;
        electronPos[i * 3 + 1] = (Math.sin(angle) * rad) * 0.4;
        electronPos[i * 3 + 2] = Math.sin(angle) * rad;
    }
    electronGeo.setAttribute('position', new THREE.BufferAttribute(electronPos, 3));
    const electronMat = new THREE.PointsMaterial({
        size: 8,
        color: 0xffffff,
        map: spriteTexture,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    const electrons = new THREE.Points(electronGeo, electronMat);
    quantumGroup.add(electrons);

    // ==========================================
    // INTERACTION & MOUSE PHYSICS
    // ==========================================
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, isHovering: false };

    window.addEventListener('mousemove', (e) => {
        mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
        mouse.isHovering = true;
    });

    window.addEventListener('mouseleave', () => {
        mouse.targetX = 0;
        mouse.targetY = 0;
        mouse.isHovering = false;
    });

    // Touch support for mobile devices
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const t = e.touches[0];
            mouse.targetX = (t.clientX / window.innerWidth) * 2 - 1;
            mouse.targetY = -(t.clientY / window.innerHeight) * 2 + 1;
        }
    }, { passive: true });

    // Window Resize Handler
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize);

    // ==========================================
    // ANIMATION & RENDER LOOP
    // ==========================================
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // Smooth camera and mouse interpolation (lerp)
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        // Subtle 3D camera parallax based on cursor
        camera.position.x += (mouse.x * 25 - camera.position.x) * 0.04;
        camera.position.y += (mouse.y * 20 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        // Project mouse screen coords into 3D space for particle physics
        const mouseVector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        mouseVector.unproject(camera);
        const dir = mouseVector.sub(camera.position).normalize();
        const distToPlane = -camera.position.z / dir.z;
        const mouse3D = camera.position.clone().add(dir.multiplyScalar(distToPlane));

        // --- UPDATE ACTIVE MODE ---
        if (currentMode === 'constellation' && constellationGroup.visible) {
            const posAttr = pGeometry.attributes.position;
            const currentArr = posAttr.array;
            let lineIdx = 0;

            for (let i = 0; i < particleCount; i++) {
                const idx = i * 3;
                const bp = basePositions[i];

                // Orbital drift
                bp.angleX += bp.speed * delta * 0.8;
                bp.angleY += bp.speed * delta * 0.5;

                const driftX = Math.cos(bp.angleX) * bp.radius;
                const driftY = Math.sin(bp.angleY) * bp.radius;
                const targetX = bp.x + driftX;
                const targetY = bp.y + driftY;
                const targetZ = bp.z;

                let px = currentArr[idx];
                let py = currentArr[idx + 1];
                let pz = currentArr[idx + 2];

                // Mouse Repulsion Physics
                const dx = px - mouse3D.x;
                const dy = py - mouse3D.y;
                const dz = pz - mouse3D.z;
                const distSq = dx * dx + dy * dy + dz * dz;
                const maxDist = 110;

                let repelX = 0, repelY = 0, repelZ = 0;
                if (distSq < maxDist * maxDist) {
                    const dist = Math.sqrt(distSq);
                    const force = (maxDist - dist) / maxDist;
                    const strength = 45;
                    repelX = (dx / dist) * force * strength;
                    repelY = (dy / dist) * force * strength;
                    repelZ = (dz / dist) * force * strength * 0.4;
                }

                currentArr[idx] += (targetX - px) * 0.06 + repelX * 0.25;
                currentArr[idx + 1] += (targetY - py) * 0.06 + repelY * 0.25;
                currentArr[idx + 2] += (targetZ - pz) * 0.06 + repelZ * 0.25;

                // Dynamic Constellation lines between nearby particles
                if (i < 120 && lineIdx < maxLineConnections) {
                    for (let j = i + 1; j < 120; j++) {
                        const jdx = j * 3;
                        const ddx = currentArr[idx] - currentArr[jdx];
                        const ddy = currentArr[idx + 1] - currentArr[jdx + 1];
                        const ddz = currentArr[idx + 2] - currentArr[jdx + 2];
                        const distance = Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz);

                        if (distance < 55) {
                            const lPos = lineGeometry.attributes.position.array;
                            const lCol = lineGeometry.attributes.color.array;
                            const alpha = (1 - distance / 55);

                            const p6 = lineIdx * 6;
                            lPos[p6] = currentArr[idx];
                            lPos[p6 + 1] = currentArr[idx + 1];
                            lPos[p6 + 2] = currentArr[idx + 2];
                            lPos[p6 + 3] = currentArr[jdx];
                            lPos[p6 + 4] = currentArr[jdx + 1];
                            lPos[p6 + 5] = currentArr[jdx + 2];

                            const cObj = new THREE.Color(currentTheme.lineColor);
                            lCol[p6] = cObj.r * alpha;
                            lCol[p6 + 1] = cObj.g * alpha;
                            lCol[p6 + 2] = cObj.b * alpha;
                            lCol[p6 + 3] = cObj.r * alpha;
                            lCol[p6 + 4] = cObj.g * alpha;
                            lCol[p6 + 5] = cObj.b * alpha;

                            lineIdx++;
                            if (lineIdx >= maxLineConnections) break;
                        }
                    }
                }
            }

            // Zero out remaining line slots
            const lPos = lineGeometry.attributes.position.array;
            for (let k = lineIdx * 6; k < maxLineConnections * 6; k++) {
                lPos[k] = 0;
            }

            posAttr.needsUpdate = true;
            lineGeometry.attributes.position.needsUpdate = true;
            lineGeometry.attributes.color.needsUpdate = true;

            constellationGroup.rotation.y = time * 0.02;
            constellationGroup.rotation.x = time * 0.01;

        } else if (currentMode === 'grid' && gridGroup.visible) {
            // Wave movement on plane grid
            const gridPos = gridGeometry.attributes.position;
            const count = gridPos.count;
            for (let i = 0; i < count; i++) {
                const u = (i % (gridSegX + 1)) / gridSegX;
                const v = Math.floor(i / (gridSegX + 1)) / gridSegY;
                const wave1 = Math.sin(u * 8 + time * 2) * 12;
                const wave2 = Math.cos(v * 6 + time * 1.5) * 10;
                gridPos.setZ(i, wave1 + wave2);
            }
            gridPos.needsUpdate = true;

            gridGroup.rotation.y = mouse.x * 0.15;
            gridDust.rotation.y = time * 0.05;

        } else if (currentMode === 'quantum' && quantumGroup.visible) {
            // Interactive 3D Holographic Artifact
            outerIco.rotation.x = time * 0.25;
            outerIco.rotation.y = time * 0.35 + mouse.x * 0.5;

            innerOct.rotation.x = -time * 0.45;
            innerOct.rotation.z = time * 0.4 - mouse.y * 0.5;

            ring1.rotation.z = time * 0.5;
            ring2.rotation.z = -time * 0.4;

            const pulse = 1 + Math.sin(time * 3) * 0.12;
            centerCore.scale.set(pulse, pulse, pulse);

            electrons.rotation.y = time * 0.8;
            electrons.rotation.x = Math.sin(time) * 0.2;

            quantumGroup.position.x = mouse.x * 30;
            quantumGroup.position.y = mouse.y * 20;
        }

        renderer.render(scene, camera);
    }

    animate();

    // ==========================================
    // EXPOSED PUBLIC CONTROLLER (For UI Controls)
    // ==========================================
    window.threeSceneController = {
        setMode: function(modeName) {
            currentMode = modeName;
            constellationGroup.visible = (modeName === 'constellation');
            gridGroup.visible = (modeName === 'grid');
            quantumGroup.visible = (modeName === 'quantum');

            document.querySelectorAll('[data-3d-mode]').forEach(btn => {
                if (btn.getAttribute('data-3d-mode') === modeName) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        },

        setColorTheme: function(themeKey) {
            if (!themes[themeKey]) return;
            currentThemeKey = themeKey;
            currentTheme = themes[themeKey];

            // Update particle colors
            const palette = currentTheme.particleColors.map(c => new THREE.Color(c));
            const colAttr = pGeometry.attributes.color.array;
            for (let i = 0; i < particleCount; i++) {
                const col = palette[Math.floor(Math.random() * palette.length)];
                colAttr[i * 3] = col.r;
                colAttr[i * 3 + 1] = col.g;
                colAttr[i * 3 + 2] = col.b;
            }
            pGeometry.attributes.color.needsUpdate = true;

            // Update grid and line materials
            gridMaterial.color.set(currentTheme.gridColor);
            gridDustMat.color.set(currentTheme.primary);
            icoMat.color.set(currentTheme.primary);
            octMat.color.set(currentTheme.accent);
            ring1.material.color.set(currentTheme.primary);
            ring2.material.color.set(currentTheme.secondary);

            // Update CSS variables for full-site synchronization
            document.documentElement.style.setProperty('--primary-neon', currentTheme.primary);
            document.documentElement.style.setProperty('--secondary-neon', currentTheme.secondary);
            document.documentElement.style.setProperty('--accent-neon', currentTheme.accent);

            document.querySelectorAll('[data-3d-theme]').forEach(btn => {
                if (btn.getAttribute('data-3d-theme') === themeKey) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        },

        getAvailableThemes: function() {
            return themes;
        }
    };

})();
