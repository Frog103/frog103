document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.getElementById("darkmode-toggle");

    // Set initial theme based on localStorage or system preference
    let darkModeEnabled = localStorage.getItem("darkMode") === "enabled";
    if(darkModeEnabled) {
        document.body.classList.add("dark-mode");
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "enabled");
    }
    
    toggleButton.addEventListener("click", function() {
        if(document.body.classList.contains("dark-mode")) {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "disabled");
        } else {
            document.body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
        }
    });
});
