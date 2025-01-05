"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var cheerio = require("cheerio");
var AniWorld = /** @class */ (function () {
    function AniWorld() {
        this.baseUrl = 'https://aniworld.to';
        this.searchUrl = 'https://aniworld.to/animes-alphabet';
    }
    /**
     * Get search results.
     * Nativ search is not supported by the website,
     * so we have to get all the titles and then filter them
     * @param search Title to search for
     * @returns List of search results as JSON objects
     */
    AniWorld.prototype.getSearchResults = function (search) {
        return __awaiter(this, void 0, void 0, function () {
            var response, $, results;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this.searchUrl)];
                    case 1:
                        response = _a.sent();
                        $ = cheerio.load(response.data);
                        results = [];
                        $('div.genre ul li a').each(function (_, element) {
                            var title = $(element).text().trim();
                            var link = $(element).attr('href');
                            if (!search || title.toLowerCase().includes(search.toLowerCase())) {
                                results.push({ title: title, link: "".concat(_this.baseUrl).concat(link) });
                            }
                        });
                        return [2 /*return*/, results];
                }
            });
        });
    };
    /**
     * Helper function to get individual episode list, because the episodes are divided into seasons
     * @param url Url of the season
     * @returns List of episodes in the season
     */
    AniWorld.prototype.getIndividualEpisodeList = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var response, $, episodes;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(url)];
                    case 1:
                        response = _a.sent();
                        $ = cheerio.load(response.data);
                        episodes = [];
                        $('table.seasonEpisodesList tbody tr').each(function (_, row) {
                            var linkElement = $(row).find('td.seasonEpisodeTitle a');
                            if (linkElement.length) {
                                var title = linkElement.text().trim();
                                var link = linkElement.attr('href');
                                episodes.push({ title: title, link: "".concat(_this.baseUrl).concat(link) });
                            }
                        });
                        return [2 /*return*/, episodes];
                }
            });
        });
    };
    /**
     * Get all episodes of an anime
     * @param url Base Url of the anime
     * @returns List of all episodes of the anime
     */
    AniWorld.prototype.getAllSeasonsEpisodes = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var response, $, seasonLinks, allEpisodes, _i, seasonLinks_1, seasonLink, episodes;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(url)];
                    case 1:
                        response = _a.sent();
                        $ = cheerio.load(response.data);
                        seasonLinks = [];
                        $('div.hosterSiteDirectNav ul li a').each(function (_, element) {
                            var link = $(element).attr('href');
                            if (link) {
                                seasonLinks.push("".concat(_this.baseUrl).concat(link));
                            }
                        });
                        allEpisodes = [];
                        _i = 0, seasonLinks_1 = seasonLinks;
                        _a.label = 2;
                    case 2:
                        if (!(_i < seasonLinks_1.length)) return [3 /*break*/, 5];
                        seasonLink = seasonLinks_1[_i];
                        return [4 /*yield*/, this.getIndividualEpisodeList(seasonLink)];
                    case 3:
                        episodes = _a.sent();
                        allEpisodes.push.apply(allEpisodes, episodes);
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, allEpisodes];
                }
            });
        });
    };
    /**
     * Get all video links of an episode
     * @param url Url of the episode
     * @returns Video link of the episode
     */
    AniWorld.prototype.getEpisodeVideoLinks = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var response, $, languageMap, scrapedVideoLinks, finalVideoLinks;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(url)];
                    case 1:
                        response = _a.sent();
                        $ = cheerio.load(response.data);
                        languageMap = {};
                        $('div.changeLanguageBox img').each(function (_, element) {
                            var langKey = $(element).attr('data-lang-key');
                            var title = $(element).attr('title');
                            if (langKey && title) {
                                languageMap[langKey] = title;
                            }
                        });
                        scrapedVideoLinks = [];
                        $('div.hosterSiteVideo ul li a').each(function (_, element) {
                            var link = $(element).attr('href');
                            var provider = $(element).find('h4').text().trim();
                            var langKey = $(element).closest('li').attr('data-lang-key');
                            var language = langKey ? languageMap[langKey] : 'Unknown';
                            if (link) {
                                scrapedVideoLinks.push({ provider: provider, link: "".concat(_this.baseUrl).concat(link), language: language });
                            }
                        });
                        return [4 /*yield*/, this.redirectToFinalUrl(scrapedVideoLinks)];
                    case 2:
                        finalVideoLinks = _a.sent();
                        return [2 /*return*/, finalVideoLinks];
                }
            });
        });
    };
    /**
     * Helper function to follow redirects and get the final url
     * @param videoLinks Array of video links with provider name
     * @returns Array of final urls with provider name
     */
    AniWorld.prototype.redirectToFinalUrl = function (videoLinks) {
        return __awaiter(this, void 0, void 0, function () {
            var finalUrls, _i, videoLinks_1, videoLink, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        finalUrls = [];
                        _i = 0, videoLinks_1 = videoLinks;
                        _a.label = 1;
                    case 1:
                        if (!(_i < videoLinks_1.length)) return [3 /*break*/, 6];
                        videoLink = videoLinks_1[_i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, axios_1.default.get(videoLink.link, { maxRedirects: 5 })];
                    case 3:
                        response = _a.sent();
                        finalUrls.push({ provider: videoLink.provider, finalUrl: response.request.res.responseUrl, language: videoLink.language });
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error("Error following redirect for ".concat(videoLink.provider, ": ").concat(error_1.message));
                        finalUrls.push({ provider: videoLink.provider, finalUrl: "dead link", language: videoLink.language });
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, finalUrls];
                }
            });
        });
    };
    return AniWorld;
}());
// Expose the getSearchResults function to the global scope
global.getSearchResults = function (search) { return __awaiter(void 0, void 0, void 0, function () {
    var aniWorld;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                aniWorld = new AniWorld();
                return [4 /*yield*/, aniWorld.getSearchResults(search)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
