/* ============================================
   Animated Card Opening - Travel Gallery
   Script JavaScript
   ============================================ */

// ============================================
// 1. Slide Data Array
// ============================================
const slidesData = [
    {
        id: 1,
        place: 'KYOTO, JAPAN',
        title1: 'Ancient Temples',
        title2: 'of Serenity',
        description: 'Discover thousands of torii gates at Fushimi Inari and the golden pavilions that Paint the mountain slopes in ethereal light.',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=80'
    },
    {
        id: 2,
        place: 'ICELAND',
        title1: 'Northern Lights',
        title2: 'Dancing Skies',
        description: 'Witness the magical aurora borealis painting the Arctic sky in emerald waves. A cosmic symphony of light and wonder.',
        image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80'
    },
    {
        id: 3,
        place: 'MALDIVES',
        title1: 'Crystal Waters',
        title2: 'Paradise Found',
        description: 'Float above coral reefs in the world\'s most pristine waters. Luxury meets untouched nature in this tropical Eden.',
image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1920&q=80'
    },
    {
        id: 4,
        place: 'SWISS ALPS',
        title1: 'Majestic Peaks',
        title2: 'Crown of Europe',
        description: 'Towering granite spires and pristine snow fields await. Ski the legendary slopes of Zermatt beneath the Matterhorn.',
        image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80'
    },
    {
        id: 5,
        place: 'MARRakeCH, MOROCCO',
        title1: 'Spice Markets',
        title2: 'of the Medina',
        description: 'Lose yourself in ancient souks filled with exotic spices, handcrafted lanterns, and the magnetic pull of North African mystery.',
        image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e93?w=1920&q=80'
    },
    {
        id: 5,
        place: 'SANTORINI, GREECE',
        title1: 'White & Blue',
        title2: 'Aegean Dreams',
        description: 'Watch the world\'s most famous sunset from clifftop villages. Whitewashed walls meet the endless blue sea.',
        image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1920&q=80'
    },
    {
        id: 6,
        place: 'AFRICA',
        title1: 'Wild Safari',
        title2: 'Soul of the Savanna',
        description: 'Witness the Great Migration in the Serengeti. Where nature\'s raw drama unfolds across endless plains.',
        image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80'
    }
];

// Fallback image for errors
const fallbackImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80';

// SVG gradient data URI as last resort fallback
const svgGradientDataURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxYTFhMmUiLz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjdiNTlmIiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=';

// ============================================
// 2. State Variables
// ============================================
let currentIndex = 0;
let isAnimating = false;
let autoPlayInterval = null;
const AUTO_PLAY_DELAY = 5000; // 5 seconds

// DOM Elements references
const activeCard = {
    image: document.getElementById('activeImage'),
    place: document.getElementById('activePlace'),
    title1: document.getElementById('activeTitle1'),
    title2: document.getElementById('activeTitle2'),
    desc: document.getElementById('activeDesc'),
    button: document.getElementById('activeButton')
};

const thumbnailStrip = document.getElementById('thumbnailStrip');
const progressBar = document.getElementById('progressBar');
const currentSlideEl = document.getElementById('currentSlide');
const totalSlidesEl = document.getElementById('totalSlides');
const navPrev = document.getElementById('navPrev');
const navNext = document.getElementById('navNext');

// ============================================
// 3. Utility Functions
// ============================================

// Image preload with fallback handling
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => resolve(url);
        img.onerror = () => resolve(fallbackImage);
        
        img.src = url;
    });
}

// Generate unique ID for thumbnails
function generateThumbId(index) {
    return `thumb-${index}`;
}

// ============================================
// 4. Render Functions
// ============================================

