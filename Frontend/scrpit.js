document.getElementById("imageForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const prompt = document.getElementById("prompt").value;
    const imageContainer = document.getElementById("imageContainer");

    // Clear previous image
    imageContainer.innerHTML = "Generating...";

    try {
        // Replace with actual API request (assuming you're using an API for AI image generation)
        const response = await fetch('https://api.example.com/v1/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY'
            },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();

        // Display the generated image
        const img = document.createElement('img');
        img.src = data.image_url;
        imageContainer.innerHTML = ""; // Clear the 'Generating...' text
        imageContainer.appendChild(img);

    } catch (error) {
        imageContainer.innerHTML = "Error generating image. Please try again.";
        console.error(error);
    }
});
