let currentCategory = null;

async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        
        const categorySelect = document.getElementById('categorySelect');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function searchDatabase() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    const category = currentCategory;

    if (!query) return;

    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}${category ? `&category=${category}` : ''}`);
        const results = await response.json();
        displayResults(results);
    } catch (error) {
        console.error('Search error:', error);
    }
}

function displayResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = results.map(result => `
        <div class="result-item" onclick="useResult('${encodeURIComponent(JSON.stringify(result))}')">
            <h3>${result.name || result.title}</h3>
            <p>${result.description}</p>
            <span class="category">${result.category}</span>
        </div>
    `).join('');
}

function useResult(resultJson) {
    const result = JSON.parse(decodeURIComponent(resultJson));
    document.getElementById('promptInput').value = result.description;
    currentCategory = result.category;
}

async function generateImage() {
    const promptInput = document.getElementById('promptInput');
    const loadingElement = document.getElementById('loading');
    const imageContainer = document.getElementById('imageContainer');

    if (!promptInput.value.trim()) {
        alert('Please enter a prompt');
        return;
    }

    try {
        loadingElement.style.display = 'block';
        imageContainer.innerHTML = '';

        console.log('Sending request with prompt:', promptInput.value);

        const response = await fetch('/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: promptInput.value })
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Failed to generate image');
        }

        // Create and display the image
        const img = document.createElement('img');
        img.onload = () => console.log('Image loaded successfully');
        img.onerror = (e) => console.error('Error loading image:', e);
        img.src = data.image_data;
        img.alt = promptInput.value;
        imageContainer.appendChild(img);

    } catch (error) {
        console.error('Error in generateImage:', error);
        alert('Error generating image: ' + error.message);
    } finally {
        loadingElement.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
});

// Add genre selection handler
document.getElementById('imageGenre').addEventListener('change', function(e) {
    const selectedGenre = e.target.value;
    const genreSettings = genres[selectedGenre];
    // Update your image generation settings accordingly
}); 
