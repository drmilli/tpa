import { Request, Response, NextFunction } from 'express';
export declare class PoliticianController {
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    search(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
    fetchWikipediaInfo(req: Request, res: Response, next: NextFunction): Promise<void>;
    submitContribution(req: Request, res: Response, next: NextFunction): Promise<void>;
    voteOnSubmission(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=politician.controller.d.ts.map