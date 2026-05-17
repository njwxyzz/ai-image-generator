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

    // We grab all the selects. [0] is the model, [1] is the count, [2] is aspect ratio!
    const selects = document.querySelectorAll(".custom-select");
    const selectedModel = selects[0].value;
    const imageCount = parseInt(selects[1].value);
    const aspectRatio = selects[2].value; // <--- TAMBAH NI UNTUK AMBIK SAIZ GAMBAR

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


    // =========================================
    // THE FETCH FUNCTION (Talking to the AI)
    // =========================================
    const generateImages = async (selectedModel, imageCount, aspectRatio, promptText) => {
        // 1. Grab all the loading cards we just created
        const loadingCards = document.querySelectorAll(".img-card.loading");

        // 2. loop through each card and send a request to our backend for each one
        for (let i = 0; i < imageCount; i++) {
            const currentCard = loadingCards[i];

            try {
                // Send the prompt and model info to our backend API route
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        model: selectedModel, 
                        promptText: promptText 
                    })
                });

                if (!response.ok) throw new Error("Gagal generate gambar");

                // Hugging Face will send back the generated image as binary data, so we need to convert it to a format we can use in the frontend
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);

                // Update the current card to show the generated image instead of the loading state
                currentCard.classList.remove("loading");
                currentCard.querySelector(".result-img").src = imageUrl;

            } catch (error) {
                console.error(error);
                // if fail, remove the loading spinner and show an error message on the card
                currentCard.classList.remove("loading");
                currentCard.classList.add("error");
            }
        }
    };

    generateImages(selectedModel, imageCount, aspectRatio, promptText);
});