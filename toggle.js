document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("darkmode-toggle");

    // Initialize based on stored preference or system default
    let preferredScheme = localStorage.getItem("preferredColorScheme");
    if (!preferredScheme) {
        preferredScheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "default";
    }
    if(preferredScheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.removeAttribute("data-theme");
    }

    toggleButton.addEventListener("click", () => {
        if(document.documentElement.getAttribute("data-theme") === "dark") {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("preferredColorScheme", "default");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("preferredColorScheme", "dark");
        }
    });
});

