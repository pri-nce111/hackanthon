import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/health-chatbot',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // API Keys
  cowinApiUrl: process.env.COWIN_API_URL || 'https://cdn-api.co-vin.in/api',
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  
  // WhatsApp
  whatsappSessionPath: process.env.WHATSAPP_SESSION_PATH || './whatsapp-session',
  
  // Health APIs
  diseaseApiUrl: process.env.DISEASE_API_URL || 'https://disease.sh/v3/covid-19',
  healthAlertApiUrl: process.env.HEALTH_ALERT_API_URL,
  
  // Admin
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};