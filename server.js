require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch'); 
const path = require('path');
const cors = require('cors');
const dbManager = require('./databases/databaseManager');

const app = express();
const port = 3000;
const apiKey = process.env.HF_API_KEY;
//Cursor AI generated error log
if (!apiKey) {
    console.error('ERROR: HF_API_KEY is not set in .env file');
    process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

//Cursor AI generated error log
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});

// Serve static files from Frontend directory
app.use(express.static(path.join(__dirname, 'Frontend')));

// Root route -  Cursor AI generated
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'Frontend', 'index.html');
    console.log('Serving index.html from:', indexPath);
    res.sendFile(indexPath);
});

// Catch-all route to redirect back to index.html - Cursor AI generated
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Add model loading status check - Cursor AI generated with human additions
async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.blob();
    return result;
}

// Add status check endpoint - Cursor AI generated with human additions
app.get('/api/status', async (req, res) => {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                headers: { Authorization: `Bearer ${apiKey}` },
                method: "GET"
            }
        );
        const result = await response.json();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to check model status" });
    }
});

// Get all categories - Cursor AI generated
app.get('/api/categories', (req, res) => {
    res.json(dbManager.getCategories());
});

// Get subcategories for a category - Cursor AI generated
app.get('/api/categories/:category', (req, res) => {
    const subcategories = dbManager.getSubcategories(req.params.category);
    res.json(subcategories);
});

// Search endpoint - Cursor AI generated
app.get('/api/search', (req, res) => {
    const { q, category } = req.query;
    const results = dbManager.search(q, category);
    res.json(results);
});

// Update the image generation endpoint - Cursor AI generated with little human additions
app.post('/generate-image', async (req, res) => {
    const { prompt, category, subCategory } = req.body;
    
    try {
        const styleSettings = dbManager.getStyleSettings(category, subCategory);
        const fullPrompt = prompt + styleSettings.suffix;

        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.HF_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: fullPrompt,
                    parameters: {
                        num_inference_steps: styleSettings.settings.steps,
                        guidance_scale: styleSettings.settings.guidance_scale,
                        negative_prompt: styleSettings.settings.negative_prompt
                    }
                })
            }
        );

        console.log("API Response status:", response.status);
        console.log("API Response headers:", response.headers);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const buffer = await response.buffer();
        console.log("Received buffer size:", buffer.length);

        const base64Image = buffer.toString('base64');
        console.log("Base64 string length:", base64Image.length);

        console.log("Image generated successfully");
        res.json({ 
            success: true,
            message: 'Image generated successfully',
            image_data: `data:image/jpeg;base64,${base64Image}`
        });

    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

app.listen(port, () => {
    const frontendPath = path.join(__dirname, 'Frontend');
    console.log('Server running at http://localhost:' + port);
    console.log('Frontend directory path:', frontendPath);
    console.log('Frontend directory exists:', require('fs').existsSync(frontendPath));
    if (require('fs').existsSync(frontendPath)) {
        console.log('Contents of Frontend directory:', require('fs').readdirSync(frontendPath));
    }
});
