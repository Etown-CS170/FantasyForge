const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { parseJSON, searchDatabase } = require('./rag-utils');

// Server port
const port = 3000;

// Utility function for parsing multipart/form-data (for file uploads)
function parseMultipartFormData(req, callback) {
    const boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');
    let body = Buffer.alloc(0);

    req.on('data', (chunk) => {
        body = Buffer.concat([body, chunk]);
    });

    req.on('end', () => {
        const parts = body.toString().split(`--${boundary}`).slice(1, -1);
        const fileData = parts.find(part => part.includes('Content-Type')).split('\r\n\r\n')[1].trim();
        callback(fileData);
    });
}

// Create HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Serve static HTML file for the frontend
    if (req.method === 'GET' && parsedUrl.pathname === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    // Handle database upload
    else if (req.method === 'POST' && parsedUrl.pathname === '/upload-database') {
        parseMultipartFormData(req, (fileData) => {
            try {
                const data = parseJSON(fileData);  // Only parses JSON data for simplicity
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Database uploaded successfully');
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Error parsing database');
            }
        });
    }

    // Handle image generation request
    else if (req.method === 'POST' && parsedUrl.pathname === '/generate-image') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const { prompt } = JSON.parse(body);
            const relevantData = searchDatabase(prompt);
            const responseMessage = `Generated image for prompt: "${prompt}" with context: ${relevantData}`;
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: responseMessage, image_url: 'placeholder_image_url.png' }));
        });
    }

    // 404 response for unsupported routes
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
