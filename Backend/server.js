require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch'); 
const path = require('path');
const fs = require('fs');
const { parseJSON, searchDatabase } = require('./rag-utils'); // Assuming you have helper functions in rag-utils.js

const app = express();
const port = 3000;
const apiKey = process.env.HF_API_Key; 

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Endpoint for generating images
app.post('/generate-image', async (req, res) => {
    const { prompt } = req.body;
    const relevantData = searchDatabase(prompt);
    const augmentedPrompt = `${prompt} with context: ${relevantData}`;

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                prompt: augmentedPrompt,
                n: 1, // Number of images to generate, if supported
                size: "1024x1024" // Specify size if supported by API
            })
        });

        if (!response.ok) throw new Error(`API call failed: ${response.statusText}`);
        
        const data = await response.json();
        const imageUrl = data.generated_images[0]; // Adjust this path based on API response

        // Send the generated image URL to the frontend
        res.status(200).json({ message: `Generated image for prompt: "${augmentedPrompt}"`, image_url: imageUrl });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ message: 'Error generating image' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
