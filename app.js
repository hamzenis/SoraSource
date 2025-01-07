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

async function getEpisodesList(url){
    try {
        const fetchUrl = `${url}`;
        console.log(`Fetching URL: ${fetchUrl}`);
        
        const text = await fetch(fetchUrl);
        console.log('Received response from fetch');

        // Updated regex to capture text inside <span> as well
        const regex = /<a[^>]*href="([^"]+)"[^>]*>.*?<strong>([^<]+)<\/strong>.*?<span>([^<]+)<\/span>.*?<\/a>/g;
        const matches = [];
        let match;

        while ((match = regex.exec(text)) !== null) {
            const [_, link, title, spanText] = match;
            matches.push({ title: `${title.trim()} - ${spanText.trim()}`, link: `${baseUrl}${link}` });
        }

        // Extract sub pages for each season
        const seasonLinks = await getSeasonLinks(text);
        for (const seasonLink of seasonLinks) {
            const seasonEpisodes = await fetchSeasonEpisodes(`${baseUrl}${seasonLink}`);
            matches.push(...seasonEpisodes);
        }

        console.log(`Results: ${JSON.stringify(matches)}`);
        return JSON.stringify(matches);

    } catch (error) {
        console.log('Fetch error:', error);
        return JSON.stringify([{ title: 'Error', link: '' }]);
    }
}

async function getSeasonLinks(html) {
    const seasonLinks = [];
    const seasonRegex = /<div class="hosterSiteDirectNav" id="stream">.*?<ul>(.*?)<\/ul>/s;
    const seasonMatch = seasonRegex.exec(html);
    if (seasonMatch) {
        const seasonList = seasonMatch[1];
        const seasonLinkRegex = /<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
        let seasonLinkMatch;
        while ((seasonLinkMatch = seasonLinkRegex.exec(seasonList)) !== null) {
            const [_, seasonLink] = seasonLinkMatch;
            seasonLinks.push(seasonLink);
        }
    }
    return seasonLinks;
}

async function fetchSeasonEpisodes(url) {
    try {
        const fetchUrl = `${url}`;
        console.log(`Fetching URL: ${fetchUrl}`);
        
        const text = await fetch(fetchUrl);
        console.log('Received response from fetch');

        const regex = /<a[^>]*href="([^"]+)"[^>]*>.*?<strong>([^<]+)<\/strong>.*?<span>([^<]+)<\/span>.*?<\/a>/g;
        const matches = [];
        let match;

        while ((match = regex.exec(text)) !== null) {
            const [_, link, title, spanText] = match;
            matches.push({ title: `${title.trim()} - ${spanText.trim()}`, link: `${baseUrl}${link}` });
        }

        return matches;

    } catch (error) {
        console.log('Fetch error:', error);
        return [{ title: 'Error', link: '' }];
    }
}
