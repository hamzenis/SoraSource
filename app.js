const baseUrl = 'https://aniworld.to';
const searchUrl = 'https://aniworld.to/animes-alphabet';


// Fetch function for searching with a keyword
// This function is relevant for the swift code
async function searchResults(search) {
    try {
        const fetchUrl = `${searchUrl}`;
        const text = await fetch(fetchUrl);
        const regex = /<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
        const matches = [];
        let match;

        while ((match = regex.exec(text)) !== null) {
            const [_, href, title] = match;
            if (!search || title.toLowerCase().includes(search.toLowerCase())) {
                matches.push({ title: title.trim(), href: `${baseUrl}${href}` });
            }
        }
        return JSON.stringify(matches);
    } catch (error) {
        console.log('Fetch error:', error);
        return JSON.stringify([{ title: 'Error', href: '' }]);
    }
}

// Fetch function for getting the list of episodes
// This function is relevant for the swift code
async function getEpisodesList(url){
    try {
        const fetchUrl = `${url}`;
        const text = await fetch(fetchUrl);

        const finishedList = [];
        const seasonLinks = await getSeasonLinks(text);
        
        for (const seasonLink of seasonLinks) {
            const seasonEpisodes = await fetchSeasonEpisodes(`${baseUrl}${seasonLink}`);
            finishedList.push(...seasonEpisodes);
        }

        return JSON.stringify(finishedList);

    } catch (error) {
        console.log('Fetch error:', error);
        return JSON.stringify([{ title: 'Error1', link: '' }]);
    }
}

// Helper function to get the list of seasons
// Site specific structure
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

// Helper function to fetch episodes for a season
// Site specific structure
async function fetchSeasonEpisodes(url) {
    try {
        const fetchUrl = `${url}`;
        const text = await fetch(fetchUrl);

        // Updated regex to allow empty <strong> content
        const regex = /<td class="seasonEpisodeTitle">\s*<a[^>]*href="([^"]+)"[^>]*>.*?<strong>([^<]*)<\/strong>.*?<span>([^<]+)<\/span>.*?<\/a>/g;

        const matches = [];
        let match;

        while ((match = regex.exec(text)) !== null) {
            const [_, link, title, spanText] = match;
            matches.push({ title: `${title.trim()} - ${spanText.trim()}`, link: `${baseUrl}${link}` });
        }

        return matches;

    } catch (error) {
        console.log('Fetch error:', error);
        return [{ title: 'Error2', link: '' }];
    }
}
