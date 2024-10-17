const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.use(express.static('public')); // Serve static files from the 'public' folder
app.use(express.json());

app.post('/generate-image', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await fetch('https://api.example.com/v1/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_API_KEY`
            },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        res.json({ image_url: data.image_url });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating image');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
