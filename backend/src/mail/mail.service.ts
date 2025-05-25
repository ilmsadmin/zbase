import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private mailFrom: string;

  constructor() {
    // Create a nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.example.com',
      port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587,
      secure: process.env.MAIL_SECURE === 'true' || false,
      auth: {
        user: process.env.MAIL_USER || 'user@example.com',
        pass: process.env.MAIL_PASSWORD || 'password',
      },
    });
    
    this.mailFrom = process.env.MAIL_FROM || 'ZBase <noreply@zbase.example.com>';
  }

  /**
   * Send an email
   * @param options - Mail options including to, subject, text, html, attachments
   * @returns Promise with mail delivery info
   */
  async sendMail(options: Mail.Options) {
    try {
      const mailOptions = {
        from: this.mailFrom,
        ...options,
      };
      
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Send an email with attachment
   * @param to - Recipient email
   * @param subject - Email subject
   * @param text - Email text content
   * @param html - Email HTML content (optional)
   * @param attachments - Array of attachments
   * @returns Promise with mail delivery info
   */
  async sendMailWithAttachments(
    to: string | string[],
    subject: string,
    text: string,
    html?: string,
    attachments?: Mail.Attachment[],
  ) {
    const mailOptions: Mail.Options = {
      to,
      subject,
      text,
      html,
      attachments,
    };

    return this.sendMail(mailOptions);
  }
}
