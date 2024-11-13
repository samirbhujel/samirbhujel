'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// Theme toggle functionality
function initThemeToggle() {
    const themeBtn = document.querySelector("[data-theme-btn]");
    
    if (themeBtn) {
        // Load saved theme preference
        const savedTheme = localStorage.getItem("lightMode");
        if (savedTheme === "true") {
            document.body.classList.add("light-mode");
        }

        themeBtn.addEventListener("click", function() {
            document.body.classList.toggle("light-mode");
            
            // Save theme preference
            const isLightMode = document.body.classList.contains("light-mode");
            localStorage.setItem("lightMode", isLightMode);
            
            // Update particles colors if they exist
            if (window.updateParticlesTheme) {
                window.updateParticlesTheme(isLightMode);
            }
        });
    }
}

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn?.addEventListener("click", function () { elementToggleFunc(sidebar); });

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
    modalContainer?.classList.toggle("active");
    overlay?.classList.toggle("active");
}

// add click event to all modal items
testimonialsItem.forEach(item => {
    item.addEventListener("click", function () {
        modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
        modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
        modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
        modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

        testimonialsModalFunc();
    });
});

// add click event to modal close button
modalCloseBtn?.addEventListener("click", testimonialsModalFunc);
overlay?.addEventListener("click", testimonialsModalFunc);

// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.classList.add('scroll-progress');
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrolled / maxScroll;
    progressBar.style.transform = `scaleX(${progress})`;
});

// Animate skills when in view
const skillBars = document.querySelectorAll('.skill-progress-fill');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.setProperty('--progress', entry.target.dataset.progress);
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => skillObserver.observe(bar));

// Custom cursor
function initCustomCursor() {
    const cursor = document.createElement('div');
    const follower = document.createElement('div');
    const dots = [];
    
    // Create main cursors
    cursor.className = 'custom-cursor';
    follower.className = 'custom-cursor-follower';
    
    // Create trailing dots
    for (let i = 0; i < 5; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-dot';
        document.body.appendChild(dot);
        dots.push({ element: dot, x: 0, y: 0 });
    }
    
    document.body.appendChild(cursor);
    document.body.appendChild(follower);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Scale effect on interactive elements
        const target = e.target;
        if (target.matches('a, button, [role="button"], input, textarea')) {
            cursor.classList.add('cursor-hover');
            follower.classList.add('cursor-hover');
        } else {
            cursor.classList.remove('cursor-hover');
            follower.classList.remove('cursor-hover');
        }
    });
    
    function updateCursor() {
        // Smooth cursor movement
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        followerX += (mouseX - followerX) * 0.05;
        followerY += (mouseY - followerY) * 0.05;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
        
        // Update trailing dots
        dots.forEach((dot, index) => {
            dot.x += (mouseX - dot.x) * (0.05 / (index + 1));
            dot.y += (mouseY - dot.y) * (0.05 / (index + 1));
            dot.element.style.left = `${dot.x}px`;
            dot.element.style.top = `${dot.y}px`;
            dot.element.style.scale = 1 - (index * 0.15);
        });
        
        requestAnimationFrame(updateCursor);
    }
    
    updateCursor();
}

