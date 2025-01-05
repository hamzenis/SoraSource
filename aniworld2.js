class AniWorld {
    constructor() {
        this.baseUrl = 'https://aniworld.to';
        this.searchUrl = 'https://aniworld.to/animes-alphabet';
    }
    
    async getSearchResults(search) {
        const response = await axios.get(`${this.searchUrl}`);
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, 'text/html');
        const results = [];
        const elements = doc.querySelectorAll('div.genre ul li a');
        elements.forEach(element => {
            const title = element.textContent.trim();
            const link = element.getAttribute('href');
            if (!search || title.toLowerCase().includes(search.toLowerCase())) {
                results.push({ title: title, link: `${this.baseUrl}${link}` });
            }
        });
        return results;
    }
}

// Initialize AniWorld instance
window.aniWorld = new AniWorld();