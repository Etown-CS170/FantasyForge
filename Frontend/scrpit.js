document.getElementById("imageForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const prompt = document.getElementById("prompt").value;
    const API_URL = "http://localhost:3000/generate-image"
    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: prompt })
    })
    .then(response => response.json())
    .then(data => {
        const imageContainer = document.getElementById("imageContainer");
        imageContainer.innerHTML = `<p>${data.message}</p><img src="${data.image_url}" alt="Generated Image">`;
    })
    .catch(error => {
        console.error("Error:", error);
    });
});
