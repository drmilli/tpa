import { Request, Response, NextFunction } from 'express';
export declare class CommentController {
    getComments(req: Request, res: Response, next: NextFunction): Promise<void>;
    createComment(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateComment(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteComment(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=comment.controller.d.ts.map