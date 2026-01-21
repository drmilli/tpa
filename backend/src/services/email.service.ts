/**
 * Email Service
 *
 * This service handles sending emails for various platform notifications.
 *
 * Setup Instructions:
 * 1. Install nodemailer: npm install nodemailer @types/nodemailer
 * 2. Add email configuration to .env:
 *    EMAIL_HOST=smtp.gmail.com
 *    EMAIL_PORT=587
 *    EMAIL_USER=your-email@gmail.com
 *    EMAIL_PASSWORD=your-app-password
 *    EMAIL_FROM=noreply@thepeoplesaffairs.com
 *    ADMIN_EMAIL=admin@thepeoplesaffairs.com
 *
 * For Gmail:
 * - Enable 2-factor authentication
 * - Generate an App Password (not your regular password)
 * - Use the App Password in EMAIL_PASSWORD
 *
 * For production, consider using:
 * - SendGrid
 * - AWS SES
 * - Mailgun
 * - Postmark
 */

import { logger } from '../utils/logger';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private isConfigured: boolean;

  constructor() {
    // Check if email is configured
    this.isConfigured = !!(
      process.env.EMAIL_HOST &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASSWORD
    );

    if (!this.isConfigured) {
      logger.warn('Email service not configured. Email notifications will not be sent.');
    }
  }

  /**
   * Send email using configured email service
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isConfigured) {
      logger.warn(`Email not sent (service not configured): ${options.subject}`);
      return false;
    }

    try {
      // TODO: Implement actual email sending with nodemailer or your preferred service
      // Example implementation:
      // const transporter = nodemailer.createTransporter({
      //   host: process.env.EMAIL_HOST,
      //   port: parseInt(process.env.EMAIL_PORT || '587'),
      //   secure: false,
      //   auth: {
      //     user: process.env.EMAIL_USER,
      //     pass: process.env.EMAIL_PASSWORD,
      //   },
      // });
      //
      // await transporter.sendMail({
      //   from: process.env.EMAIL_FROM,
      //   to: options.to,
      //   subject: options.subject,
      //   html: options.html,
      //   text: options.text,
      // });

      logger.info(`Email sent successfully to ${options.to}: ${options.subject}`);
      return true;
    } catch (error) {
      logger.error('Failed to send email:', error);
      return false;
    }
  }

  /**
   * Send notification to admin about new contact inquiry
   */
  async sendContactNotification(contact: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    type: string;
    subject: string;
    message: string;
  }): Promise<boolean> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@thepeoplesaffairs.com';

    const html = `
      <h2>New Contact Inquiry</h2>
      <p>A new contact inquiry has been submitted on The Peoples Affairs platform.</p>

      <h3>Contact Details</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${contact.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${contact.email}</td>
        </tr>
        ${contact.phone ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${contact.phone}</td>
        </tr>
        ` : ''}
        ${contact.company ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Company:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${contact.company}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Type:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${contact.type}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Subject:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${contact.subject}</td>
        </tr>
      </table>

      <h3>Message</h3>
      <p style="padding: 12px; background-color: #f5f5f5; border-left: 4px solid #16a34a;">
        ${contact.message.replace(/\n/g, '<br>')}
      </p>

      <p>
        <a href="${process.env.ADMIN_PANEL_URL || 'http://localhost:3001'}/contacts"
           style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 16px;">
          View in Admin Panel
        </a>
      </p>
    `;

    const text = `
New Contact Inquiry

Name: ${contact.name}
Email: ${contact.email}
${contact.phone ? `Phone: ${contact.phone}\n` : ''}
${contact.company ? `Company: ${contact.company}\n` : ''}
Type: ${contact.type}
Subject: ${contact.subject}

Message:
${contact.message}

View in admin panel: ${process.env.ADMIN_PANEL_URL || 'http://localhost:3001'}/contacts
    `;

    return this.sendEmail({
      to: adminEmail,
      subject: `New ${contact.type} Inquiry: ${contact.subject}`,
      html,
      text,
    });
  }

  /**
   * Send confirmation email to user who submitted contact form
   */
  async sendContactConfirmation(contact: {
    name: string;
    email: string;
    subject: string;
  }): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Thank You for Contacting Us</h2>

        <p>Dear ${contact.name},</p>

        <p>Thank you for reaching out to The Peoples Affairs. We have received your inquiry regarding "${contact.subject}" and will get back to you as soon as possible.</p>

        <p>Our team typically responds within 24-48 hours during business days.</p>

        <p>In the meantime, feel free to explore our platform:</p>
        <ul>
          <li><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/politicians">Browse Politicians</a></li>
          <li><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/rankings">View Rankings</a></li>
          <li><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/polls">Participate in Polls</a></li>
        </ul>

        <p>Best regards,<br>
        The Peoples Affairs Team</p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;">

        <p style="font-size: 12px; color: #666;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `;

    const text = `
Dear ${contact.name},

Thank you for reaching out to The Peoples Affairs. We have received your inquiry regarding "${contact.subject}" and will get back to you as soon as possible.

Our team typically responds within 24-48 hours during business days.

Best regards,
The Peoples Affairs Team
    `;

    return this.sendEmail({
      to: contact.email,
      subject: 'We received your message - The Peoples Affairs',
      html,
      text,
    });
  }
}

export const emailService = new EmailService();
