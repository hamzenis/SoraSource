class AniWorld {
    constructor() {
        this.baseUrl = 'https://aniworld.to';
        this.searchUrl = 'https://aniworld.to/animes-alphabet';
        this.corsProxy = 'https://cors-proxy.fringe.zone/';
    }

    async getSearchResults(search) {
        try {
            console.log(`Fetching URL: ${this.corsProxy}${this.searchUrl}`);
            const response = await fetch(`${this.corsProxy}${this.searchUrl}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
                }
            });
            console.log(`Response status: ${response.status}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const results = [];
            const elements = doc.querySelectorAll('div.genre ul li a');
            elements.forEach(element => {
                const title = element.textContent.trim();
                const link = element.getAttribute('href');
                if (!search || title.toLowerCase().includes(search.toLowerCase())) {
                    results.push({ title: title, link: `${this.baseUrl}${link}` });
                }
            });
            console.log(`Results: ${JSON.stringify(results)}`);
            return JSON.stringify(results);
        } catch (error) {
            console.error('Fetch error:', error);
            return JSON.stringify([{ title: 'Error', link: '' }]);
        }
    }
}

// Create an instance of AniWorld and assign it to window.aniWorld
window.aniWorld = new AniWorld();