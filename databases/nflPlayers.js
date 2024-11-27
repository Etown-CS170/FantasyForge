const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
// All Cursor AI generated to search ESPN everytime an NFL players name is user prompted so that the code stays up to date and gets accurate teams, position, jersey numbers, and player looks every year
class NFLPlayersDatabase {
    constructor() {
        this.players = {
            lastUpdated: null,
            roster: {}
        };
        this.dataPath = __dirname + '/nflPlayersData.json';
    }

    async scrapeNFLPlayers() {
        try {
            // ESPN NFL Players page - you can adjust the source as needed
            const response = await axios.get('https://www.espn.com/nfl/players');
            const $ = cheerio.load(response.data);
            const players = {};

            // First get all team URLs
            const teamUrls = [];
            $('a[href*="/nfl/team/roster/"]').each((_, element) => {
                const url = $(element).attr('href');
                if (url && !teamUrls.includes(url)) {
                    teamUrls.push(url);
                }
            });

            // Process each team
            for (const teamUrl of teamUrls) {
                const teamResponse = await axios.get(`https://www.espn.com${teamUrl}`);
                const team$ = cheerio.load(teamResponse.data);
                const teamName = team$('.TeamHeader__Team__Name').text();

                // Process each player in the team
                team$('tr.Table__TR').each((_, element) => {
                    const player = {
                        name: team$(element).find('td:nth-child(2)').text().trim(),
                        number: team$(element).find('td:nth-child(1)').text().trim(),
                        position: team$(element).find('td:nth-child(3)').text().trim(),
                        team: teamName,
                        description: '',
                        style: "realistic sports photography"
                    };

                    if (player.name && player.position) {
                        // Group by position
                        const positionKey = this.normalizePosition(player.position);
                        if (!players[positionKey]) {
                            players[positionKey] = [];
                        }

                        // Add description
                        player.description = `${player.position} for ${player.team}, wearing #${player.number}`;
                        players[positionKey].push(player);
                    }
                });

                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            return players;
        } catch (error) {
            console.error('Error scraping NFL players:', error);
            throw error;
        }
    }

    normalizePosition(position) {
        // Map position abbreviations to full names in plural form
        const positionMap = {
            'QB': 'quarterbacks',
            'WR': 'receivers',
            'RB': 'runningbacks',
            'TE': 'tightends',
            'OL': 'offensivelinemen',
            'DL': 'defensivelinemen',
            'LB': 'linebackers',
            'DB': 'defensivebacks',
            'K': 'kickers',
            'P': 'punters'
            // Add more mappings as needed
        };

        return positionMap[position] || position.toLowerCase() + 's';
    }

    async updatePlayers() {
        try {
            this.players.roster = await this.scrapeNFLPlayers();
            this.players.lastUpdated = new Date().toISOString();
            await this.saveToFile();
            return this.players;
        } catch (error) {
            console.error('Error updating NFL players:', error);
            throw error;
        }
    }

    async loadFromFile() {
        try {
            if (fs.existsSync(this.dataPath)) {
                const data = await fs.promises.readFile(this.dataPath, 'utf8');
                this.players = JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading players data:', error);
        }
    }

    async saveToFile() {
        try {
            await fs.promises.writeFile(
                this.dataPath,
                JSON.stringify(this.players, null, 2)
            );
        } catch (error) {
            console.error('Error saving players data:', error);
        }
    }

    async initialize() {
        await this.loadFromFile();
        
        // Update if data is older than 24 hours or doesn't exist
        const needsUpdate = !this.players.lastUpdated || 
            (new Date() - new Date(this.players.lastUpdated)) > 24 * 60 * 60 * 1000;
        
        if (needsUpdate) {
            await this.updatePlayers();
        }

        // Schedule daily updates
        setInterval(() => this.updatePlayers(), 24 * 60 * 60 * 1000);
        
        return this.players;
    }
}

// Create and initialize the database
const nflPlayers = new NFLPlayersDatabase();

// Export both the database instance and the data
module.exports = {
    nflPlayers,
    getData: async () => {
        const instance = await nflPlayers.initialize();
        return instance.roster;
    }
}; 