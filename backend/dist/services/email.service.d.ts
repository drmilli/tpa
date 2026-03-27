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
interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
}
declare class EmailService {
    private isConfigured;
    constructor();
    /**
     * Send email using configured email service
     */
    sendEmail(options: EmailOptions): Promise<boolean>;
    /**
     * Send notification to admin about new contact inquiry
     */
    sendContactNotification(contact: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        company?: string;
        type: string;
        subject: string;
        message: string;
    }): Promise<boolean>;
    /**
     * Send confirmation email to user who submitted contact form
     */
    sendContactConfirmation(contact: {
        name: string;
        email: string;
        subject: string;
    }): Promise<boolean>;
}
export declare const emailService: EmailService;
export {};
//# sourceMappingURL=email.service.d.ts.map