document.addEventListener("DOMContentLoaded", function() {
    const darkmodeToggle = document.getElementById("darkmode-toggle");
    if (!darkmodeToggle) return;
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "enabled") {
        document.body.classList.add("dark-mode");
        darkmodeToggle.checked = true;
    }
    darkmodeToggle.addEventListener("change", function() {
        if (this.checked) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "disabled");
        }
    });
});