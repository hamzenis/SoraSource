class AniWorld {
    constructor() {
        this.baseUrl = 'https://aniworld.to';
        this.searchUrl = 'https://aniworld.to/animes-alphabet';
    }
    
    async getSearchResults(search) {
        const response = await axios.get(this.searchUrl);
        const $ = cheerio.load(response.data);
        const results = [];
        $('div.genre ul li a').each((_, element) => {
            const title = $(element).text().trim();
            const link = $(element).attr('href');
            if (!search || title.toLowerCase().includes(search.toLowerCase())) {
                results.push({ title: title, link: `${this.baseUrl}${link}` });
            }
        });
        return results;
    }
}

// Initialize AniWorld instance
window.aniWorld = new AniWorld();
