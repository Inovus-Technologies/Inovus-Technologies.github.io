/* ================= SYSTEM INITIALIZATION ================= */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. HERO ANIMATION TRIGGER
    // We add the 'visible' class to hero elements shortly after load
    const heroElements = document.querySelectorAll(".anim-hidden");
    heroElements.forEach(el => {
        el.classList.add("visible");
    });

    // 2. SCROLL OBSERVER (The "Magic" Part)
    // This watches elements as you scroll down
    const observerOptions = {
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, observerOptions);

    // Find all sections that need to animate
    const scrollElements = document.querySelectorAll(".scroll-trigger");
    scrollElements.forEach(el => scrollObserver.observe(el));

    // 3. BUTTON LOGIC (Retained & Polished)
    
    // View Projects
    const viewProjectsBtn = document.getElementById("viewProjectsBtn");
    if (viewProjectsBtn) {
        viewProjectsBtn.addEventListener("click", () => {
            document.getElementById("projects").scrollIntoView({ behavior: "smooth" });
        });
    }

    // Top Contact
    const contactBtn = document.getElementById("contactBtn");
    if (contactBtn) {
        contactBtn.addEventListener("click", () => {
            document.getElementById("contactSection").scrollIntoView({ behavior: "smooth" });
        });
    }

    // Email Button
    const finalContactBtn = document.getElementById("finalContactBtn");
    if (finalContactBtn) {
        finalContactBtn.addEventListener("click", () => {
            window.location.href = "mailto:sharma05deep@gmail.com";
        });
    }
});
