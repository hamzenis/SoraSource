class AniWorld {
    constructor() {
        this.baseUrl = 'https://aniworld.to';
        this.searchUrl = 'https://aniworld.to/animes-alphabet';
        this.corsProxy = 'https://cors-proxy.fringe.zone/';
    }
    
    getSearchResults(search) {
        return fetch(`${this.corsProxy}${this.searchUrl}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
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
                return JSON.stringify(results); // Return results as a JSON string
            })
            .catch(error => {
                console.error('Fetch error:', error);
                return JSON.stringify([]); // Return an empty array as a JSON string
            });
    }
}

// Initialize AniWorld instance
window.aniWorld = new AniWorld();