document.addEventListener('DOMContentLoaded', () => {
    // Select all code blocks
    const codeBlocks = document.querySelectorAll('.code-block');

    codeBlocks.forEach(block => {
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';

        // Insert wrapper before block and move block inside
        block.parentNode.insertBefore(wrapper, block);
        wrapper.appendChild(block);

        // Create copy button
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.textContent = 'Copy';

        // Add button to wrapper
        wrapper.appendChild(btn);

        // Click handler
        btn.addEventListener('click', async () => {
            try {
                const text = block.textContent.trim(); // Get text without extra whitespace
                await navigator.clipboard.writeText(text);

                // Success state
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

    // Intersection Observer for scroll highlighting
    // Intersection Observer for scroll highlighting (Icons & TOC)
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -50% 0px', // Adjusted for better TOC activation
        threshold: 0
    };

    const tocList = document.querySelector('#toc');
    const tocUl = document.createElement('ul');
    if (tocList) tocList.appendChild(tocUl);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Highlight Icon
                entry.target.classList.add('active');

                // Highlight TOC
                document.querySelectorAll('#toc a').forEach(a => a.classList.remove('active'));
                const id = entry.target.id;
                const link = document.querySelector(`#toc a[href="#${id}"]`);
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
            a.href = `#${item.id}`;
            a.textContent = h2.textContent.replace('Optional', '').trim(); // Clean header text

            // Center on click
            a.addEventListener('click', (e) => {
                e.preventDefault();
                item.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Manually update URL if desired, but prevents jump
                history.pushState(null, null, `#${item.id}`);
            });

            li.appendChild(a);
            tocUl.appendChild(li);
        }

        // Click to Complete
        const icon = item.querySelector('.step-icon');
        if (icon) {
            icon.style.cursor = 'pointer';
            icon.addEventListener('click', (e) => {
                // Prevent quick double-toggles
                if (!item.classList.contains('animating')) {
                    item.classList.toggle('completed');

                    if (item.classList.contains('completed')) {
                        playSuccessSound();
                        createParticles(e.clientX, e.clientY);
                    }
                }
            });
        }
    });

    // Back to Top Button
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
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

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
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty('--dest-x', `${destX}px`);
        particle.style.setProperty('--dest-y', `${destY}px`);
        particle.style.setProperty('--rot', `${rot}deg`);

        document.body.appendChild(particle);

        // Cleanup
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }
}
