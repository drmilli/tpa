import { logger } from '../utils/logger';

interface WikipediaSearchResult {
  title: string;
  snippet: string;
  pageid: number;
}

interface WikipediaBioResult {
  biography: string | null;
  photoUrl: string | null;
  wikiUrl: string | null;
}

interface WikipediaSearchResponse {
  query?: {
    search?: WikipediaSearchResult[];
  };
}

interface WikipediaPageResponse {
  query?: {
    pages?: Record<string, {
      extract?: string;
      thumbnail?: {
        source?: string;
      };
    }>;
  };
}

class WikipediaService {
  private readonly WIKI_API_URL = 'https://en.wikipedia.org/w/api.php';

  async fetchPoliticianInfo(firstName: string, lastName: string): Promise<WikipediaBioResult> {
    try {
      const fullName = `${firstName} ${lastName}`;

      // First, search for the politician
      const searchResult = await this.searchWikipedia(fullName, 'Nigerian politician');

      if (!searchResult) {
        logger.info(`No Wikipedia article found for ${fullName}`);
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
    } catch (error) {
      logger.error('Error fetching Wikipedia info:', error);
      return { biography: null, photoUrl: null, wikiUrl: null };
    }
  }

  private async searchWikipedia(query: string, context: string): Promise<WikipediaSearchResult | null> {
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
        const data = await response.json() as WikipediaSearchResponse;

        if (data.query?.search && data.query.search.length > 0) {
          // Find the most relevant result by checking if the title contains the person's name
          const queryParts = query.toLowerCase().split(' ');
          const relevantResult = data.query.search.find((result: WikipediaSearchResult) => {
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
    } catch (error) {
      logger.error('Wikipedia search error:', error);
      return null;
    }
  }

  private async getPageSummary(title: string): Promise<string | null> {
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
      const data = await response.json() as WikipediaPageResponse;

      const pages = data.query?.pages;
      if (!pages) return null;

      const pageId = Object.keys(pages)[0];
      if (pageId === '-1') return null;

      const extract = pages[pageId].extract;
      if (!extract) return null;

      // Limit to first 3-4 paragraphs or 1000 characters
      const paragraphs = extract.split('\n').filter((p: string) => p.trim());
      const summary = paragraphs.slice(0, 3).join('\n\n');

      return summary.length > 1000 ? summary.substring(0, 1000) + '...' : summary;
    } catch (error) {
      logger.error('Error fetching page summary:', error);
      return null;
    }
  }

  private async getPageImage(title: string): Promise<string | null> {
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
      const data = await response.json() as WikipediaPageResponse;

      const pages = data.query?.pages;
      if (!pages) return null;

      const pageId = Object.keys(pages)[0];
      if (pageId === '-1') return null;

      return pages[pageId].thumbnail?.source || null;
    } catch (error) {
      logger.error('Error fetching page image:', error);
      return null;
    }
  }

  async updatePoliticianFromWikipedia(_politicianId: string, firstName: string, lastName: string): Promise<WikipediaBioResult> {
    const result = await this.fetchPoliticianInfo(firstName, lastName);

    if (result.biography || result.photoUrl) {
      logger.info(`Wikipedia data found for ${firstName} ${lastName}: bio=${!!result.biography}, photo=${!!result.photoUrl}`);
    }

    return result;
  }
}

export const wikipediaService = new WikipediaService();
