// Page Initialization
function initializePage() {
    setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
    // Image right-click prevention
    document.addEventListener('contextmenu', (event) => {
        if (event.target.tagName === 'IMG') {
            event.preventDefault();
        }
    });

    // Basic page fade
    document.body.style.opacity = '0';
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
}

// Initialize on DOM Content Loaded
document.addEventListener('DOMContentLoaded', initializePage);

// Utility Functions
function checkLinkExists(url) {
    return fetch(url, { method: 'HEAD' })
        .then(response => response.ok)
        .catch(() => false);
}
