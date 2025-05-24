import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Create a nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('mail.host'),
      port: this.configService.get<number>('mail.port'),
      secure: this.configService.get<boolean>('mail.secure'),
      auth: {
        user: this.configService.get<string>('mail.user'),
        pass: this.configService.get<string>('mail.password'),
      },
    });
  }

  /**
   * Send an email
   * @param options - Mail options including to, subject, text, html, attachments
   * @returns Promise with mail delivery info
   */
  async sendMail(options: Mail.Options) {
    try {
      const mailOptions = {
        from: this.configService.get<string>('mail.from'),
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
