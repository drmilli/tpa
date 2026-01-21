import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { emailService } from '../services/email.service';

const prisma = new PrismaClient();

export class ContactController {
  // Public endpoint - anyone can submit a contact inquiry
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
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
      emailService.sendContactNotification({
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

      emailService.sendContactConfirmation({
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
    } catch (error) {
      next(error);
    }
  }

  // Admin only - get all contact inquiries
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        page = 1,
        limit = 20,
        type,
        status,
        search,
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const where: any = {};

      if (type) where.type = type as string;
      if (status) where.status = status as string;
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } },
          { company: { contains: search as string, mode: 'insensitive' } },
          { subject: { contains: search as string, mode: 'insensitive' } },
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
    } catch (error) {
      next(error);
    }
  }

  // Admin only - get single contact inquiry
  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const contact = await prisma.contact.findUnique({
        where: { id },
      });

      if (!contact) {
        throw new AppError('Contact inquiry not found', 404);
      }

      res.json({
        success: true,
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin only - update contact inquiry status/notes
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, notes, assignedToId } = req.body;

      const updateData: any = {};
      if (status) updateData.status = status;
      if (notes !== undefined) updateData.notes = notes;
      if (assignedToId !== undefined) updateData.assignedToId = assignedToId;
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
    } catch (error) {
      next(error);
    }
  }

  // Admin only - delete contact inquiry
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.contact.delete({ where: { id } });

      res.json({
        success: true,
        message: 'Contact inquiry deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin only - get contact statistics
  async getStats(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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
          }, {} as Record<string, number>),
          byStatus: byStatus.reduce((acc, item) => {
            acc[item.status] = item._count;
            return acc;
          }, {} as Record<string, number>),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