// Render all thumbnails from slides data
function renderThumbnails() {
    thumbnailStrip.innerHTML = '';
    
    slidesData.forEach((slide, index) => {
        const thumbCard = document.createElement('div');
        thumbCard.className = `thumbnail-card ${index === currentIndex ? 'active' : ''}`;
        thumbCard.id = generateThumbId(index);
        thumbCard.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = slide.image;
        img.alt = slide.title1;
        img.loading = 'lazy';
        
        // Add error handler for thumbnail images
        img.onerror = () => {
            img.src = fallbackImage;
            img.onerror = () => {
                img.src = svgGradientDataURI;
            };
        };
        
        thumbCard.appendChild(img);
        
        // Click to go to specific slide
        thumbCard.addEventListener('click', () => {
            if (!isAnimating && index !== currentIndex) {
                goToSlide(index);
            }
        });
        
        thumbnailStrip.appendChild(thumbCard);
    });
}

// Update active card content
function updateActiveCard(data) {
    activeCard.place.textContent = data.place;
    activeCard.title1.textContent = data.title1;
    activeCard.title2.textContent = data.title2;
    activeCard.desc.textContent = data.description;
    
    // Update image with preload
    preloadImage(data.image).then(src => {
        activeCard.image.src = src;
    });
}

// Update slide counter
function updateSlideCounter() {
    currentSlideEl.textContent = currentIndex + 1;
    totalSlidesEl.textContent = slidesData.length;
}

