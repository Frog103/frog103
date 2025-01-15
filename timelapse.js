async function loadRandomReel() {
    try {
        // Fetch the JSON file
        const response = await fetch('timelapses.json');
        const data = await response.json();

        // Store the reels and initialize index
        const reels = data.reels;
        let currentReelIndex = 0;

        // Get the reel container
        const reelContainer = document.getElementById('random-reel');

        // Function to display a reel
        function displayReel(index) {
            const reel = reels[index];
            const nextReel = reels[(index + 1) % reels.length];
            // Preload next video if media_url is defined
            if (nextReel && nextReel.media_url) {
                const preloadVideo = document.createElement('video');
                preloadVideo.src = nextReel.media_url;
            }

            const posterAttr = reel.thumbnail_url ? `poster="${reel.thumbnail_url}"` : '';
            reelContainer.innerHTML = `<video id="reel-video" autoplay muted loop width="100%" ${posterAttr} style="pointer-events: none;"><source src="${reel.media_url}" type="video/mp4">Your browser does not support the video tag.</video><p>${reel.caption}</p>`;
            setTimeout(() => {
                currentReelIndex = (currentReelIndex + 1) % reels.length;
                displayReel(currentReelIndex);
            }, 34000); // Adjust the duration here, 30000 = 30 seconds
        }

        // Start with the first reel
        displayReel(currentReelIndex);
    } catch (error) {
        console.error('Error loading reels:', error);
        const reelContainer = document.getElementById('random-reel');
        reelContainer.innerHTML = '<p>Error loading reel.</p>';
    }
}

// Fetch and display recent blog posts
async function loadRecentPosts() {
    try {
        const response = await fetch('posts.json');
        const data = await response.json();
        const posts = data.posts.slice(0, 5); // The 5 most recent posts

        const postList = document.getElementById('recent-post-list');
        postList.innerHTML = '';
        posts.forEach(post => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
            <a href="post.html?id=${post.id}">
                ${post.title}
                <div class="post-date">${new Date(post.date).toLocaleDateString()}</div>
            </a>`;
            postList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error loading recent posts:', error);
        document.getElementById('recent-post-list').innerHTML = '<li style="color: white; text-align: center;">Error loading posts.</li>';
    }
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadRecentPosts();
    loadRandomReel();
});