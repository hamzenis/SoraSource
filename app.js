const baseUrl = 'https://aniworld.to';
const searchUrl = 'https://aniworld.to/animes-alphabet';

async function getSearchResults(search) {
    try {
        const fetchUrl = `${searchUrl}`;
        console.log(`Fetching URL: ${fetchUrl}`);
        
        const text = await fetch(fetchUrl);
        console.log('Received response from fetch');

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
        console.log('Fetch error:', error);
        return JSON.stringify([{ title: 'Error', link: '' }]);
    }
}