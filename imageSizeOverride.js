function forceMobileImageSize() {
    // Detect specific mobile devices
    const mobileDevices = /(iPhone|iPod|Android)/i;
    if (mobileDevices.test(navigator.userAgent)) {
        // Force images in the media gallery to 336px by 136px
        const mediaImages = document.querySelectorAll('.media-gallery img');
        mediaImages.forEach(img => {
            img.style.width = '336px';
            img.style.height = '136px';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    forceMobileImageSize();
});
