// ==========================================
// ADVANCED PORTFOLIO CONTROLLER (main.js)
// 3D Tilt, Audio FX, Interactive Lab, Modals & HUD
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. WEB AUDIO API - SCI-FI UI SOUND FX (Synthesized, No external audio files needed)
    // ==========================================
    let audioCtx = null;
    let soundEnabled = false; // Muted by default for polite UX, easy toggle in navbar

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playBlipSound(freq = 600, duration = 0.05, type = 'sine') {
        if (!soundEnabled || !audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Audio context restriction
        }
    }

    const audioToggleBtn = document.getElementById('audio-toggle');
    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', () => {
            initAudio();
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            soundEnabled = !soundEnabled;
            audioToggleBtn.classList.toggle('active', soundEnabled);
            const icon = audioToggleBtn.querySelector('i');
            if (icon) {
                icon.className = soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
            }
            if (soundEnabled) {
                playBlipSound(880, 0.1);
                showToast('Cyber Audio Activated');
            } else {
                showToast('Audio Muted');
            }
        });
    }

    // Attach gentle hover blips to buttons and cards
    document.querySelectorAll('.btn, .nav-link, .skill-card, .cert-card, .hud-btn').forEach(elem => {
        elem.addEventListener('mouseenter', () => playBlipSound(700, 0.03, 'triangle'));
        elem.addEventListener('click', () => playBlipSound(1050, 0.06, 'sine'));
    });

    // ==========================================
    // 2. HUD 3D CONTROLLER & THEME PICKER
    // ==========================================
    const hudToggle = document.getElementById('hud-toggle');
    const hudPanel = document.getElementById('hud-panel');

    if (hudToggle && hudPanel) {
        hudToggle.addEventListener('click', () => {
            hudPanel.classList.toggle('open');
            hudToggle.classList.toggle('active');
        });
    }

    // 3D Mode Switcher
    document.querySelectorAll('[data-3d-mode]').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.getAttribute('data-3d-mode');
            if (window.threeSceneController) {
                window.threeSceneController.setMode(mode);
                showToast(`3D Mode: ${mode.toUpperCase()}`);
            }
        });
    });

    // 3D Theme Switcher
    document.querySelectorAll('[data-3d-theme]').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-3d-theme');
            if (window.threeSceneController) {
                window.threeSceneController.setColorTheme(theme);
                showToast(`Theme: ${theme.toUpperCase()}`);
            }
        });
    });

    // ==========================================
    // 3. DYNAMIC TYPEWRITER & GLITCH EFFECT
    // ==========================================
    const typewriterElement = document.getElementById('dynamic-typewriter');
    if (typewriterElement) {
        const phrases = [
            "AI & Data Science Specialist",
            "3D Architectural Designer",
            "AutoDesk Certified Expert",
            "Unreal Engine Game Developer",
            "Cinematic Video Editor",
            "Computer Hardware Engineer"
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        function type() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2200; // Pause at end of phrase
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 400; // Pause before typing new phrase
            }

            setTimeout(type, typeSpeed);
        }
        type();
    }

    // ==========================================
    // 4. INTERACTIVE 3D CARD TILT (Vanilla Parallax with Glare)
    // ==========================================
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Update custom property for dynamic glare sheen
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // ==========================================
    // 5. INTERACTIVE 3D LAB (Dedicated Canvas Playground)
    // ==========================================
    const labCanvas = document.getElementById('lab-3d-canvas');
    if (labCanvas) {
        init3DLab(labCanvas);
    }

    function init3DLab(canvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Geometries
        const geometries = {
            torus: new THREE.TorusKnotGeometry(1.2, 0.38, 120, 24),
            icosahedron: new THREE.IcosahedronGeometry(1.6, 1),
            octahedron: new THREE.OctahedronGeometry(1.8, 0),
            sphere: new THREE.SphereGeometry(1.5, 32, 32)
        };

        // Wireframe holographic material
        const material = new THREE.MeshStandardMaterial({
            color: 0x00f0ff,
            wireframe: true,
            roughness: 0.2,
            metalness: 0.9,
            emissive: 0x00f0ff,
            emissiveIntensity: 0.35
        });

        let currentMesh = new THREE.Mesh(geometries.torus, material);
        scene.add(currentMesh);

        // Core glow inner sphere
        const coreMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.4 });
        const coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 1), coreMat);
        scene.add(coreMesh);

        // Lighting
        const pointLight1 = new THREE.PointLight(0x00f0ff, 2, 20);
        pointLight1.position.set(4, 4, 4);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xec4899, 2, 20);
        pointLight2.position.set(-4, -4, 2);
        scene.add(pointLight2);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // Drag-to-rotate interaction
        let isDragging = false;
        let prevMousePos = { x: 0, y: 0 };
        let autoRotate = true;

        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            autoRotate = false;
            prevMousePos = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            autoRotate = true;
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - prevMousePos.x;
            const deltaY = e.clientY - prevMousePos.y;

            currentMesh.rotation.y += deltaX * 0.01;
            currentMesh.rotation.x += deltaY * 0.01;
            coreMesh.rotation.y -= deltaX * 0.01;

            prevMousePos = { x: e.clientX, y: e.clientY };
        });

        // Touch drag
        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                isDragging = true;
                autoRotate = false;
                prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        }, { passive: true });

        canvas.addEventListener('touchmove', (e) => {
            if (!isDragging || e.touches.length === 0) return;
            const deltaX = e.touches[0].clientX - prevMousePos.x;
            const deltaY = e.touches[0].clientY - prevMousePos.y;

            currentMesh.rotation.y += deltaX * 0.015;
            currentMesh.rotation.x += deltaY * 0.015;

            prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isDragging = false;
            autoRotate = true;
        });

        // Resize handler for lab
        window.addEventListener('resize', () => {
            if (!canvas.parentElement) return;
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });

        // Geometry buttons in lab
        document.querySelectorAll('[data-lab-shape]').forEach(btn => {
            btn.addEventListener('click', () => {
                const shape = btn.getAttribute('data-lab-shape');
                if (geometries[shape]) {
                    scene.remove(currentMesh);
                    currentMesh.geometry.dispose();
                    currentMesh = new THREE.Mesh(geometries[shape], material);
                    scene.add(currentMesh);

                    document.querySelectorAll('[data-lab-shape]').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    showToast(`Shape: ${shape.toUpperCase()}`);
                }
            });
        });

        // Wireframe toggle
        const wireframeBtn = document.getElementById('toggle-wireframe-btn');
        if (wireframeBtn) {
            wireframeBtn.addEventListener('click', () => {
                material.wireframe = !material.wireframe;
                wireframeBtn.classList.toggle('active', material.wireframe);
                showToast(`Wireframe: ${material.wireframe ? 'ON' : 'OFF'}`);
            });
        }

        // Color toggle for lab
        document.querySelectorAll('[data-lab-color]').forEach(btn => {
            btn.addEventListener('click', () => {
                const hex = btn.getAttribute('data-lab-color');
                material.color.set(hex);
                material.emissive.set(hex);
                pointLight1.color.set(hex);
                document.querySelectorAll('[data-lab-color]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Lab render loop
        function animateLab() {
            requestAnimationFrame(animateLab);
            if (autoRotate) {
                currentMesh.rotation.y += 0.012;
                currentMesh.rotation.x += 0.007;
                coreMesh.rotation.y -= 0.018;
                coreMesh.rotation.z += 0.01;
            }
            renderer.render(scene, camera);
        }
        animateLab();
    }

    // ==========================================
    // 6. CERTIFICATE & MEDIA MODAL VIEWER
    // ==========================================
    const modal = document.getElementById('media-modal');
    const modalBody = document.getElementById('modal-content-container');
    const modalTitle = document.getElementById('modal-title');
    const modalClose = document.getElementById('modal-close');

    function openModal(title, url, type = 'image') {
        if (!modal || !modalBody) return;
        modalTitle.textContent = title;
        modalBody.innerHTML = '';

        if (type === 'pdf') {
            modalBody.innerHTML = `
                <iframe src="${url}" class="modal-pdf-frame" frameborder="0"></iframe>
                <div class="modal-download-bar">
                    <a href="${url}" target="_blank" class="btn btn-primary">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i> Open In New Tab
                    </a>
                </div>
            `;
        } else {
            modalBody.innerHTML = `
                <img src="${url}" alt="${title}" class="modal-image">
            `;
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        if (modalBody) modalBody.innerHTML = '';
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const title = trigger.getAttribute('data-modal-title') || 'Certificate';
            const url = trigger.getAttribute('data-modal-url');
            const type = trigger.getAttribute('data-modal-type') || 'image';
            if (url) openModal(title, url, type);
        });
    });

    // ==========================================
    // 7. CERTIFICATE & PROJECT FILTER TABS
    // ==========================================
    const filterTabs = document.querySelectorAll('.cert-filter-btn');
    const certCards = document.querySelectorAll('.cert-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');

            certCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    // ==========================================
    // 8. CLIPBOARD COPY UTILITY & TOAST NOTIFIER
    // ==========================================
    const toast = document.getElementById('cyber-toast');
    let toastTimeout = null;

    function showToast(message) {
        if (!toast) return;
        toast.querySelector('.toast-msg').textContent = message;
        toast.classList.add('visible');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('visible');
        }, 2800);
    }

    document.querySelectorAll('[data-copy]').forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            if (navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast(`Copied to clipboard: ${textToCopy}`);
                    playBlipSound(1200, 0.08);
                }).catch(() => {
                    showToast(`Select & Copy: ${textToCopy}`);
                });
            }
        });
    });

    // ==========================================
    // 9. NAVBAR SCROLL SPY & MOBILE MENU
    // ==========================================
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menu-icon');
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        // Navbar blur intensity on scroll
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Active link highlighting
        sections.forEach(sec => {
            const sectionHeight = sec.offsetHeight;
            const sectionTop = sec.offsetTop - 180;
            const sectionId = sec.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // Reveal on scroll elements
        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.85) {
                el.classList.add('is-revealed');
            }
        });
    });

    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            navbar.classList.toggle('open');
            menuToggle.classList.toggle('fa-xmark');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('open');
                menuToggle.classList.remove('fa-xmark');
            });
        });
    }

    // Trigger initial scroll reveal check
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);

});
