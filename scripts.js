let slideIndex = 0;
let galleryImages = [];

// Fetch and initialize gallery images
async function initializeSlideshow() {
    try {
        const response = await fetch('otherArtGallery.json');
        const data = await response.json();
        console.log('Received data:', data);

        // showcase check
        galleryImages = data.items
            .filter(item => {
                console.log('Item showcase value:', item.showcase);
                return item.showcase === true || item.showcase === 'true';
            })
            .map(item => item.image);
        
        console.log('Filtered images:', galleryImages);

        if (!galleryImages || galleryImages.length === 0) {
            throw new Error('No showcase images available');
        }
        const slidesContainer = document.querySelector('.splash-container');
        const errorElement = document.getElementById('slideshow-error');
        
        if (slidesContainer) {
            slidesContainer.innerHTML = '';
            
            // Preload images and create slides
            const slides = Array(5).fill().map((_, i) => {
                const imageSrc = getRandomImage();
                return createSlide(imageSrc, i);
            });
            
            slides.forEach(slide => slidesContainer.appendChild(slide));
            showSlides();
            
            if (errorElement) errorElement.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading gallery images:', error);
        const errorElement = document.getElementById('slideshow-error');
        if (errorElement) {
            errorElement.style.display = 'block';
            errorElement.textContent = 'Unable to load slideshow images. Please try refreshing the page.';
        }
    }
}

function createSlide(imageSrc, index) {
    const slideDiv = document.createElement('div');
    slideDiv.className = 'mySlides fade';
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = `Splash Image ${index + 1}`;
    img.draggable = false;

    // Add error handling for image load failures
    img.onerror = function() {
        const errorElement = document.getElementById('slideshow-error');
        if (errorElement) {
            errorElement.style.display = 'block';
            errorElement.textContent = 'Some images failed to load. Please try refreshing the page.';
        }
        img.src = 'images/splashing3.JPG'; // Add a fallback image
    };

    // Add load event listener to handle image sizing
    img.onload = function() {
        const container = slideDiv.parentElement;
        if (!container) return;

        // Clear error message if image loads successfully
        const errorElement = document.getElementById('slideshow-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const imageRatio = img.naturalWidth / img.naturalHeight;
        const containerRatio = containerWidth / containerHeight;

        // Calculate dimensions to maintain aspect ratio
        let width, height;
        if (imageRatio > containerRatio) {
            width = Math.min(containerWidth, img.naturalWidth);
            height = width / imageRatio;
        } else {
            height = Math.min(containerHeight, img.naturalHeight);
            width = height * imageRatio;
        }

        // Apply calculated dimensions
        img.style.width = `${width}px`;
        img.style.height = `${height}px`;
        slideDiv.style.opacity = '1';
    };
    
    slideDiv.appendChild(img);
    return slideDiv;
}

function getRandomImage() {
    return galleryImages[Math.floor(Math.random() * galleryImages.length)];
}

function showSlides() {
    const slides = document.getElementsByClassName("mySlides");
    if (!slides.length) return;

    // Clear error message at the start of each slide transition
    const errorElement = document.getElementById('slideshow-error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }

    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    // Increment index
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }

    // Show current slide
    slides[slideIndex - 1].style.display = "block";

    // Update image for next slide (for smooth transitions)
    const nextIndex = slideIndex % slides.length;
    const nextSlide = slides[nextIndex];
    if (nextSlide) {
        const img = nextSlide.querySelector('img');
        if (img) {
            img.src = getRandomImage();
        }
    }

    // Set next slide timeout
    setTimeout(showSlides, 10000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSlideshow);

