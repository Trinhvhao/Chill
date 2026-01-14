/**
 * 3D Login Interface - Interactive Script
 * Handles 3D parallax effect and form interactions
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        // 3D rotation sensitivity
        rotationIntensity: 15, // degrees
        // Smooth transition speed
        transitionSpeed: 0.1,
        // Return to neutral speed
        returnSpeed: 0.05
    };

    // ============================================
    // STATE
    // ============================================
    let currentRotation = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };
    let isHovering = false;

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const loginCard = document.getElementById('loginCard');
    const loginForm = document.getElementById('loginForm');

    // ============================================
    // 3D PARALLAX EFFECT
    // ============================================
    
    /**
     * Handle mouse move for 3D parallax
     */
    function handleMouseMove(e) {
        if (!isHovering) return;

        const rect = loginCard.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate mouse position relative to card center
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        // Convert to rotation angles (inverted for natural feel)
        targetRotation.y = (mouseX / rect.width) * CONFIG.rotationIntensity;
        targetRotation.x = -(mouseY / rect.height) * CONFIG.rotationIntensity;
    }

    /**
     * Handle mouse enter
     */
    function handleMouseEnter() {
        isHovering = true;
    }

    /**
     * Handle mouse leave - return to neutral
     */
    function handleMouseLeave() {
        isHovering = false;
        targetRotation.x = 0;
        targetRotation.y = 0;
    }

    /**
     * Smooth animation loop for 3D rotation
     */
    function animate() {
        // Lerp current rotation toward target
        const speed = isHovering ? CONFIG.transitionSpeed : CONFIG.returnSpeed;
        
        currentRotation.x += (targetRotation.x - currentRotation.x) * speed;
        currentRotation.y += (targetRotation.y - currentRotation.y) * speed;

        // Apply 3D transform
        loginCard.style.transform = `
            rotateX(${currentRotation.x}deg) 
            rotateY(${currentRotation.y}deg)
        `;

        requestAnimationFrame(animate);
    }

    // ============================================
    // FORM HANDLING
    // ============================================
    
    /**
     * Handle form submission
     */
    function handleSubmit(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        // Add loading state
        const submitBtn = e.target.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;

        btnText.textContent = 'Signing in...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        // Simulate API call
        setTimeout(() => {
            console.log('Login attempt:', { email, remember });
            
            // Success animation
            btnText.textContent = '✓ Success!';
            submitBtn.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';

            // Reset after delay
            setTimeout(() => {
                btnText.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.background = '';
                
                // In production, redirect to dashboard
                // window.location.href = '/dashboard';
            }, 1500);
        }, 1500);
    }

    /**
     * Add ripple effect to button click
     */
    function createRipple(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
        `;

        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    // Add ripple animation to CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // INPUT ENHANCEMENTS
    // ============================================
    
    /**
     * Add focus/blur animations to inputs
     */
    function enhanceInputs() {
        const inputs = document.querySelectorAll('.input-field');
        
        inputs.forEach(input => {
            // Add focus animation
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateZ(10px)';
            });

            // Remove focus animation
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateZ(0)';
            });
        });
    }

    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================
    
    /**
     * Handle keyboard shortcuts
     */
    function handleKeyboard(e) {
        // Enter key on inputs submits form
        if (e.key === 'Enter' && e.target.classList.contains('input-field')) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        // Start animation loop
        animate();

        // Add event listeners
        loginCard.addEventListener('mousemove', handleMouseMove);
        loginCard.addEventListener('mouseenter', handleMouseEnter);
        loginCard.addEventListener('mouseleave', handleMouseLeave);
        loginForm.addEventListener('submit', handleSubmit);
        document.addEventListener('keydown', handleKeyboard);

        // Enhance inputs
        enhanceInputs();

        // Add ripple to button
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.addEventListener('click', createRipple);

        // Entrance animation
        setTimeout(() => {
            loginCard.style.opacity = '1';
            loginCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
        }, 100);

        console.log('3D Login Interface initialized');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
