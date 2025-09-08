import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cron from 'node-cron';

import { config } from './config/env.js';
import connectDB from './config/database.js';
import { logger } from './utils/logger.js';

// Routes
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Services
import { ChatbotService } from './services/chatbotService.js';
import { MessagingService } from './services/messagingService.js';
import { HealthAlert } from './models/HealthAlert.js';

class Server {
  private app: express.Application;
  private httpServer: any;
  private io: SocketIOServer;
  private chatbotService: ChatbotService;
  private messagingService: MessagingService;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: config.corsOrigin,
        methods: ['GET', 'POST']
      }
    });

    this.chatbotService = new ChatbotService();
    this.messagingService = new MessagingService();

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeSocketIO();
    this.initializeCronJobs();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS
    this.app.use(cors({
      origin: config.corsOrigin,
      credentials: true
    }));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api/chat', chatRoutes);
    this.app.use('/api/admin', adminRoutes);

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.nodeEnv
      });
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    });

    // Error handler
    this.app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('Unhandled error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    });
  }

  private initializeSocketIO(): void {
    this.io.on('connection', (socket) => {
      logger.info(`Socket connected: ${socket.id}`);

      // Handle chat messages via WebSocket
      socket.on('chat_message', async (data) => {
        try {
          const { message, phoneNumber, language, location } = data;
          
          const context = {
            userId: '',
            phoneNumber,
            language: language || 'en',
            location
          };

          const response = await this.chatbotService.processMessage(message, context);
          
          // Send response back to client
          socket.emit('chat_response', {
            success: true,
            data: response
          });

          // Broadcast to admin dashboard if needed
          socket.broadcast.to('admin').emit('new_message', {
            phoneNumber,
            message,
            response: response.message,
            timestamp: new Date().toISOString()
          });

        } catch (error) {
          logger.error('Error processing socket message:', error);
          socket.emit('chat_response', {
            success: false,
            error: 'Failed to process message'
          });
        }
      });

      // Admin room for dashboard
      socket.on('join_admin', () => {
        socket.join('admin');
        logger.info(`Admin joined: ${socket.id}`);
      });

      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });
  }

  private initializeCronJobs(): void {
    // Check for expired health alerts every hour
    cron.schedule('0 * * * *', async () => {
      try {
        const expiredAlerts = await HealthAlert.updateMany(
          { 
            isActive: true,
            validUntil: { $lt: new Date() }
          },
          { isActive: false }
        );

        if (expiredAlerts.modifiedCount > 0) {
          logger.info(`Deactivated ${expiredAlerts.modifiedCount} expired health alerts`);
        }
      } catch (error) {
        logger.error('Error in cron job - expired alerts:', error);
      }
    });

    // Send periodic health tips (daily at 9 AM)
    cron.schedule('0 9 * * *', async () => {
      try {
        logger.info('Running daily health tips broadcast');
        // Implementation for daily health tips can be added here
      } catch (error) {
        logger.error('Error in cron job - daily tips:', error);
      }
    });

    logger.info('Cron jobs initialized');
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await connectDB();

      // Start server
      this.httpServer.listen(config.port, () => {
        logger.info(`🚀 Health Chatbot Server running on port ${config.port}`);
        logger.info(`📱 Environment: ${config.nodeEnv}`);
        logger.info(`🌐 CORS Origin: ${config.corsOrigin}`);
        
        if (config.twilioAccountSid) {
          logger.info('📞 Twilio SMS service configured');
        }
        
        logger.info('✅ Server started successfully');
      });

      // Graceful shutdown
      process.on('SIGTERM', this.gracefulShutdown.bind(this));
      process.on('SIGINT', this.gracefulShutdown.bind(this));

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private async gracefulShutdown(signal: string): Promise<void> {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);

    this.httpServer.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  }
}

// Start the server
const server = new Server();
server.start().catch((error) => {
  logger.error('Failed to start application:', error);
  process.exit(1);
});