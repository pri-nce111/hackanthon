import twilio from 'twilio';
import { Client as WhatsAppClient, LocalAuth } from 'whatsapp-web.js';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { User } from '../models/User.js';
import { HealthAlert } from '../models/HealthAlert.js';

export interface MessageData {
  to: string;
  message: string;
  type: 'sms' | 'whatsapp';
}

export class MessagingService {
  private twilioClient: twilio.Twilio | null = null;
  private whatsappClient: WhatsAppClient | null = null;
  private isWhatsAppReady = false;

  constructor() {
    this.initializeTwilio();
    this.initializeWhatsApp();
  }

  private initializeTwilio(): void {
    if (config.twilioAccountSid && config.twilioAuthToken) {
      this.twilioClient = twilio(config.twilioAccountSid, config.twilioAuthToken);
      logger.info('Twilio client initialized');
    } else {
      logger.warn('Twilio credentials not provided, SMS functionality will be limited');
    }
  }

  private async initializeWhatsApp(): Promise<void> {
    try {
      this.whatsappClient = new WhatsAppClient({
        authStrategy: new LocalAuth({
          dataPath: config.whatsappSessionPath
        }),
        puppeteer: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      });

      this.whatsappClient.on('qr', (qr) => {
        logger.info('WhatsApp QR Code received, scan with your phone');
        console.log('QR Code:', qr);
      });

      this.whatsappClient.on('ready', () => {
        this.isWhatsAppReady = true;
        logger.info('WhatsApp client is ready');
      });

      this.whatsappClient.on('authenticated', () => {
        logger.info('WhatsApp client authenticated');
      });

      this.whatsappClient.on('auth_failure', (message) => {
        logger.error('WhatsApp authentication failed:', message);
      });

      this.whatsappClient.on('disconnected', (reason) => {
        logger.warn('WhatsApp client disconnected:', reason);
        this.isWhatsAppReady = false;
      });

      await this.whatsappClient.initialize();
    } catch (error) {
      logger.error('Failed to initialize WhatsApp client:', error);
    }
  }

  /**
   * Send SMS via Twilio
   */
  async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      if (!this.twilioClient || !config.twilioPhoneNumber) {
        logger.error('Twilio not configured properly');
        return false;
      }

      const result = await this.twilioClient.messages.create({
        body: message,
        from: config.twilioPhoneNumber,
        to: to
      });

      logger.info(`SMS sent successfully to ${to}, SID: ${result.sid}`);
      return true;
    } catch (error) {
      logger.error('Failed to send SMS:', error);
      return false;
    }
  }

  /**
   * Send WhatsApp message
   */
  async sendWhatsApp(to: string, message: string): Promise<boolean> {
    try {
      if (!this.whatsappClient || !this.isWhatsAppReady) {
        logger.error('WhatsApp client not ready');
        return false;
      }

      // Format phone number for WhatsApp (remove + and add @c.us)
      const formattedNumber = to.replace(/[+\s-]/g, '') + '@c.us';
      
      await this.whatsappClient.sendMessage(formattedNumber, message);
      logger.info(`WhatsApp message sent successfully to ${to}`);
      return true;
    } catch (error) {
      logger.error('Failed to send WhatsApp message:', error);
      return false;
    }
  }

  /**
   * Send message with fallback (WhatsApp first, then SMS)
   */
  async sendMessage(messageData: MessageData): Promise<boolean> {
    const { to, message, type } = messageData;

    if (type === 'whatsapp') {
      const whatsappSent = await this.sendWhatsApp(to, message);
      if (whatsappSent) return true;

      // Fallback to SMS if WhatsApp fails
      logger.info('WhatsApp failed, falling back to SMS');
      return await this.sendSMS(to, message);
    } else {
      return await this.sendSMS(to, message);
    }
  }

  /**
   * Send bulk messages (for alerts)
   */
  async sendBulkMessages(messages: MessageData[]): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const messageData of messages) {
      const success = await this.sendMessage(messageData);
      if (success) {
        sent++;
      } else {
        failed++;
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    logger.info(`Bulk messages sent: ${sent} successful, ${failed} failed`);
    return { sent, failed };
  }

  /**
   * Send health alert to users in specific location
   */
  async sendHealthAlert(alert: HealthAlert): Promise<void> {
    try {
      let query: any = { isActive: true, 'preferences.receiveAlerts': true };

      // Add location filters if specified
      if (alert.location.state && !alert.location.nationwide) {
        query['location.state'] = alert.location.state;
      }
      if (alert.location.district) {
        query['location.district'] = alert.location.district;
      }
      if (alert.location.pincode) {
        query['location.pincode'] = alert.location.pincode;
      }

      const users = await User.find(query);
      logger.info(`Found ${users.length} users for health alert: ${alert.title}`);

      const messages: MessageData[] = users.map(user => {
        const message = this.formatAlertMessage(alert, user.language);
        return {
          to: user.phoneNumber,
          message,
          type: 'whatsapp' // Prefer WhatsApp for alerts
        };
      });

      const result = await this.sendBulkMessages(messages);
      
      // Update alert sent count
      alert.sentCount += result.sent;
      await alert.save();

      logger.info(`Health alert sent to ${result.sent} users`);
    } catch (error) {
      logger.error('Failed to send health alert:', error);
    }
  }

  /**
   * Format alert message based on language
   */
  private formatAlertMessage(alert: HealthAlert, language: 'en' | 'hi'): string {
    const severityEmoji = {
      low: '🟡',
      medium: '🟠',
      high: '🔴',
      critical: '🚨'
    };

    const prefix = language === 'hi' 
      ? `${severityEmoji[alert.severity]} स्वास्थ्य अलर्ट`
      : `${severityEmoji[alert.severity]} Health Alert`;

    const footer = language === 'hi'
      ? '\n\nअधिक जानकारी के लिए अपने स्वास्थ्य केंद्र से संपर्क करें।'
      : '\n\nContact your health center for more information.';

    return `${prefix}\n\n${alert.title}\n\n${alert.message}${footer}`;
  }

  /**
   * Get WhatsApp client status
   */
  getWhatsAppStatus(): { ready: boolean; client: WhatsAppClient | null } {
    return {
      ready: this.isWhatsAppReady,
      client: this.whatsappClient
    };
  }

  /**
   * Restart WhatsApp client
   */
  async restartWhatsApp(): Promise<void> {
    if (this.whatsappClient) {
      await this.whatsappClient.destroy();
    }
    await this.initializeWhatsApp();
  }
}