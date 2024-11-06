let slideIndex = 0;
function showSlides() {
    let slides = document.getElementsByClassName("mySlides");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { 
        slideIndex = 1; 
    }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 3500);
}
showSlides();

document.querySelectorAll('a').forEach(link => {
link.addEventListener('click', function(e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    
    document.body.classList.add('hidden');

    setTimeout(() => {
        window.location.href = href;
    }, 800);
});
});
