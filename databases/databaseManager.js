const nflPlayers = require('./nflPlayers');
const movies = require('./movies');
const genres = require('./genres');

class DatabaseManager {
    constructor() {
        this.databases = {
            nflPlayers,
            movies,
            genres
        };
    }

    getCategories() {
        return Object.keys(this.databases);
    }

    getSubcategories(category) {
        return Object.keys(this.databases[category] || {});
    }

    search(query, category = null) {
        const results = [];
        const searchTerm = query.toLowerCase();

        const searchDatabase = (db, category) => {
            if (Array.isArray(db)) {
                db.forEach(item => {
                    if (item.name?.toLowerCase().includes(searchTerm) || 
                        item.description?.toLowerCase().includes(searchTerm) ||
                        item.title?.toLowerCase().includes(searchTerm)) {
                        results.push({
                            ...item,
                            category,
                            type: 'item'
                        });
                    }
                });
            } else {
                Object.entries(db).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        searchDatabase(value, key);
                    }
                });
            }
        };

        if (category) {
            searchDatabase(this.databases[category], category);
        } else {
            Object.entries(this.databases).forEach(([key, value]) => {
                searchDatabase(value, key);
            });
        }

        return results;
    }

    getStyleSettings(category, subCategory) {
        if (this.databases.genres[category]) {
            return this.databases.genres[category];
        }
        return this.databases.genres.movie; // default to movie style
    }

    async searchMovie(title) {
        try {
            const movie = await this.databases.movies.searchMovie(title);
            return movie;
        } catch (error) {
            console.error('Error getting movie:', error);
            throw error;
        }
    }
}

module.exports = new DatabaseManager(); 