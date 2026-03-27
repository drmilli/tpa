interface VerificationResult {
    isVerified: boolean;
    confidence: number;
    reasoning: string;
    suggestedAction: 'approve' | 'reject' | 'needs_review';
    factChecks: string[];
}
declare class VerificationService {
    private openai;
    constructor();
    verifySubmission(type: 'project' | 'achievement' | 'controversy', title: string, description: string, politicianName: string, sourceUrl?: string): Promise<VerificationResult>;
    private getDefaultResponse;
    processProjectVerification(projectId: string): Promise<void>;
    processControversyVerification(controversyId: string): Promise<void>;
}
export declare const verificationService: VerificationService;
export {};
//# sourceMappingURL=verification.service.d.ts.map