// Create particles background and shooting stars
function createParticlesBackground() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Create container for particles
    const container = document.createElement('div');
    container.id = 'particles-background';
    document.body.insertBefore(container, document.body.firstChild);
    container.appendChild(renderer.domElement);
    
    // Arrays for objects
    const shapes = [];
    const particles = [];
    const mouse = new THREE.Vector2();
    const mousePos3D = new THREE.Vector3();
    let mouseSpeed = new THREE.Vector2(0, 0);
    let lastMousePos = new THREE.Vector2(0, 0);
    
    // Create particles background
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    const posArray = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: document.body.classList.contains('light-mode') ? 0x0066ff : 0xffffff,
        transparent: true,
        opacity: document.body.classList.contains('light-mode') ? 0.6 : 0.4,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Create shapes with enhanced reactivity
    const geometries = [
        new THREE.TetrahedronGeometry(0.3),
        new THREE.BoxGeometry(0.3, 0.3, 0.3),
        new THREE.OctahedronGeometry(0.3),
        new THREE.DodecahedronGeometry(0.3),
        new THREE.TorusGeometry(0.2, 0.1, 16, 32)
    ];
    
    for (let i = 0; i < 30; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.6,
            wireframe: true,
            emissive: 0x444444,
            emissiveIntensity: 0.5
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
        );
        
        mesh.userData = {
            originalPos: mesh.position.clone(),
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05
            ),
            rotationSpeed: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            ),
            attracted: false,
            repelForce: new THREE.Vector3()
        };
        
        shapes.push(mesh);
        scene.add(mesh);
    }
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x444444);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    camera.position.z = 15;
    
    // Enhanced mouse interaction
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        mouseSpeed.x = mouse.x - lastMousePos.x;
        mouseSpeed.y = mouse.y - lastMousePos.y;
        
        lastMousePos.x = mouse.x;
        lastMousePos.y = mouse.y;
        
        mousePos3D.set(mouse.x * 10, mouse.y * 10, 0);
        
        // Dynamic shape interaction
        shapes.forEach(mesh => {
            const distanceToMouse = mesh.position.distanceTo(mousePos3D);
            const influence = 1 - Math.min(distanceToMouse / 5, 1);
            
            if (influence > 0) {
                mesh.userData.attracted = true;
                
                // Repulsion force
                mesh.userData.repelForce.copy(mesh.position)
                    .sub(mousePos3D)
                    .normalize()
                    .multiplyScalar(0.1 * influence);
                
                // Add mouse speed influence
                mesh.userData.repelForce.x += mouseSpeed.x * 2;
                mesh.userData.repelForce.y += mouseSpeed.y * 2;
                
                mesh.userData.velocity.add(mesh.userData.repelForce);
                
                // Visual effects
                mesh.material.emissiveIntensity = 0.5 + influence;
                mesh.material.opacity = 0.6 + influence * 0.4;
                mesh.scale.setScalar(1 + influence * 0.3);
            } else {
                mesh.userData.attracted = false;
                mesh.scale.setScalar(1);
            }
        });
    });
    
    function animate() {
        requestAnimationFrame(animate);
        
        // Animate particles
        particlesMesh.rotation.y += 0.001;
        
        // Enhanced shape animation
        shapes.forEach(mesh => {
            // Apply velocity with damping
            mesh.position.add(mesh.userData.velocity);
            mesh.userData.velocity.multiplyScalar(0.98);
            
            // Boundary check and bounce
            ['x', 'y', 'z'].forEach(axis => {
                if (Math.abs(mesh.position[axis]) > 10) {
                    mesh.position[axis] = Math.sign(mesh.position[axis]) * 10;
                    mesh.userData.velocity[axis] *= -0.8;
                }
            });
            
            // Dynamic rotation based on movement
            mesh.rotation.x += mesh.userData.rotationSpeed.x + mesh.userData.velocity.length() * 0.1;
            mesh.rotation.y += mesh.userData.rotationSpeed.y + mesh.userData.velocity.length() * 0.1;
            mesh.rotation.z += mesh.userData.rotationSpeed.z + mesh.userData.velocity.length() * 0.1;
            
            // Add some random movement
            mesh.userData.velocity.add(new THREE.Vector3(
                (Math.random() - 0.5) * 0.002,
                (Math.random() - 0.5) * 0.002,
                (Math.random() - 0.5) * 0.002
            ));
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.navbar-link');
    const pages = document.querySelectorAll('[data-page]');

    function showPage(pageId) {
        // Hide all pages
        pages.forEach(page => {
            page.style.display = 'none';
            page.classList.remove('active');
        });

        // Show selected page
        const targetPage = document.querySelector(`[data-page="${pageId}"]`);
        if (targetPage) {
            targetPage.style.display = 'block';
            targetPage.classList.add('active');
            
            // Update URL hash without scrolling
            history.pushState(null, '', `#${pageId}`);
        }

        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${pageId}`) {
                link.classList.add('active');
            }
        });
    }

    // Add click handlers to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('href').replace('#', '');
            showPage(pageId);
        });
    });

    // Handle initial page load and browser back/forward
    function handleInitialPage() {
        const initialPage = window.location.hash.replace('#', '') || 'about';
        showPage(initialPage);
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleInitialPage);
    
    // Show initial page
    handleInitialPage();

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open modals
            const openModal = document.querySelector('.modal-container.active');
            if (openModal) {
                testimonialsModalFunc();
            }
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    createParticlesBackground();
    initCustomCursor();
    initNavigation();
    
    // Easter eggs
    initMessiEasterEgg();
    initGojoEasterEgg();
    initNarutoEasterEgg();
    initSukunaEasterEgg();
    initTypingAnimations();
});

// Messi Easter Egg
function initMessiEasterEgg() {
    const goatSound = document.getElementById('goatSound');
    let messiClicks = 0;
    let lastClickTime = 0;
    
    function handleModalContent() {
        const messiName = document.querySelector('[data-modal-text] strong');
        
        if (messiName && messiName.textContent.includes('Lionel Messi')) {
            messiName.style.cursor = 'pointer';
            
            messiName.addEventListener('click', async function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                const currentTime = new Date().getTime();
                if (currentTime - lastClickTime > 2000) {
                    messiClicks = 0;
                }
                
                messiClicks++;
                lastClickTime = currentTime;
                
                if (messiClicks === 5) {
                    try {
                        goatSound.currentTime = 0;
                        await goatSound.play();
                    } catch (error) {
                        console.error('Goat sound error:', error);
                    }
                    messiClicks = 0;
                }
            });
        }
    }
    
    const modalContainer = document.querySelector('[data-modal-container]');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                setTimeout(handleModalContent, 100);
            }
        });
    });
    
    if (modalContainer) {
        observer.observe(modalContainer, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
}

// Gojo Easter Egg
function initGojoEasterEgg() {
    let gojoClicks = 0;
    let lastClickTime = 0;
    let isAnimating = false;
    
    function handleModalContent() {
        const gojoName = document.querySelector('[data-modal-text] strong');
        const gojoImage = document.querySelector('[data-modal-img]');
        
        if (gojoName && gojoName.textContent.includes('SATORU GOJO')) {
            gojoName.style.cursor = 'pointer';
            gojoName.setAttribute('title', 'Click 5 times quickly to see Domain Expansion ⚔️');
            
            gojoName.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                if (isAnimating) return;
                
                const currentTime = new Date().getTime();
                if (currentTime - lastClickTime > 2000) {
                    gojoClicks = 0;
                }
                
                gojoClicks++;
                lastClickTime = currentTime;
                
                if (gojoClicks === 5) {
                    isAnimating = true;
                    
                    // Create slice effect
                    const rect = gojoImage.getBoundingClientRect();
                    const topHalf = gojoImage.cloneNode();
                    const bottomHalf = gojoImage.cloneNode();
                    
                    const commonStyles = `
                        position: fixed;
                        width: ${rect.width}px;
                        height: ${rect.height/2}px;
                        left: ${rect.left}px;
                        transition: all 0.5s ease;
                        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
                        z-index: 9999;
                    `;
                    
                    topHalf.style.cssText = `
                        ${commonStyles}
                        top: ${rect.top}px;
                        object-position: top;
                        object-fit: cover;
                    `;
                    
                    bottomHalf.style.cssText = `
                        ${commonStyles}
                        top: ${rect.top + rect.height/2}px;
                        object-position: bottom;
                        object-fit: cover;
                    `;
                    
                    document.body.appendChild(topHalf);
                    document.body.appendChild(bottomHalf);
                    
                    gojoImage.style.opacity = '0';
                    
                    setTimeout(() => {
                        topHalf.style.transform = 'translateX(-100px) rotate(-5deg)';
                        bottomHalf.style.transform = 'translateX(100px) rotate(5deg)';
                        topHalf.style.opacity = '0';
                        bottomHalf.style.opacity = '0';
                    }, 50);
                    
                    setTimeout(() => {
                        document.body.removeChild(topHalf);
                        document.body.removeChild(bottomHalf);
                        gojoImage.style.opacity = '1';
                        isAnimating = false;
                        gojoClicks = 0;
                    }, 1000);
                }
            });
        }
    }
    
    const modalContainer = document.querySelector('[data-modal-container]');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                handleModalContent();
            }
        });
    });
    
    if (modalContainer) {
        observer.observe(modalContainer, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
}

// Naruto Easter Egg
function initNarutoEasterEgg() {
    const narutoSound = document.getElementById('narutoSound');
    let narutoClicks = 0;
    let lastClickTime = 0;
    
    function handleModalContent() {
        const narutoName = document.querySelector('[data-modal-text] strong');
        
        if (narutoName && narutoName.textContent.includes('NARUTO UZUMAKI')) {
            narutoName.style.cursor = 'pointer';
            
            narutoName.addEventListener('click', async function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                const currentTime = new Date().getTime();
                if (currentTime - lastClickTime > 2000) {
                    narutoClicks = 0;
                }
                
                narutoClicks++;
                lastClickTime = currentTime;
                
                if (narutoClicks === 5) {
                    try {
                        narutoSound.currentTime = 0;
                        await narutoSound.play();
                    } catch (error) {
                        console.error('Naruto sound error:', error);
                    }
                    narutoClicks = 0;
                }
            });
        }
    }
    
    const modalContainer = document.querySelector('[data-modal-container]');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                setTimeout(handleModalContent, 100);
            }
        });
    });
    
    if (modalContainer) {
        observer.observe(modalContainer, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
}

// Sukuna Easter Egg
function initSukunaEasterEgg() {
    let sukunaClicks = 0;
    let lastClickTime = 0;
    let isAnimating = false;
    
    function handleModalContent() {
        const sukunaName = document.querySelector('[data-modal-text] strong');
        
        if (sukunaName && sukunaName.textContent.includes('SUKUNA RYOMEN')) {
            sukunaName.style.cursor = 'pointer';
            sukunaName.setAttribute('title', 'Click 5 times quickly to see Domain Expansion 👿');
            
            sukunaName.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                if (isAnimating) return;
                
                const currentTime = new Date().getTime();
                if (currentTime - lastClickTime > 2000) {
                    sukunaClicks = 0;
                }
                
                sukunaClicks++;
                lastClickTime = currentTime;
                
                if (sukunaClicks === 5) {
                    isAnimating = true;
                    
                    // Add dark red background with Sukuna image
                    document.body.style.transition = 'all 0.5s ease';
                    document.body.style.backgroundColor = '#800000';
                    document.body.style.color = '#000000';
                    document.body.style.backgroundImage = 'url("./assets/images/sukuna.png")';
                    document.body.style.backgroundSize = 'cover';
                    document.body.style.backgroundPosition = 'center';
                    document.body.style.backgroundBlend = 'multiply';
                    
                    // Reset after 2 seconds
                    setTimeout(() => {
                        document.body.style.backgroundColor = '';
                        document.body.style.color = '';
                        document.body.style.backgroundImage = '';
                        document.body.style.backgroundSize = '';
                        document.body.style.backgroundPosition = '';
                        document.body.style.backgroundBlend = '';
                        isAnimating = false;
                        sukunaClicks = 0;
                    }, 2000);
                }
            });
        }
    }
    
    const modalContainer = document.querySelector('[data-modal-container]');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                setTimeout(handleModalContent, 100);
            }
        });
    });
    
    if (modalContainer) {
        observer.observe(modalContainer, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
}

// Add after DOMContentLoaded event
window.addEventListener('load', () => {
    // Remove any loading screens/spinners
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
});

function initTypingAnimations() {
    const typingElements = document.querySelectorAll('[data-typing]');
    
    const effects = {
        loop: (element, text, delay) => {
            const words = text.split('|');
            let wordIndex = 0;
            let charIndex = 0;
            
            const typeWord = () => {
                const currentWord = words[wordIndex];
                
                if (charIndex < currentWord.length) {
                    element.textContent += currentWord.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeWord, delay);
                } else {
                    // Word is fully typed, wait 10 seconds then start next word
                    setTimeout(() => {
                        charIndex = 0;
                        element.textContent = '';
                        wordIndex = (wordIndex + 1) % words.length;
                        typeWord();
                    }, 10000); // 10 seconds pause
                }
            };
            
            typeWord();
        },
        
        default: (element, text, delay) => {
            let charIndex = 0;
            element.textContent = '';
            
            const interval = setInterval(() => {
                if (charIndex < text.length) {
                    element.textContent += text.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(interval);
                }
            }, delay);
        }
    };
    
    typingElements.forEach(element => {
        const text = element.textContent;
        const delay = parseInt(element.dataset.typingDelay) || 100;
        const startDelay = parseInt(element.dataset.typingStart) || 0;
        const effect = element.dataset.typingEffect || 'default';
        
        // Clear initial text
        element.textContent = '';
        
        // Start animation after specified delay
        setTimeout(() => {
            if (effects[effect]) {
                effects[effect](element, text, delay);
            } else {
                effects.default(element, text, delay);
            }
        }, startDelay);
    });
}
