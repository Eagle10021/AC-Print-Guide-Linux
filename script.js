
// Toast Notification
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:20px; color:var(--success)">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Animate out
    setTimeout(() => {
        toast.classList.add('toast-out');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
}

// Update Progress Bar
function updateProgress() {
    const total = document.querySelectorAll('.step-item').length;
    const completed = document.querySelectorAll('.step-item.completed').length;
    const progress = total === 0 ? 0 : (completed / total) * 100;

    const bar = document.getElementById('progressBar');
    if (bar) bar.style.width = `${progress}% `;
}

// Sound Effect (Web Audio API)
function playSuccessSound() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    // Helper to create a soft tone
    const playTone = (freq) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Soft envelope: Gentle attack, smooth decay
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.55);
    };

    // Play a nice C Major interval (C5 & E5) for a happy chime
    playTone(523.25); // C5
    setTimeout(() => playTone(659.25), 50); // E5 (staggered slightly for 'strum' feel)
}

// Particle Effect
function createParticles(x, y) {
    const particleCount = 12;
    const colors = ['#60a5fa', '#34d399', '#fbfb8c'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random placement variance
        const destX = (Math.random() - 0.5) * 100;
        const destY = (Math.random() - 0.5) * 100;
        const rot = Math.random() * 360;
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.backgroundColor = color;
        particle.style.left = `${x} px`;
        particle.style.top = `${y} px`;
        particle.style.setProperty('--dest-x', `${destX} px`);
        particle.style.setProperty('--dest-y', `${destY} px`);
        particle.style.setProperty('--rot', `${rot} deg`);

        document.body.appendChild(particle);
        particle.addEventListener('animationend', () => particle.remove());
    }
}


// --- Main Initialization ---

document.addEventListener('DOMContentLoaded', () => {

    // 1. Theme Manager
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');

            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            sunIcon.style.display = isLight ? 'none' : 'block';
            moonIcon.style.display = isLight ? 'block' : 'none';
        });
    }

    // 2. Initialize Progress
    updateProgress();

    // 3. Code Blocks & Toast Integration
    const codeBlocks = document.querySelectorAll('.code-block');
    codeBlocks.forEach(block => {
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        block.parentNode.insertBefore(wrapper, block);
        wrapper.appendChild(block);

        // Create copy button
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.textContent = 'Copy';
        wrapper.appendChild(btn);

        // Click handler
        btn.addEventListener('click', async () => {
            try {
                const text = block.textContent.trim();
                await navigator.clipboard.writeText(text);

                // Toast Feedback
                showToast('Code copied to clipboard!');

                // Button feedback
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy!', err);
                btn.textContent = 'Error';
            }
        });
    });

    // 4. Intersection Observer for Icons & TOC
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -50% 0px',
        threshold: 0
    };

    const tocList = document.querySelector('#toc');
    const tocUl = document.createElement('ul');
    if (tocList) tocList.appendChild(tocUl);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                document.querySelectorAll('#toc a').forEach(a => a.classList.remove('active'));
                const id = entry.target.id;
                const link = document.querySelector(`#toc a[href = "#${id}"]`);
                if (link) link.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    const stepItems = document.querySelectorAll('.step-item');
    stepItems.forEach(item => {
        observer.observe(item);

        // Generate TOC Link
        const h2 = item.querySelector('h2');
        if (h2 && item.id) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${item.id} `;
            a.textContent = h2.textContent.replace('Optional', '').trim();

            a.addEventListener('click', (e) => {
                e.preventDefault();
                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                history.pushState(null, null, `#${item.id} `);
            });

            li.appendChild(a);
            tocUl.appendChild(li);
        }

        // Click to Complete (Sound + Particles + Progress)
        const icon = item.querySelector('.step-icon');
        if (icon) {
            icon.style.cursor = 'pointer';
            icon.addEventListener('click', (e) => {
                // Prevent quick double-toggles
                if (!item.classList.contains('animating')) {
                    item.classList.toggle('completed');
                    updateProgress(); // Update bar

                    if (item.classList.contains('completed')) {
                        playSuccessSound();
                        createParticles(e.clientX, e.clientY);
                        showToast('Step completed!');
                    }
                }
            });
        }
    });

    // 5. Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});


// --- Global Event Listeners ---

// Overscroll Effect (Pull-to-refresh style)
let overshoot = 0;

document.addEventListener('wheel', (e) => {
    // Only trigger if at the very top
    if (window.scrollY === 0) {
        // Pulling down (deltaY negative)
        if (e.deltaY < 0) {
            overshoot -= e.deltaY * 0.5; // Resistance
            overshoot = Math.min(overshoot, 150); // Cap
            if (overshoot > 0) {
                const wrapper = document.querySelector('.layout-wrapper');
                if (wrapper) wrapper.style.transform = `translateY(${overshoot}px)`;
            }
        }
        // Releasing up (deltaY positive) while overshot
        else if (overshoot > 0 && e.deltaY > 0) {
            overshoot -= e.deltaY;
            if (overshoot < 0) overshoot = 0;
            const wrapper = document.querySelector('.layout-wrapper');
            if (wrapper) wrapper.style.transform = `translateY(${overshoot}px)`;
        }
    }
}, { passive: true });

// Decay/Snapback loop
setInterval(() => {
    if (overshoot > 0) {
        overshoot *= 0.9; // Decay factor
        if (overshoot < 1) overshoot = 0;
        const wrapper = document.querySelector('.layout-wrapper');
        if (wrapper) wrapper.style.transform = `translateY(${overshoot}px)`;
    }
}, 16);
