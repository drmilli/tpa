"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoliticianController = void 0;
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const elasticsearch_1 = require("../config/elasticsearch");
const wikipedia_service_1 = require("../services/wikipedia.service");
const verification_service_1 = require("../services/verification.service");
const logger_1 = require("../utils/logger");
const prisma = new client_1.PrismaClient();
class PoliticianController {
    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 20, state, party, office: _office, positionType, minScore, maxScore, sortBy = 'performanceScore', order = 'desc', } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const where = { isActive: true };
            // Define elected and appointed office types
            const electedOffices = ['PRESIDENT', 'VICE_PRESIDENT', 'GOVERNOR', 'DEPUTY_GOVERNOR', 'SENATOR', 'HOUSE_OF_REPS', 'STATE_ASSEMBLY', 'LG_CHAIRMAN', 'COUNCILLOR'];
            const appointedOffices = ['MINISTER', 'SPECIAL_ADVISER', 'AMBASSADOR'];
            // Handle position type filter (elected vs appointed)
            if (positionType === 'elected' || positionType === 'appointed') {
                const officeTypes = positionType === 'elected' ? electedOffices : appointedOffices;
                where.Tenure = {
                    some: {
                        isCurrentRole: true,
                        Office: {
                            type: { in: officeTypes }
                        }
                    }
                };
            }
            // Handle state filter by name (case-insensitive)
            if (state) {
                const stateRecord = await prisma.state.findFirst({
                    where: { name: { contains: state, mode: 'insensitive' } },
                });
                if (stateRecord) {
                    where.stateId = stateRecord.id;
                }
            }
            if (party)
                where.partyAffiliation = party;
            if (minScore || maxScore) {
                where.performanceScore = {};
                if (minScore)
                    where.performanceScore.gte = Number(minScore);
                if (maxScore)
                    where.performanceScore.lte = Number(maxScore);
            }
            const [politicians, total] = await Promise.all([
                prisma.politician.findMany({
                    where,
                    skip,
                    take: Number(limit),
                    orderBy: { [sortBy]: order },
                    include: {
                        State: true,
                        Tenure: {
                            where: { isCurrentRole: true },
                            include: { Office: true },
                        },
                    },
                }),
                prisma.politician.count({ where }),
            ]);
            res.json({
                success: true,
                data: {
                    politicians,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total,
                        totalPages: Math.ceil(total / Number(limit)),
                    },
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async search(req, res, next) {
        try {
            const { q, page = 1, limit = 20 } = req.query;
            if (!q) {
                throw new errorHandler_1.AppError('Search query required', 400);
            }
            const from = (Number(page) - 1) * Number(limit);
            const { hits } = await elasticsearch_1.esClient.search({
                index: 'politicians',
                body: {
                    from,
                    size: Number(limit),
                    query: {
                        multi_match: {
                            query: q,
                            fields: ['firstName^2', 'lastName^2', 'fullName^3', 'biography'],
                            fuzziness: 'AUTO',
                        },
                    },
                },
            });
            res.json({
                success: true,
                data: {
                    results: hits.hits.map((hit) => hit._source),
                    total: hits.total,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const politician = await prisma.politician.findUnique({
                where: { id },
                include: {
                    State: true,
                    SenatorialDistrict: true,
                    LocalGovernment: true,
                    Tenure: {
                        include: { Office: true },
                        orderBy: { startDate: 'desc' },
                    },
                },
            });
            if (!politician) {
                throw new errorHandler_1.AppError('Politician not found', 404);
            }
            res.json({
                success: true,
                data: politician,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getProfile(req, res, next) {
        try {
            const { id } = req.params;
            const [politician, promises, bills, projects, controversies, rankings] = await Promise.all([
                prisma.politician.findUnique({
                    where: { id },
                    include: {
                        State: true,
                        SenatorialDistrict: true,
                        LocalGovernment: true,
                        Tenure: {
                            include: { Office: true },
                            orderBy: { startDate: 'desc' },
                        },
                    },
                }),
                prisma.promise.findMany({ where: { politicianId: id }, orderBy: { createdAt: 'desc' } }),
                prisma.bill.findMany({ where: { politicianId: id }, orderBy: { dateProposed: 'desc' } }),
                prisma.project.findMany({ where: { politicianId: id }, orderBy: { createdAt: 'desc' } }),
                prisma.controversy.findMany({ where: { politicianId: id, isVerified: true } }),
                prisma.ranking.findMany({ where: { politicianId: id }, include: { Office: true } }),
            ]);
            if (!politician) {
                throw new errorHandler_1.AppError('Politician not found', 404);
            }
            res.json({
                success: true,
                data: {
                    politician,
                    promises,
                    bills,
                    projects,
                    controversies,
                    rankings,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const politician = await prisma.politician.create({
                data: req.body,
                include: {
                    State: true,
                    Tenure: { include: { Office: true } },
                },
            });
            res.status(201).json({
                success: true,
                data: politician,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const politician = await prisma.politician.update({
                where: { id },
                data: req.body,
                include: {
                    State: true,
                    Tenure: { include: { Office: true } },
                },
            });
            res.json({
                success: true,
                data: politician,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await prisma.politician.delete({ where: { id } });
            res.json({
                success: true,
                message: 'Politician deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async fetchWikipediaInfo(req, res, next) {
        try {
            const { id } = req.params;
            const politician = await prisma.politician.findUnique({
                where: { id },
                select: { id: true, firstName: true, lastName: true, biography: true, photoUrl: true },
            });
            if (!politician) {
                throw new errorHandler_1.AppError('Politician not found', 404);
            }
            const wikiInfo = await wikipedia_service_1.wikipediaService.fetchPoliticianInfo(politician.firstName, politician.lastName);
            // Update politician if we got new data
            const updateData = {};
            if (wikiInfo.biography && !politician.biography) {
                updateData.biography = wikiInfo.biography;
            }
            if (wikiInfo.photoUrl && !politician.photoUrl) {
                updateData.photoUrl = wikiInfo.photoUrl;
            }
            if (Object.keys(updateData).length > 0) {
                await prisma.politician.update({
                    where: { id },
                    data: updateData,
                });
            }
            res.json({
                success: true,
                data: {
                    biography: wikiInfo.biography || politician.biography,
                    photoUrl: wikiInfo.photoUrl || politician.photoUrl,
                    wikiUrl: wikiInfo.wikiUrl,
                    updated: Object.keys(updateData).length > 0,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async submitContribution(req, res, next) {
        try {
            const { id } = req.params;
            const { type, title, description, sourceUrl, date, location, budget, severity } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const politician = await prisma.politician.findUnique({ where: { id } });
            if (!politician) {
                throw new errorHandler_1.AppError('Politician not found', 404);
            }
            let result;
            const politicianName = `${politician.firstName} ${politician.lastName}`;
            switch (type) {
                case 'project':
                    result = await prisma.project.create({
                        data: {
                            politicianId: id,
                            title,
                            description,
                            location,
                            budget: budget ? parseFloat(budget) : null,
                            status: 'PENDING_VERIFICATION',
                            sourceUrl,
                            startDate: date ? new Date(date) : null,
                            submittedBy: userId,
                        },
                    });
                    // Trigger async verification
                    verification_service_1.verificationService.verifySubmission('project', title, description, politicianName, sourceUrl)
                        .then(verification => {
                        if (verification.suggestedAction === 'approve' && verification.confidence >= 70) {
                            prisma.project.update({
                                where: { id: result.id },
                                data: { status: 'ONGOING' }
                            }).catch(err => logger_1.logger.error('Failed to update project status:', err));
                        }
                    })
                        .catch(err => logger_1.logger.error('Verification error:', err));
                    break;
                case 'achievement':
                    result = await prisma.promise.create({
                        data: {
                            politicianId: id,
                            title,
                            description,
                            status: 'PENDING_VERIFICATION',
                            sourceUrl,
                            submittedBy: userId,
                        },
                    });
                    // Trigger async verification
                    verification_service_1.verificationService.verifySubmission('achievement', title, description, politicianName, sourceUrl)
                        .then(verification => {
                        if (verification.suggestedAction === 'approve' && verification.confidence >= 70) {
                            prisma.promise.update({
                                where: { id: result.id },
                                data: { status: 'FULFILLED' }
                            }).catch(err => logger_1.logger.error('Failed to update promise status:', err));
                        }
                    })
                        .catch(err => logger_1.logger.error('Verification error:', err));
                    break;
                case 'controversy':
                    result = await prisma.controversy.create({
                        data: {
                            politicianId: id,
                            title,
                            description,
                            date: date ? new Date(date) : new Date(),
                            sourceUrl: sourceUrl || '',
                            isVerified: false,
                            severity: severity || 'MEDIUM',
                            submittedBy: userId,
                        },
                    });
                    // Trigger async verification (higher threshold for controversies)
                    verification_service_1.verificationService.verifySubmission('controversy', title, description, politicianName, sourceUrl)
                        .then(verification => {
                        if (verification.suggestedAction === 'approve' && verification.confidence >= 85) {
                            prisma.controversy.update({
                                where: { id: result.id },
                                data: { isVerified: true }
                            }).catch(err => logger_1.logger.error('Failed to update controversy status:', err));
                        }
                    })
                        .catch(err => logger_1.logger.error('Verification error:', err));
                    break;
                default:
                    throw new errorHandler_1.AppError('Invalid submission type. Must be project, achievement, or controversy', 400);
            }
            res.status(201).json({
                success: true,
                message: `Your ${type} submission has been received and is being verified by AI. It will be reviewed by our team.`,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async voteOnSubmission(req, res, next) {
        try {
            const { type, itemId } = req.params;
            const { voteType } = req.body; // 'up' or 'down'
            const userId = req.user?.id;
            if (!userId) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            if (!['up', 'down'].includes(voteType)) {
                throw new errorHandler_1.AppError('Vote type must be "up" or "down"', 400);
            }
            let result;
            switch (type) {
                case 'project': {
                    const existingVote = await prisma.projectVote.findUnique({
                        where: { projectId_userId: { projectId: itemId, userId } }
                    });
                    if (existingVote) {
                        if (existingVote.voteType === voteType) {
                            // Remove vote
                            await prisma.projectVote.delete({
                                where: { id: existingVote.id }
                            });
                            // Update counts
                            await prisma.project.update({
                                where: { id: itemId },
                                data: voteType === 'up' ? { upvotes: { decrement: 1 } } : { downvotes: { decrement: 1 } }
                            });
                            result = { action: 'removed', voteType };
                        }
                        else {
                            // Change vote
                            await prisma.projectVote.update({
                                where: { id: existingVote.id },
                                data: { voteType }
                            });
                            // Update counts
                            await prisma.project.update({
                                where: { id: itemId },
                                data: voteType === 'up'
                                    ? { upvotes: { increment: 1 }, downvotes: { decrement: 1 } }
                                    : { upvotes: { decrement: 1 }, downvotes: { increment: 1 } }
                            });
                            result = { action: 'changed', voteType };
                        }
                    }
                    else {
                        // New vote
                        await prisma.projectVote.create({
                            data: { projectId: itemId, userId, voteType }
                        });
                        await prisma.project.update({
                            where: { id: itemId },
                            data: voteType === 'up' ? { upvotes: { increment: 1 } } : { downvotes: { increment: 1 } }
                        });
                        result = { action: 'added', voteType };
                    }
                    break;
                }
                case 'promise': {
                    const existingVote = await prisma.promiseVote.findUnique({
                        where: { promiseId_userId: { promiseId: itemId, userId } }
                    });
                    if (existingVote) {
                        if (existingVote.voteType === voteType) {
                            await prisma.promiseVote.delete({ where: { id: existingVote.id } });
                            await prisma.promise.update({
                                where: { id: itemId },
                                data: voteType === 'up' ? { upvotes: { decrement: 1 } } : { downvotes: { decrement: 1 } }
                            });
                            result = { action: 'removed', voteType };
                        }
                        else {
                            await prisma.promiseVote.update({ where: { id: existingVote.id }, data: { voteType } });
                            await prisma.promise.update({
                                where: { id: itemId },
                                data: voteType === 'up'
                                    ? { upvotes: { increment: 1 }, downvotes: { decrement: 1 } }
                                    : { upvotes: { decrement: 1 }, downvotes: { increment: 1 } }
                            });
                            result = { action: 'changed', voteType };
                        }
                    }
                    else {
                        await prisma.promiseVote.create({ data: { promiseId: itemId, userId, voteType } });
                        await prisma.promise.update({
                            where: { id: itemId },
                            data: voteType === 'up' ? { upvotes: { increment: 1 } } : { downvotes: { increment: 1 } }
                        });
                        result = { action: 'added', voteType };
                    }
                    break;
                }
                case 'controversy': {
                    const existingVote = await prisma.controversyVote.findUnique({
                        where: { controversyId_userId: { controversyId: itemId, userId } }
                    });
                    if (existingVote) {
                        if (existingVote.voteType === voteType) {
                            await prisma.controversyVote.delete({ where: { id: existingVote.id } });
                            await prisma.controversy.update({
                                where: { id: itemId },
                                data: voteType === 'up' ? { upvotes: { decrement: 1 } } : { downvotes: { decrement: 1 } }
                            });
                            result = { action: 'removed', voteType };
                        }
                        else {
                            await prisma.controversyVote.update({ where: { id: existingVote.id }, data: { voteType } });
                            await prisma.controversy.update({
                                where: { id: itemId },
                                data: voteType === 'up'
                                    ? { upvotes: { increment: 1 }, downvotes: { decrement: 1 } }
                                    : { upvotes: { decrement: 1 }, downvotes: { increment: 1 } }
                            });
                            result = { action: 'changed', voteType };
                        }
                    }
                    else {
                        await prisma.controversyVote.create({ data: { controversyId: itemId, userId, voteType } });
                        await prisma.controversy.update({
                            where: { id: itemId },
                            data: voteType === 'up' ? { upvotes: { increment: 1 } } : { downvotes: { increment: 1 } }
                        });
                        result = { action: 'added', voteType };
                    }
                    break;
                }
                default:
                    throw new errorHandler_1.AppError('Invalid submission type', 400);
            }
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PoliticianController = PoliticianController;
//# sourceMappingURL=politician.controller.js.map