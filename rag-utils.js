const fs = require('fs');

// Parse JSON database
function parseJSON(fileContent) {
    return JSON.parse(fileContent);
}

// Mock database search function
function searchDatabase(prompt) {
    return "futuristic architecture, AI-driven city plans";  // Placeholder context
}

module.exports = { parseJSON, searchDatabase };
