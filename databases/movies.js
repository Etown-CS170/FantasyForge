const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

class MovieDatabase {
    constructor() {
        this.movies = {
            lastUpdated: null,
            categories: {}
        };
        this.dataPath = __dirname + '/moviesData.json';
    }

    async scrapeMovie(searchTerm) {
        try {
            // Search for movie on IMDB
            const searchResponse = await axios.get(`https://www.imdb.com/find?q=${encodeURIComponent(searchTerm)}&s=tt&ttype=ft`);
            const search$ = cheerio.load(searchResponse.data);
            
            // Get first movie result URL
            const movieUrl = search$('.findResult').first().find('a').attr('href');
            if (!movieUrl) throw new Error('Movie not found');

            // Fetch movie details
            const movieResponse = await axios.get(`https://www.imdb.com${movieUrl}`);
            const movie$ = cheerio.load(movieResponse.data);

            // Extract movie information
            const movie = {
                title: movie$('h1[data-testid="hero-title-block__title"]').text().trim(),
                year: movie$('span[data-testid="hero-title-block__year"]').text().trim(),
                genre: movie$('span[data-testid="genres"]').text().trim().split(', '),
                description: movie$('span[data-testid="plot-xl"]').text().trim(),
                director: movie$('a[data-testid="director"]').text().trim(),
                rating: movie$('span[data-testid="hero-rating-bar__aggregate-rating__score"]').text().trim(),
                style: this.determineStyle(movie$('span[data-testid="genres"]').text().trim()),
                visualDescription: this.generateVisualDescription(
                    movie$('span[data-testid="plot-xl"]').text().trim(),
                    movie$('span[data-testid="genres"]').text().trim()
                ),
                lastUpdated: new Date().toISOString()
            };

            return movie;
        } catch (error) {
            console.error('Error scraping movie:', error);
            throw error;
        }
    }

    determineStyle(genres) {
        const genreMap = {
            'Science Fiction': 'cinematic sci-fi',
            'Sci-Fi': 'cinematic sci-fi',
            'Fantasy': 'fantasy art',
            'Horror': 'dark horror',
            'Action': 'action movie',
            'Drama': 'dramatic cinema',
            'Comedy': 'bright cinema',
            'Animation': 'animated film',
            'Western': 'western film',
            'Film-Noir': 'noir cinema',
            'Documentary': 'documentary style'
        };

        for (const [key, value] of Object.entries(genreMap)) {
            if (genres.includes(key)) return value;
        }
        return 'cinematic photography';
    }

    generateVisualDescription(plot, genres) {
        let description = plot;
        
        // Add visual style based on genre
        if (genres.includes('Science Fiction')) {
            description += ', futuristic setting, advanced technology';
        } else if (genres.includes('Fantasy')) {
            description += ', magical atmosphere, mythical elements';
        } else if (genres.includes('Horror')) {
            description += ', dark atmosphere, moody lighting';
        }
        
        return description;
    }

    async updateMovie(searchTerm) {
        try {
            const movie = await this.scrapeMovie(searchTerm);
            
            // Categorize movie by primary genre
            const primaryGenre = movie.genre[0].toLowerCase();
            if (!this.movies.categories[primaryGenre]) {
                this.movies.categories[primaryGenre] = [];
            }
            
            // Update or add movie
            const existingIndex = this.movies.categories[primaryGenre]
                .findIndex(m => m.title === movie.title);
            
            if (existingIndex >= 0) {
                this.movies.categories[primaryGenre][existingIndex] = movie;
            } else {
                this.movies.categories[primaryGenre].push(movie);
            }
            
            this.movies.lastUpdated = new Date().toISOString();
            await this.saveToFile();
            return movie;
        } catch (error) {
            console.error('Error updating movie:', error);
            throw error;
        }
    }

    async loadFromFile() {
        try {
            if (fs.existsSync(this.dataPath)) {
                const data = await fs.promises.readFile(this.dataPath, 'utf8');
                this.movies = JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading movies data:', error);
        }
    }

    async saveToFile() {
        try {
            await fs.promises.writeFile(
                this.dataPath,
                JSON.stringify(this.movies, null, 2)
            );
        } catch (error) {
            console.error('Error saving movies data:', error);
        }
    }

    async initialize() {
        await this.loadFromFile();
        return this.movies;
    }

    async searchMovie(title) {
        // Search through existing categories
        for (const category of Object.values(this.movies.categories)) {
            const movie = category.find(m => 
                m.title.toLowerCase().includes(title.toLowerCase())
            );
            if (movie) return movie;
        }

        // If not found, scrape and add to database
        return await this.updateMovie(title);
    }
}

// Create and initialize the database
const movieDatabase = new MovieDatabase();

// Export both the database instance and search function
module.exports = {
    movieDatabase,
    searchMovie: async (title) => {
        await movieDatabase.initialize();
        return movieDatabase.searchMovie(title);
    }
}; 