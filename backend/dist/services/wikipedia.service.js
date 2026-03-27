"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wikipediaService = void 0;
const logger_1 = require("../utils/logger");
class WikipediaService {
    constructor() {
        this.WIKI_API_URL = 'https://en.wikipedia.org/w/api.php';
    }
    async fetchPoliticianInfo(firstName, lastName) {
        try {
            const fullName = `${firstName} ${lastName}`;
            // First, search for the politician
            const searchResult = await this.searchWikipedia(fullName, 'Nigerian politician');
            if (!searchResult) {
                logger_1.logger.info(`No Wikipedia article found for ${fullName}`);
                return { biography: null, photoUrl: null, wikiUrl: null };
            }
            // Get the page content and image
            const [biography, photoUrl] = await Promise.all([
                this.getPageSummary(searchResult.title),
                this.getPageImage(searchResult.title),
            ]);
            const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(searchResult.title.replace(/ /g, '_'))}`;
            return {
                biography,
                photoUrl,
                wikiUrl,
            };
        }
        catch (error) {
            logger_1.logger.error('Error fetching Wikipedia info:', error);
            return { biography: null, photoUrl: null, wikiUrl: null };
        }
    }
    async searchWikipedia(query, context) {
        try {
            const searchQueries = [
                `${query} ${context}`,
                query,
                `${query} Nigeria`,
            ];
            for (const searchQuery of searchQueries) {
                const params = new URLSearchParams({
                    action: 'query',
                    list: 'search',
                    srsearch: searchQuery,
                    srlimit: '5',
                    format: 'json',
                    origin: '*',
                });
                const response = await fetch(`${this.WIKI_API_URL}?${params}`);
                const data = await response.json();
                if (data.query?.search && data.query.search.length > 0) {
                    // Find the most relevant result by checking if the title contains the person's name
                    const queryParts = query.toLowerCase().split(' ');
                    const relevantResult = data.query.search.find((result) => {
                        const titleLower = result.title.toLowerCase();
                        return queryParts.every(part => titleLower.includes(part));
                    });
                    if (relevantResult) {
                        return relevantResult;
                    }
                    // If no exact match, return the first result
                    if (searchQuery === query) {
                        return data.query.search[0];
                    }
                }
            }
            return null;
        }
        catch (error) {
            logger_1.logger.error('Wikipedia search error:', error);
            return null;
        }
    }
    async getPageSummary(title) {
        try {
            const params = new URLSearchParams({
                action: 'query',
                titles: title,
                prop: 'extracts',
                exintro: 'true',
                explaintext: 'true',
                exsectionformat: 'plain',
                format: 'json',
                origin: '*',
            });
            const response = await fetch(`${this.WIKI_API_URL}?${params}`);
            const data = await response.json();
            const pages = data.query?.pages;
            if (!pages)
                return null;
            const pageId = Object.keys(pages)[0];
            if (pageId === '-1')
                return null;
            const extract = pages[pageId].extract;
            if (!extract)
                return null;
            // Limit to first 3-4 paragraphs or 1000 characters
            const paragraphs = extract.split('\n').filter((p) => p.trim());
            const summary = paragraphs.slice(0, 3).join('\n\n');
            return summary.length > 1000 ? summary.substring(0, 1000) + '...' : summary;
        }
        catch (error) {
            logger_1.logger.error('Error fetching page summary:', error);
            return null;
        }
    }
    async getPageImage(title) {
        try {
            const params = new URLSearchParams({
                action: 'query',
                titles: title,
                prop: 'pageimages',
                pithumbsize: '400',
                format: 'json',
                origin: '*',
            });
            const response = await fetch(`${this.WIKI_API_URL}?${params}`);
            const data = await response.json();
            const pages = data.query?.pages;
            if (!pages)
                return null;
            const pageId = Object.keys(pages)[0];
            if (pageId === '-1')
                return null;
            return pages[pageId].thumbnail?.source || null;
        }
        catch (error) {
            logger_1.logger.error('Error fetching page image:', error);
            return null;
        }
    }
    async updatePoliticianFromWikipedia(_politicianId, firstName, lastName) {
        const result = await this.fetchPoliticianInfo(firstName, lastName);
        if (result.biography || result.photoUrl) {
            logger_1.logger.info(`Wikipedia data found for ${firstName} ${lastName}: bio=${!!result.biography}, photo=${!!result.photoUrl}`);
        }
        return result;
    }
}
exports.wikipediaService = new WikipediaService();
//# sourceMappingURL=wikipedia.service.js.map