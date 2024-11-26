# FantasyForge

## Project Overview
FantasyForge is a web application that generates custom images based on NFL player data and user prompts. The application scrapes real-time NFL player information and uses Hugging Face's Stable Diffusion XL API to create unique images. It combines sports data with AI image generation to create a fantasy football logo.

## Features
- Real-time NFL player data scraping from ESPN
- Custom image generation using Hugging Face's Stable Diffusion XL
- Web-based user interface for prompt input
- Position-based player categorization
- Detailed player descriptions including jersey numbers and teams

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- Hugging Face API key

### Copy Code from github

### Installation Steps
Required packages:
- express
- Hugging Face API key
- axios
- cheerio
- dotenv
- fs (built-in)
- path (built-in)

### Start server
- node server.js

## AI Tools Used

### Hugging Face Stable Diffusion XL
- Purpose: Image generation based on text prompts
- Usage: Generates custom images based on NFL player data and desired user input

### Web Scraping
- Tool: Cheerio
- Purpose: Automated data collection from ESPN's NFL player database
- Implementation: Scrapes player information including:
  - Player names
  - Jersey numbers
  - Player positions
  - Team names