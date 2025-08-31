// --- Paxeer Network Global JavaScript ---

document.addEventListener('DOMContentLoaded', () => {

    // --- Loading Animation ---
    setTimeout(() => {
        initLoadingAnimation();
    }, 100);

    // --- Feather Icons Initialization ---
    feather.replace();

    // --- Custom Cursor Logic ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const hoverElements = document.querySelectorAll('[data-hover]');

    if (!('ontouchstart' in window)) {
        window.addEventListener('mousemove', (e) => {
            gsap.set(cursorDot, { left: e.clientX, top: e.clientY });
            gsap.to(cursorOutline, { left: e.clientX, top: e.clientY, duration: 0.3, ease: 'power2.out' });
        });
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
        });
    } else {
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    // --- Mobile Navigation Toggle ---
    const header = document.querySelector('header');
    if (header) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.setAttribute('aria-label', 'Toggle navigation');
        menuBtn.innerHTML = '&#9776;'; // hamburger icon
        header.insertBefore(menuBtn, header.querySelector('.header-button'));
        menuBtn.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
        });
        // Close menu on nav link click
        header.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                document.body.classList.remove('nav-open');
            });
        });
    }

    // --- GSAP Scroll-Triggered Animations ---
    gsap.registerPlugin(ScrollTrigger);

    // General fade-in animation
    gsap.utils.toArray('.anim-fade-in').forEach(el => {
        gsap.from(el, {
            opacity: 0, y: 50, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        });
    });

    // Staggered animation for groups
    gsap.utils.toArray('.anim-stagger-group').forEach(group => {
        const elements = group.children;
        gsap.from(elements, {
            scrollTrigger: { trigger: group, start: "top 80%" },
            opacity: 0, y: 50, duration: 0.8, stagger: 0.2
        });
    });

    // --- Showcase Section Animations (Reusable for multiple pages) ---
    gsap.utils.toArray('.showcase').forEach(showcaseSection => {
        const scrollItems = showcaseSection.querySelectorAll('.scroll-item');
        const glassCube = showcaseSection.querySelector('.glass-cube');

        if (scrollItems.length > 0) {
            scrollItems.forEach((item) => {
                ScrollTrigger.create({
                    trigger: item,
                    start: 'top center',
                    end: 'bottom center',
                    onToggle: self => self.isActive ? item.classList.add('is-active') : item.classList.remove('is-active'),
                });
            });
        }
        
        if (glassCube) {
            gsap.to(glassCube, {
                scrollTrigger: {
                    trigger: showcaseSection,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                },
                rotateX: 20,
                rotateY: 360,
                ease: 'none',
            });
        }
    });

});

// --- Loading Animation Function ---
function initLoadingAnimation() {
    const overlay = document.getElementById('loadingOverlay');
    const blocksContainer = document.getElementById('blocksContainer');
    const paxeerReveal = document.getElementById('paxeerReveal');
    const body = document.body;
    
    // Fallback to show content if anything goes wrong
    const fallbackTimer = setTimeout(() => {
        if (overlay) overlay.style.display = 'none';
        body.classList.remove('loading');
        body.classList.add('loaded');
    }, 5000);
    
    // Check if elements exist
    if (!overlay || !blocksContainer || !paxeerReveal) {
        console.error('Loading animation elements not found');
        clearTimeout(fallbackTimer);
        body.classList.remove('loading');
        body.classList.add('loaded');
        return;
    }
    
    // Generate 3D blocks in a grid pattern
    const gridSize = 8;
    const blockSize = 120;
    const spacing = 20;
    const totalWidth = gridSize * (blockSize + spacing) - spacing;
    const totalHeight = gridSize * (blockSize + spacing) - spacing;
    
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const block = document.createElement('div');
            block.className = 'block';
            
            // Position blocks in grid
            const x = (j * (blockSize + spacing)) - (totalWidth / 2) + (blockSize / 2);
            const y = (i * (blockSize + spacing)) - (totalHeight / 2) + (blockSize / 2);
            
            block.style.left = `calc(50% + ${x}px)`;
            block.style.top = `calc(50% + ${y}px)`;
            block.style.transform = 'translate(-50%, -50%)';
            
            // Set random explosion direction for each block
            const dx = (Math.random() - 0.5) * 2000;
            const dy = (Math.random() - 0.5) * 2000;
            const dz = (Math.random() - 0.5) * 1000;
            const rx = Math.random() * 720;
            const ry = Math.random() * 720;
            const rz = Math.random() * 720;
            
            block.style.setProperty('--dx', `${dx}px`);
            block.style.setProperty('--dy', `${dy}px`);
            block.style.setProperty('--dz', `${dz}px`);
            block.style.setProperty('--rx', `${rx}deg`);
            block.style.setProperty('--ry', `${ry}deg`);
            block.style.setProperty('--rz', `${rz}deg`);
            
            blocksContainer.appendChild(block);
        }
    }
    
    // Start animation sequence after a brief delay
    setTimeout(() => {
        // Explode blocks with staggered timing
        const blocks = blocksContainer.querySelectorAll('.block');
        blocks.forEach((block, index) => {
            setTimeout(() => {
                block.classList.add('explode');
            }, index * 15); // 15ms stagger between each block
        });
        
        // Show Paxeer text after blocks start exploding
        setTimeout(() => {
            paxeerReveal.classList.add('show');
        }, 500);
        
        // Fade to hero section after text reveal
        setTimeout(() => {
            clearTimeout(fallbackTimer);
            overlay.classList.add('fade-out');
            body.classList.remove('loading');
            body.classList.add('loaded');
            
            // Remove overlay after animation
            setTimeout(() => {
                if (overlay && overlay.parentNode) {
                    overlay.remove();
                }
            }, 1500);
        }, 3000);
        
    }, 500); // Reduced initial delay from 1000ms to 500ms
}

