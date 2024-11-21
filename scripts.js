
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed.");
    const links = document.querySelectorAll('a');
    console.log(`Number of links found: ${links.length}`);
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            console.log(`Link clicked: ${this.href}`);
            event.preventDefault();
            const target = this.href;
            document.body.classList.add('hidden');
            console.log("Fade-out class 'hidden' added.");
            setTimeout(() => {
                console.log("Redirecting to:", target);
                window.location.href = target;
            }, 500);
        });
    });
});
