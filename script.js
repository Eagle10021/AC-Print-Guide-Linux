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
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the item is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    const stepItems = document.querySelectorAll('.step-item');
    stepItems.forEach(item => {
        observer.observe(item);
    });
});
