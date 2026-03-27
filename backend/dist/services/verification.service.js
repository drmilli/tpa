"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationService = void 0;
const openai_1 = __importDefault(require("openai"));
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const prisma = new client_1.PrismaClient();
class VerificationService {
    constructor() {
        this.openai = null;
        if (process.env.OPENAI_API_KEY) {
            this.openai = new openai_1.default({
                apiKey: process.env.OPENAI_API_KEY,
            });
        }
    }
    async verifySubmission(type, title, description, politicianName, sourceUrl) {
        if (!this.openai) {
            logger_1.logger.warn('OpenAI not configured, returning default review response');
            return this.getDefaultResponse();
        }
        try {
            const systemPrompt = `You are an expert fact-checker and verification specialist for Nigerian political data. Your role is to verify user-submitted information about Nigerian politicians.

You must analyze submissions for:
1. Factual accuracy - Does this align with known facts about Nigerian politics?
2. Credibility - Is the claim plausible and verifiable?
3. Source quality - If a source URL is provided, assess its reliability
4. Potential bias or misinformation

Respond with valid JSON in this exact format:
{
  "isVerified": boolean,
  "confidence": number (0-100),
  "reasoning": "Detailed explanation of your assessment",
  "suggestedAction": "approve" | "reject" | "needs_review",
  "factChecks": ["List of specific facts checked or concerns raised"]
}

Guidelines:
- approve: High confidence the submission is accurate and verifiable
- needs_review: Moderate confidence, requires human moderator review
- reject: Low confidence, likely false or unverifiable

Be especially careful with:
- Claims about corruption or scandals (require strong evidence)
- Budget figures (should be realistic for Nigerian context)
- Project completion claims (verify against known timelines)`;
            const userPrompt = `Verify this ${type} submission about Nigerian politician "${politicianName}":

Title: ${title}
Description: ${description}
${sourceUrl ? `Source URL: ${sourceUrl}` : 'No source URL provided'}

Assess the credibility and accuracy of this submission.`;
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.3,
                max_tokens: 800,
            });
            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new Error('No response from OpenAI');
            }
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Could not parse JSON from response');
            }
            const result = JSON.parse(jsonMatch[0]);
            // Validate and sanitize
            result.confidence = Math.min(100, Math.max(0, result.confidence || 50));
            result.factChecks = (result.factChecks || []).slice(0, 5);
            if (!['approve', 'reject', 'needs_review'].includes(result.suggestedAction)) {
                result.suggestedAction = 'needs_review';
            }
            logger_1.logger.info(`Verification completed for ${type}: ${title.substring(0, 50)}...`);
            return result;
        }
        catch (error) {
            logger_1.logger.error('Error in AI verification:', error);
            return this.getDefaultResponse();
        }
    }
    getDefaultResponse() {
        return {
            isVerified: false,
            confidence: 30,
            reasoning: 'Automatic verification unavailable. This submission requires manual review by our moderation team.',
            suggestedAction: 'needs_review',
            factChecks: [
                'Submission queued for manual verification',
                'Please ensure source URLs are provided for faster approval'
            ]
        };
    }
    async processProjectVerification(projectId) {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { Politician: true }
        });
        if (!project)
            return;
        const result = await this.verifySubmission('project', project.title, project.description, `${project.Politician.firstName} ${project.Politician.lastName}`, project.sourceUrl || undefined);
        // Update project status based on verification
        let newStatus = project.status;
        if (result.suggestedAction === 'approve' && result.confidence >= 70) {
            newStatus = 'ONGOING'; // Verified projects start as ongoing
        }
        else if (result.suggestedAction === 'reject' && result.confidence >= 80) {
            newStatus = 'REJECTED';
        }
        // Otherwise keep as PENDING_VERIFICATION for human review
        await prisma.project.update({
            where: { id: projectId },
            data: { status: newStatus }
        });
        logger_1.logger.info(`Project ${projectId} verification: ${result.suggestedAction} (${result.confidence}%)`);
    }
    async processControversyVerification(controversyId) {
        const controversy = await prisma.controversy.findUnique({
            where: { id: controversyId },
            include: { Politician: true }
        });
        if (!controversy)
            return;
        const result = await this.verifySubmission('controversy', controversy.title, controversy.description, `${controversy.Politician.firstName} ${controversy.Politician.lastName}`, controversy.sourceUrl);
        // Only auto-verify controversies with very high confidence
        if (result.suggestedAction === 'approve' && result.confidence >= 85) {
            await prisma.controversy.update({
                where: { id: controversyId },
                data: { isVerified: true }
            });
        }
        logger_1.logger.info(`Controversy ${controversyId} verification: ${result.suggestedAction} (${result.confidence}%)`);
    }
}
exports.verificationService = new VerificationService();
//# sourceMappingURL=verification.service.js.map