// Update progress bar
function updateProgressBar() {
    const progress = ((currentIndex + 1) / slidesData.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// ============================================
// 5. Animation Functions (GSAP)
// ============================================

// Initial entrance animation
function initEntranceAnimation() {
    const tl = gsap.timeline({ defaults: { ease: 'sine.inOut' } });
    
    // Animate thumbnail strip in
    tl.to(thumbnailStrip, {
        x: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.5
    })
    .to('.nav-arrow', {
        opacity: 1,
        duration: 0.5
    }, '-=0.3')
    .to('.slide-counter', {
        opacity: 1,
        duration: 0.5
    }, '-=0.3');
    
    // Animate active card content entrance
    tl.to(activeCard.place, {
        opacity: 1,
        y: 0,
        duration: 0.6
    }, '-=0.4')
    .to(activeCard.title1, {
        opacity: 1,
        y: 0,
        duration: 0.6
    }, '-=0.4')
    .to(activeCard.title2, {
        opacity: 1,
        y: 0,
        duration: 0.6
    }, '-=0.3')
    .to(activeCard.desc, {
        opacity: 1,
        y: 0,
        duration: 0.6
    }, '-=0.3')
    .to(activeCard.button, {
        opacity: 1,
        y: 0,
        duration: 0.5
    }, '-=0.2');
    
    return tl;
}

// Animate content elements out (in sequence: place -> title1 -> title2 -> desc -> button)
function animateContentOut() {
    const tl = gsap.timeline({ defaults: { ease: 'sine.inOut' } });
    
    // Fade out in reverse order
    tl.to(activeCard.button, {
        opacity: 0,
        y: -20,
        duration: 0.3
    })
    .to(activeCard.desc, {
        opacity: 0,
        y: -20,
        duration: 0.3
    }, '-=0.2')
    .to(activeCard.title2, {
        opacity: 0,
        y: -20,
        duration: 0.3
    }, '-=0.2')
    .to(activeCard.title1, {
        opacity: 0,
        y: -20,
        duration: 0.3
    }, '-=0.2')
    .to(activeCard.place, {
        opacity: 0,
        y: -20,
        duration: 0.3
    }, '-=0.2');
    
    return tl;
}

// Animate content elements in (in sequence: place -> title1 -> title2 -> desc -> button)
function animateContentIn() {
    const tl = gsap.timeline({ defaults: { ease: 'sine.inOut' } });
    
    // Fade in in order
    tl.to(activeCard.place, {
        opacity: 1,
        y: 0,
        duration: 0.4
    })
    .to(activeCard.title1, {
        opacity: 1,
        y: 0,
        duration: 0.4
    }, '-=0.25')
    .to(activeCard.title2, {
        opacity: 1,
        y: 0,
        duration: 0.4
    }, '-=0.25')
    .to(activeCard.desc, {
        opacity: 1,
        y: 0,
        duration: 0.4
    }, '-=0.25')
    .to(activeCard.button, {
        opacity: 1,
        y: 0,
        duration: 0.4
    }, '-=0.2');
    
    return tl;
}

// Thumbnail animation (old active shrinks and moves to end, new one becomes active)
function animateThumbnails(fromIndex, toIndex) {
    const tl = gsap.timeline({ defaults: { ease: 'sine.inOut' } });
    
    const fromThumb = document.getElementById(generateThumbId(fromIndex));
    const toThumb = document.getElementById(generateThumbId(toIndex));
    
    if (fromThumb && toThumb) {
        // Remove active class from old
        fromThumb.classList.remove('active');
        
        // Animate old thumbnail shrinking and moving
        tl.to(fromThumb, {
            scale: 0.8,
            opacity: 0.5,
            duration: 0.5
        })
        .to(fromThumb, {
            scale: 1,
            opacity: 0.7,
            duration: 0.5
        }, '-=0.2');
        
        // Set new active
        tl.add(() => {
            toThumb.classList.add('active');
        }, '-=0.5');
    }
    
    return tl;
}

// ============================================
// 6. Navigation Functions
// ============================================

// Go to specific slide
function goToSlide(index, isAutoPlay = false) {
    if (isAnimating || index === currentIndex) return;
    
    isAnimating = true;
    
    const fromIndex = currentIndex;
    const toData = slidesData[index];
    
    // Stop auto-play during manual navigation
    if (!isAutoPlay) {
        stopAutoPlay();
    }
    
    // Step 1: Animate content out
    animateContentOut();
    
    // Step 2: Animate thumbnails (after content fades)
    setTimeout(() => {
        animateThumbnails(fromIndex, index);
        
        // Step 3: Update content
        updateActiveCard(toData);
        
        // Step 4: Animate content in
        setTimeout(() => {
            animateContentIn();
        }, 300);
        
    }, 300);
    
    // Step 5: Update state after animation
    setTimeout(() => {
        currentIndex = index;
        updateSlideCounter();
        updateProgressBar();
        isAnimating = false;
        
        // Restart auto-play after manual navigation
        if (!isAutoPlay) {
            startAutoPlay();
        }
    }, 900);
}

// Next slide
function nextSlide() {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= slidesData.length) {
        nextIndex = 0;
    }
    goToSlide(nextIndex);
}

// Previous slide
function prevSlide() {
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
        prevIndex = slidesData.length - 1;
    }
    goToSlide(prevIndex);
}

// ============================================
// 7. Auto-Play Functions
// ============================================

// Start auto-play
function startAutoPlay() {
    stopAutoPlay(); // Clear any existing
    
    autoPlayInterval = setInterval(() => {
        nextSlide();
    }, AUTO_PLAY_DELAY);
}

// Stop auto-play
function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// ============================================
// 8. Event Listeners
// ============================================

// Navigation button clicks
navPrev.addEventListener('click', prevSlide);
navNext.addEventListener('click', nextSlide);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

// Pause on hover/touch
document.querySelector('.app-container').addEventListener('mouseenter', () => {
    stopAutoPlay();
});

document.querySelector('.app-container').addEventListener('mouseleave', () => {
    startAutoPlay();
});

// ============================================
// 9. Initialization
// ============================================

// Initialize the app
function init() {
    // Set initial data
    const initialData = slidesData[currentIndex];
    updateActiveCard(initialData);
    
    // Render thumbnails
    renderThumbnails();
    
    // Update counters and progress
    updateSlideCounter();
    updateProgressBar();
    
    // Start entrance animation
    initEntranceAnimation();
    
    // Start auto-play
    startAutoPlay();
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Fallback in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
