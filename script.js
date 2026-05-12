// 1. grab the button from the HTML
const themeToggleBtn = document.querySelector(".theme-toggle");

// 2. Check if the user already chose dark mode in the past (Local Storage)
const savedTheme= localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

// 3. Listen for clicks on the button
themeToggleBtn.addEventListener("click", () => {
    // this magically add 'dark-theme' if its missing or remove it if its already there
    document.body.classList.toggle("dark-theme");

    // update the icon and save the preference
    const isDarkMode = document.body.classList.contains("dark-theme");

    if (isDarkMode) {
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        localStorage.setItem("theme", "dark"); // save preference
    } else {
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem("theme", "light"); // save preference
    }
});
