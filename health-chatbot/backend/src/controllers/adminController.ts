import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Conversation } from '../models/Conversation.js';
import { HealthAlert } from '../models/HealthAlert.js';
import { MessagingService } from '../services/messagingService.js';
import { logger } from '../utils/logger.js';
import Joi from 'joi';

const messagingService = new MessagingService();

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ 
      lastActive: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
    });
    
    const totalConversations = await Conversation.countDocuments();
    const activeConversations = await Conversation.countDocuments({ status: 'active' });
    
    const activeAlerts = await HealthAlert.countDocuments({ 
      isActive: true,
      validUntil: { $gte: new Date() }
    });

    // Get top intents from recent conversations
    const intentStats = await Conversation.aggregate([
      { $unwind: '$messages' },
      { $match: { 'messages.intent': { $exists: true, $ne: null } } },
      { $group: { _id: '$messages.intent', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get language distribution
    const languageStats = await User.aggregate([
      { $group: { _id: '$language', count: { $sum: 1 } } }
    ]);

    // Get recent conversations
    const recentConversations = await Conversation.find()
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate('userId', 'name phoneNumber')
      .select('phoneNumber status tags updatedAt messages');

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          activeUsers,
          totalConversations,
          activeConversations,
          activeAlerts
        },
        intentStats,
        languageStats,
        recentConversations
      }
    });

  } catch (error) {
    logger.error('Error in getDashboardStats controller:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard statistics'
    });
  }
};

/**
 * Get all users with pagination
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;

    let query: any = {};
    if (search) {
      query = {
        $or: [
          { phoneNumber: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Error in getUsers controller:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get users'
    });
  }
};

/**
 * Get all conversations with pagination
 */
export const getConversations = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    let query: any = {};
    if (status) {
      query.status = status;
    }

    const conversations = await Conversation.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('userId', 'name phoneNumber')
      .select('-messages'); // Exclude messages for performance

    const total = await Conversation.countDocuments(query);

    res.json({
      success: true,
      data: {
        conversations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Error in getConversations controller:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get conversations'
    });
  }
};

/**
 * Create health alert
 */
export const createHealthAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const createAlertSchema = Joi.object({
      title: Joi.string().required().min(1).max(200),
      message: Joi.string().required().min(1).max(1000),
      severity: Joi.string().valid('low', 'medium', 'high', 'critical').required(),
      type: Joi.string().valid('outbreak', 'vaccination', 'prevention', 'general').required(),
      location: Joi.object({
        state: Joi.string().optional(),
        district: Joi.string().optional(),
        pincode: Joi.string().pattern(/^\d{6}$/).optional(),
        nationwide: Joi.boolean().default(false)
      }).required(),
      language: Joi.string().valid('en', 'hi', 'both').default('both'),
      validUntil: Joi.date().greater('now').required(),
      targetAudience: Joi.object({
        ageRange: Joi.object({
          min: Joi.number().min(0).max(120),
          max: Joi.number().min(0).max(120)
        }).optional(),
        gender: Joi.string().valid('male', 'female', 'other').optional()
      }).optional()
    });

    const { error, value } = createAlertSchema.validate(req.body);
    
    if (error) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details[0].message
      });
      return;
    }

    const alert = new HealthAlert({
      ...value,
      source: 'Admin Dashboard',
      createdBy: 'admin' // In production, use actual admin user ID
    });

    await alert.save();

    // Send alert to users immediately
    await messagingService.sendHealthAlert(alert);

    res.status(201).json({
      success: true,
      message: 'Health alert created and sent successfully',
      data: alert
    });

  } catch (error) {
    logger.error('Error in createHealthAlert controller:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create health alert'
    });
  }
};

/**
 * Get all health alerts
 */
export const getHealthAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const isActive = req.query.isActive === 'true';

    let query: any = {};
    if (req.query.isActive) {
      query.isActive = isActive;
    }

    const alerts = await HealthAlert.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await HealthAlert.countDocuments(query);

    res.json({
      success: true,
      data: {
        alerts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Error in getHealthAlerts controller:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get health alerts'
    });
  }
};

/**
 * Update health alert
 */
export const updateHealthAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateAlertSchema = Joi.object({
      isActive: Joi.boolean().optional(),
      validUntil: Joi.date().optional()
    });

    const { error, value } = updateAlertSchema.validate(req.body);
    
    if (error) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details[0].message
      });
      return;
    }

    const alert = await HealthAlert.findByIdAndUpdate(id, value, { new: true });

    if (!alert) {
      res.status(404).json({
        success: false,
        error: 'Health alert not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Health alert updated successfully',
      data: alert
    });

  } catch (error) {
    logger.error('Error in updateHealthAlert controller:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update health alert'
    });
  }
};

/**
 * Get messaging service status
 */
export const getMessagingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const whatsappStatus = messagingService.getWhatsAppStatus();
    
    res.json({
      success: true,
      data: {
        whatsapp: {
          ready: whatsappStatus.ready,
          connected: whatsappStatus.client !== null
        },
        sms: {
          configured: process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
        }
      }
    });

  } catch (error) {
    logger.error('Error in getMessagingStatus controller:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get messaging status'
    });
  }
};