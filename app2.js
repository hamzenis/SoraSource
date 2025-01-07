const baseUrl = 'https://www.animeworld.so';
const searchUrl = 'https://www.animeworld.so/search?keyword=';

async function getSearchResults(search) {
    try {
        const fetchUrl = `${searchUrl}${search}`;
        console.log(`Fetching URL: ${fetchUrl}`);
        
        const text = await fetch(fetchUrl);
        console.log('Received response from fetch');

        const regex = /<a[^>]*href="([^"]+)"[^>]*data-jtitle="([^"]+)"[^>]*>[^<]+<\/a>/g;
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