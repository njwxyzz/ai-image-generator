// =========================================
// DARK THEME MAGIC
// =========================================

// 1. Grab the button from the HTML
const themeToggleBtn = document.querySelector(".theme-toggle");

// 2. Check if the user already chose dark mode in the past (Local Storage)
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    // Swap the moon icon to a sun
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

// 3. Listen for clicks on the button
themeToggleBtn.addEventListener("click", () => {
    // This magically adds 'dark-theme' if it's missing, or removes it if it's there
    document.body.classList.toggle("dark-theme");

    // Check if the body currently has the dark theme
    const isDarkMode = document.body.classList.contains("dark-theme");

    // Update the icon and save the preference
    if (isDarkMode) {
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        localStorage.setItem("theme", "dark"); // Save preference
    } else {
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem("theme", "light"); // Save preference
    }
});


// =========================================
// IMAGE GENERATION LOGIC
// =========================================

// 1. Grab the form and the gallery from our HTML
const promptForm = document.querySelector(".prompt-form");
const galleryGrid = document.querySelector(".gallery-grid");

// Replace this string with your actual Hugging Face token (Keep it secret!)
const HF_API_KEY = "";

// 2. Listen for the form submission
promptForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Stop the page from reloading when we submit

    // Grab exactly what the user typed and selected
    const promptText = document.querySelector(".prompt-input").value;

    // We grab all the selects. [0] is the model, [1] is the count.
    const selects = document.querySelectorAll(".custom-select");
    const selectedModel = selects[0].value;
    const imageCount = parseInt(selects[1].value);

    // Clear out the dummy images currently sitting in the HTML gallery
    galleryGrid.innerHTML = "";

    // Loop to create the exact number of loading cards the user asks for
    for (let i = 0; i < imageCount; i++) {
        // Create a brand new div for our card
        const card = document.createElement("div");

        // Give it the 'loading' class so it looks like a loading card
        card.className = "img-card loading";

        // Inject the HTML structure for the card (Using backticks! ` )
        card.innerHTML = `
            <div class="status-container">
                <div class="spinner"></div>
                <i class="fa-solid fa-exclamation-triangle"></i>
                <p class="status-text">Generating image...</p>
            </div>
            <img src="" class="result-img" />
            <div class="img-overlay">
                <button class="img-download-btn"><i class="fa-solid fa-download"></i></button>
            </div>
        `;

        // Shove the new card into the grid
        galleryGrid.appendChild(card);
    }

    // Temporary console log to prove it's grabbing the right data
    console.log(`Ready to send: "${promptText}" to the ${selectedModel} model. Generating ${imageCount} images!`);

    // NOTE: The actual API call will go right here next!
});