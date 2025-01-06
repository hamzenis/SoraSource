const baseUrl = 'https://aniworld.to';
const searchUrl = 'https://aniworld.to/animes-alphabet';

async function getSearchResults(search) {
    try {
        const fetchUrl = `${searchUrl}`;
        console.log(`Fetching URL: ${fetchUrl}`);
        
        const response = await fetch(fetchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });

        console.log(`Response status: ${response.status}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const text = await response.text();
        
        // Basic text parsing without using DOMParser
        const regex = /<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
        const matches = [];
        let match;

        while ((match = regex.exec(text)) !== null) {
            const [_, link, title] = match;
            if (!search || title.toLowerCase().includes(search.toLowerCase())) {
                matches.push({ title: title.trim(), link: `${baseUrl}${link}` });
            }
        }

        console.log(`Results: ${JSON.stringify(matches)}`);
        return JSON.stringify(matches);

    } catch (error) {
        console.error('Fetch error:', error);
        return JSON.stringify([{ title: 'Error', link: '' }]);
    }
}

// // Example of using the function:
// getSearchResults('bleach').then(results => console.log(results));