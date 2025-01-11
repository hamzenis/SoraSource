// This file contains the JavaScript code that will be executed
// by the Swift code. The JavaScript code is responsible for
// fetching the data from the website and returning it to the
// Swift code.
// Debugging Tip: Use "log" for logging in the XCode console

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
        log('Fetch error:', error);
        return JSON.stringify([{ title: 'Error', href: '' }]);
    }
}



// Fetch function for extracting details of item
// This function is relevant for the swift code
async function extractDetails(url) {
    try {
        const fetchUrl = `${url}`;
        const text = await fetch(fetchUrl);

        const descriptionRegex = /<p\s+class="seri_des"\s+itemprop="accessibilitySummary"\s+data-description-type="review"\s+data-full-description="([^"]*)".*?>(.*?)<\/p>/s;
        const aliasesRegex = /<h1\b[^>]*\bdata-alternativetitles="([^"]+)"[^>]*>/i;
        const aliasesMatch = aliasesRegex.exec(text);
        let aliasesArray = [];
        if (aliasesMatch) {
            aliasesArray = aliasesMatch[1].split(',').map(a => a.trim());
        }
        
        const descriptionMatch = descriptionRegex.exec(text) || [];
        const airdateMatch = "No Data";
        
        return JSON.stringify([{ description: descriptionMatch[1], aliases: aliasesArray[0], airdate: airdateMatch }]);
    } catch (error) {
        log('Fetch error:', error);
        return JSON.stringify([{ description: 'Error', aliases: 'Error', airdate: 'Error' }]);
    }
}



// Fetch function for getting the list of episodes
// This function is relevant for the swift code
async function extractEpisodes(url){
    try {
        const fetchUrl = `${url}`;
        const text = await fetch(fetchUrl);

        const finishedList = [];
        const seasonLinks = getSeasonLinks(text);
        
        for (const seasonLink of seasonLinks) {
            const seasonEpisodes = await fetchSeasonEpisodes(`${baseUrl}${seasonLink}`);
            finishedList.push(...seasonEpisodes);
        }

        // Replace the field "number" with the current index of each item, starting from 1
        finishedList.forEach((item, index) => {
            item.number = index + 1;
        });

        return JSON.stringify(finishedList);

    } catch (error) {
        log('Fetch error:', error);
        return JSON.stringify([{ title: 'Error1', link: '' }]);
    }
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
        let holderNumber = 0;

        while ((match = regex.exec(text)) !== null) {
            const [_, link] = match;
            matches.push({ number: holderNumber, href: `${baseUrl}${link}` });
        }

        return matches;

    } catch (error) {
        log('Fetch error:', error);
        return [{ number: '1', href: 'https://error.org' }];
    }
}




// Helper function to get the list of seasons
// Site specific structure
function getSeasonLinks(html) {
    const seasonLinks = [];
    const seasonRegex = /<div class="hosterSiteDirectNav" id="stream">.*?<ul>(.*?)<\/ul>/s;
    const seasonMatch = seasonRegex.exec(html);
    if (seasonMatch) {
        const seasonList = seasonMatch[1];
        const seasonLinkRegex = /<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
        let seasonLinkMatch;
        const filmeLinks = [];
        while ((seasonLinkMatch = seasonLinkRegex.exec(seasonList)) !== null) {
            const [_, seasonLink] = seasonLinkMatch;
            if (seasonLink.endsWith('/filme')) {
                filmeLinks.push(seasonLink);
            } else {
                seasonLinks.push(seasonLink);
            }
        }
        seasonLinks.push(...filmeLinks);
    }
    return seasonLinks;
}
