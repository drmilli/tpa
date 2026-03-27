"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("../middleware/errorHandler");
const email_service_1 = require("../services/email.service");
const prisma = new client_1.PrismaClient();
class ContactController {
    // Public endpoint - anyone can submit a contact inquiry
    async create(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ success: false, errors: errors.array() });
                return;
            }
            const { name, email, phone, company, type, subject, message } = req.body;
            const contact = await prisma.contact.create({
                data: {
                    name,
                    email,
                    phone,
                    company,
                    type,
                    subject,
                    message,
                    status: 'NEW',
                },
            });
            // Send email notifications (async, don't block response)
            email_service_1.emailService.sendContactNotification({
                id: contact.id,
                name: contact.name,
                email: contact.email,
                phone: contact.phone || undefined,
                company: contact.company || undefined,
                type: contact.type,
                subject: contact.subject,
                message: contact.message,
            }).catch((error) => {
                console.error('Failed to send admin notification:', error);
            });
            email_service_1.emailService.sendContactConfirmation({
                name: contact.name,
                email: contact.email,
                subject: contact.subject,
            }).catch((error) => {
                console.error('Failed to send confirmation email:', error);
            });
            res.status(201).json({
                success: true,
                message: 'Thank you for contacting us! We will get back to you soon.',
                data: {
                    id: contact.id,
                    createdAt: contact.createdAt,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Admin only - get all contact inquiries
    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 20, type, status, search, } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const where = {};
            if (type)
                where.type = type;
            if (status)
                where.status = status;
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { company: { contains: search, mode: 'insensitive' } },
                    { subject: { contains: search, mode: 'insensitive' } },
                ];
            }
            const [contacts, total] = await Promise.all([
                prisma.contact.findMany({
                    where,
                    skip,
                    take: Number(limit),
                    orderBy: { createdAt: 'desc' },
                }),
                prisma.contact.count({ where }),
            ]);
            res.json({
                success: true,
                data: {
                    contacts,
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
    // Admin only - get single contact inquiry
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const contact = await prisma.contact.findUnique({
                where: { id },
            });
            if (!contact) {
                throw new errorHandler_1.AppError('Contact inquiry not found', 404);
            }
            res.json({
                success: true,
                data: contact,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Admin only - update contact inquiry status/notes
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { status, notes, assignedToId } = req.body;
            const updateData = {};
            if (status)
                updateData.status = status;
            if (notes !== undefined)
                updateData.notes = notes;
            if (assignedToId !== undefined)
                updateData.assignedToId = assignedToId;
            if (status === 'RESOLVED' && !updateData.resolvedAt) {
                updateData.resolvedAt = new Date();
            }
            const contact = await prisma.contact.update({
                where: { id },
                data: updateData,
            });
            res.json({
                success: true,
                data: contact,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Admin only - delete contact inquiry
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await prisma.contact.delete({ where: { id } });
            res.json({
                success: true,
                message: 'Contact inquiry deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Admin only - get contact statistics
    async getStats(_req, res, next) {
        try {
            const [total, byType, byStatus, recentCount] = await Promise.all([
                prisma.contact.count(),
                prisma.contact.groupBy({
                    by: ['type'],
                    _count: true,
                }),
                prisma.contact.groupBy({
                    by: ['status'],
                    _count: true,
                }),
                prisma.contact.count({
                    where: {
                        createdAt: {
                            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
                        },
                    },
                }),
            ]);
            res.json({
                success: true,
                data: {
                    total,
                    recentCount,
                    byType: byType.reduce((acc, item) => {
                        acc[item.type] = item._count;
                        return acc;
                    }, {}),
                    byStatus: byStatus.reduce((acc, item) => {
                        acc[item.status] = item._count;
                        return acc;
                    }, {}),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ContactController = ContactController;
//# sourceMappingURL=contact.controller.js.map