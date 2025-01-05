import axios from 'axios';
import * as cheerio from 'cheerio';

class AniWorld {

    baseUrl: string = 'https://aniworld.to';
    searchUrl: string = 'https://aniworld.to/animes-alphabet';



    /**
     * Get search results. 
     * Nativ search is not supported by the website, 
     * so we have to get all the titles and then filter them
     * @param search Title to search for
     * @returns List of search results as JSON objects
     */
    public async getSearchResults(search: string): Promise<any[]> {
        const response = await axios.get(this.searchUrl);
        const $ = cheerio.load(response.data);

        const results: any[] = [];
        $('div.genre ul li a').each((_, element) => {
            const title = $(element).text().trim();
            const link = $(element).attr('href');
            if (!search || title.toLowerCase().includes(search.toLowerCase())) {
                results.push({ title, link: `${this.baseUrl}${link}` });
            }
        });

        return results;
    }

    /**
     * Helper function to get individual episode list, because the episodes are divided into seasons
     * @param url Url of the season
     * @returns List of episodes in the season
     */
    public async getIndividualEpisodeList(url: string): Promise<any[]> {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const episodes: any[] = [];
        $('table.seasonEpisodesList tbody tr').each((_, row) => {
            const linkElement = $(row).find('td.seasonEpisodeTitle a');
            if (linkElement.length) {
                const title = linkElement.text().trim();
                const link = linkElement.attr('href');
                episodes.push({ title, link: `${this.baseUrl}${link}` });
            }
        });

        return episodes;
    }

    /**
     * Get all episodes of an anime
     * @param url Base Url of the anime
     * @returns List of all episodes of the anime
     */
    public async getAllSeasonsEpisodes(url: string): Promise<any[]> {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const seasonLinks: string[] = [];
        $('div.hosterSiteDirectNav ul li a').each((_, element) => {
            const link = $(element).attr('href');
            if (link) {
                seasonLinks.push(`${this.baseUrl}${link}`);
            }
        });

        const allEpisodes: any[] = [];
        for (const seasonLink of seasonLinks) {
            const episodes = await this.getIndividualEpisodeList(seasonLink);
            allEpisodes.push(...episodes);
        }

        return allEpisodes;
    }

    /**
     * Get all video links of an episode
     * @param url Url of the episode
     * @returns Video link of the episode
     */
    public async getEpisodeVideoLinks(url: string): Promise<any[]> {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Language map to get the language of the video
        const languageMap: { [key: string]: string } = {};
        $('div.changeLanguageBox img').each((_, element) => {
            const langKey = $(element).attr('data-lang-key');
            const title = $(element).attr('title');
            if (langKey && title) {
                languageMap[langKey] = title;
            }
        });

        const scrapedVideoLinks: any[] = [];
        $('div.hosterSiteVideo ul li a').each((_, element) => {
            const link = $(element).attr('href');
            const provider = $(element).find('h4').text().trim();
            const langKey = $(element).closest('li').attr('data-lang-key');
            const language = langKey ? languageMap[langKey] : 'Unknown';
            if (link) {
                scrapedVideoLinks.push({ provider, link: `${this.baseUrl}${link}`, language });
            }
        });

        const finalVideoLinks: any[] = await this.redirectToFinalUrl(scrapedVideoLinks);

        return finalVideoLinks;
    }


    /**
     * Helper function to follow redirects and get the final url
     * @param videoLinks Array of video links with provider name
     * @returns Array of final urls with provider name
     */
    public async redirectToFinalUrl(videoLinks: any[]): Promise<any[]> {
        const finalUrls: any[] = [];

        for (const videoLink of videoLinks) {
            try {
                const response = await axios.get(videoLink.link, { maxRedirects: 5 });
                finalUrls.push({ provider: videoLink.provider, finalUrl: response.request.res.responseUrl, language: videoLink.language });
            } catch (error) {
                console.error(`Error following redirect for ${videoLink.provider}: ${error.message}`);
                finalUrls.push({ provider: videoLink.provider, finalUrl: "dead link", language: videoLink.language });
            }
        }

        return finalUrls;
    }

}