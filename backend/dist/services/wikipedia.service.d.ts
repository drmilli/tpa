interface WikipediaBioResult {
    biography: string | null;
    photoUrl: string | null;
    wikiUrl: string | null;
}
declare class WikipediaService {
    private readonly WIKI_API_URL;
    fetchPoliticianInfo(firstName: string, lastName: string): Promise<WikipediaBioResult>;
    private searchWikipedia;
    private getPageSummary;
    private getPageImage;
    updatePoliticianFromWikipedia(_politicianId: string, firstName: string, lastName: string): Promise<WikipediaBioResult>;
}
export declare const wikipediaService: WikipediaService;
export {};
//# sourceMappingURL=wikipedia.service.d.ts.map