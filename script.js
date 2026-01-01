document.addEventListener("DOMContentLoaded", () => {
    
    /* ================= PLAN A: SYSTEM PRELOADER ================= */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Wait 2.5 seconds, then fade out
        setTimeout(() => {
            preloader.style.opacity = '0';
            // Remove from DOM so it doesn't block clicks
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 2200);
    }

    /* ================= PLAN B: CUSTOM CURSOR ================= */
    const cursor = document.getElementById('custom-cursor');
    
    // Only activate on desktop (if user has a fine pointer)
    if (window.matchMedia("(pointer: fine)").matches && cursor) {
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Add 'hovering' class when over links/buttons
        const hoverTargets = document.querySelectorAll('.hover-trigger, a, button, .menu-toggle');
        
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            target.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    /* ================= NEURAL CANVAS ================= */
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const particleCount = 40; 
        const connectionDistance = 150;
        const mouseDistance = 200;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        const mouse = { x: null, y: null };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x; mouse.y = e.y;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width; this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5; this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.fillStyle = 'rgba(45, 212, 191, 0.5)';
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
            }
        }
        for (let i = 0; i < particleCount; i++) particles.push(new Particle());

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach((p, index) => {
                p.update(); p.draw();
                for (let j = index; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(45, 212, 191, ${1 - dist / connectionDistance})`;
                        ctx.lineWidth = 0.5; ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                    }
                }
                if (mouse.x != null) {
                    const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                    if (dist < mouseDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(45, 212, 191, ${1 - dist / mouseDistance})`;
                        ctx.lineWidth = 0.5; ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    /* ================= UI LOGIC ================= */
    // Typing Engine
    const textElement = document.querySelector(".typing-text");
    const words = ["Logic", "Clarity", "Intelligence"]; 
    if (textElement) {
        let wordIndex = 0, charIndex = 0, isDeleting = false, lastTime = 0, delay = 200;
        function typeLoop(currentTime) {
            if (!lastTime) lastTime = currentTime;
            const deltaTime = currentTime - lastTime;
            if (deltaTime > delay) {
                const currentWord = words[wordIndex];
                if (isDeleting) {
                    textElement.textContent = currentWord.substring(0, charIndex - 1);
                    charIndex--; delay = 50;
                } else {
                    textElement.textContent = currentWord.substring(0, charIndex + 1);
                    charIndex++; delay = 150;
                }
                if (!isDeleting && charIndex === currentWord.length) {
                    isDeleting = true; delay = 2000;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false; wordIndex = (wordIndex + 1) % words.length; delay = 500;
                }
                lastTime = currentTime;
            }
            requestAnimationFrame(typeLoop);
        }
        requestAnimationFrame(typeLoop);
    }

    // Mobile Menu
    const menuToggle = document.getElementById('mobile-menu');
    const mobileDropdown = document.getElementById('mobile-dropdown');
    
    // Body Scroll Lock Helper
    const toggleScrollLock = (isLocked) => {
        document.body.style.overflow = isLocked ? 'hidden' : '';
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileDropdown.classList.toggle('active');
            const isActive = mobileDropdown.classList.contains('active');
            toggleScrollLock(isActive);
        });
    }

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle) menuToggle.classList.remove('active');
            if (mobileDropdown) mobileDropdown.classList.remove('active');
            toggleScrollLock(false);
        });
    });

    // Scroll Progress
    window.addEventListener('scroll', () => {
        const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (scrollTotal > 0) {
            const scrollCurrent = document.documentElement.scrollTop;
            const scrollPercentage = (scrollCurrent / scrollTotal) * 100;
            const progressBar = document.querySelector('.scroll-progress');
            if (progressBar) progressBar.style.width = scrollPercentage + "%";
        }
    });

    // Tilt
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2; const centerY = rect.height / 2;
            const rotateX = (centerY - y) / 20; const rotateY = (x - centerX) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
        });
    });

    // Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
        });
    }, { threshold: 0.1 });
    document.querySelectorAll(".scroll-trigger, .anim-hidden").forEach(el => observer.observe(el));
    
    // Buttons
    const smoothScroll = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({behavior:"smooth"});
    };
    document.getElementById("viewProjectsBtn")?.addEventListener("click", () => smoothScroll("projects"));
    document.getElementById("contactBtn")?.addEventListener("click", () => smoothScroll("contactSection"));
    document.getElementById("navContactBtn")?.addEventListener("click", () => smoothScroll("contactSection"));
    document.getElementById("finalContactBtn")?.addEventListener("click", () => {
        window.open("mailto:sharma05deep@gmail.com", "_self");
    });
});
