import { Request, Response } from 'express';
import { ChatbotService } from '../services/chatbotService.js';
import { logger } from '../utils/logger.js';
import Joi from 'joi';

const chatbotService = new ChatbotService();

// Validation schemas
const chatMessageSchema = Joi.object({
  message: Joi.string().required().min(1).max(1000),
  phoneNumber: Joi.string().required().pattern(/^\+?[1-9]\d{1,14}$/),
  language: Joi.string().valid('en', 'hi').default('en'),
  location: Joi.object({
    state: Joi.string().optional(),
    district: Joi.string().optional(),
    pincode: Joi.string().pattern(/^\d{6}$/).optional()
  }).optional()
});

const conversationHistorySchema = Joi.object({
  phoneNumber: Joi.string().required().pattern(/^\+?[1-9]\d{1,14}$/),
  limit: Joi.number().integer().min(1).max(50).default(10)
});

/**
 * Process chat message
 */
export const processMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = chatMessageSchema.validate(req.body);
    
    if (error) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details[0].message
      });
      return;
    }

    const { message, phoneNumber, language, location } = value;

    const context = {
      userId: '', // Will be set by the service
      phoneNumber,
      language,
      location
    };

    const response = await chatbotService.processMessage(message, context);

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    logger.error('Error in processMessage controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to process message'
    });
  }
};

/**
 * Get conversation history
 */
export const getConversationHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = conversationHistorySchema.validate(req.query);
    
    if (error) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details[0].message
      });
      return;
    }

    const { phoneNumber, limit } = value;

    const conversations = await chatbotService.getConversationHistory(phoneNumber, limit);

    res.json({
      success: true,
      data: conversations
    });

  } catch (error) {
    logger.error('Error in getConversationHistory controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to get conversation history'
    });
  }
};

/**
 * Send message via WhatsApp/SMS
 */
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const sendMessageSchema = Joi.object({
      phoneNumber: Joi.string().required().pattern(/^\+?[1-9]\d{1,14}$/),
      message: Joi.string().required().min(1).max(1000),
      type: Joi.string().valid('whatsapp', 'sms').default('whatsapp')
    });

    const { error, value } = sendMessageSchema.validate(req.body);
    
    if (error) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details[0].message
      });
      return;
    }

    const { phoneNumber, message, type } = value;

    const success = await chatbotService.sendMessage(phoneNumber, message, type);

    if (success) {
      res.json({
        success: true,
        message: 'Message sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to send message'
      });
    }

  } catch (error) {
    logger.error('Error in sendMessage controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to send message'
    });
  }
};

/**
 * Health check endpoint
 */
export const healthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      message: 'Chat service is healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error in healthCheck controller:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed'
    });
  }
};