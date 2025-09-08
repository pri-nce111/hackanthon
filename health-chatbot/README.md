# 🏥 Health Chatbot MVP

An AI-driven public health chatbot that provides trusted guidance on preventive healthcare, disease symptoms, and vaccination schedules in multiple languages (Hindi and English).

## 🎯 MVP Features

### ✅ Core Features
- **Multilingual Chatbot**: Supports Hindi and English
- **Health Knowledge Base**: 
  - Preventive healthcare guidance
  - Disease symptoms (COVID-19, Dengue, Fever, etc.)
  - Vaccination schedules for all age groups
- **Government API Integration**: 
  - Co-WIN API for vaccination centers
  - COVID-19 statistics
  - Health outbreak alerts
- **Multi-channel Messaging**: 
  - WhatsApp integration
  - SMS fallback via Twilio
- **Admin Dashboard**: 
  - Real-time analytics
  - Health alert management
  - User conversation monitoring
- **Real-time Alerts**: Automatic outbreak notifications to users

### 🛠 Technology Stack

**Backend:**
- Node.js + TypeScript + Express
- Natural Language Processing (Natural.js)
- MongoDB with Mongoose
- Socket.IO for real-time communication
- Twilio for SMS
- WhatsApp Web.js for WhatsApp
- Cron jobs for automated tasks

**Frontend:**
- React 18 + TypeScript
- React Router for navigation
- i18next for internationalization
- Axios for API communication
- Modern responsive UI

**Infrastructure:**
- Docker & Docker Compose
- MongoDB database
- Redis for caching
- Nginx reverse proxy

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for development)
- MongoDB (if running locally)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd health-chatbot
```

### 2. Configure Environment
```bash
# Copy environment template
cp backend/.env.example .env

# Edit .env with your API keys
nano .env
```

Required environment variables:
```env
# Twilio (for SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# MongoDB
MONGODB_URI=mongodb://admin:password123@localhost:27017/health-chatbot

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 3. Deploy with Docker
```bash
# Run deployment script
./deploy.sh
```

### 4. Access Applications
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001
- **Admin Dashboard**: http://localhost/admin

## 📱 Usage Guide

### For End Users

1. **Web Interface**: Visit the chatbot at http://localhost/chat
2. **Settings**: Configure phone number and location for personalized responses
3. **Ask Questions**: 
   - "I have fever, what should I do?"
   - "Where can I get vaccinated?"
   - "How to prevent dengue?"
   - "COVID symptoms"

### For Administrators

1. **Access Admin Panel**: http://localhost/admin
2. **Dashboard**: View user statistics and conversation analytics
3. **Create Health Alerts**: Send targeted alerts to users by location
4. **Monitor Conversations**: Track user interactions and intent analysis

## 🔧 Development Setup

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development
```bash
npm install
npm run dev
```

### Database Setup
```bash
# Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:6.0

# The application will automatically create collections and indexes
```

## 📊 API Documentation

### Chat Endpoints
- `POST /api/chat/message` - Process chat message
- `GET /api/chat/history` - Get conversation history
- `POST /api/chat/send` - Send message via WhatsApp/SMS

### Admin Endpoints
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - List users with pagination
- `GET /api/admin/conversations` - List conversations
- `POST /api/admin/alerts` - Create health alert
- `GET /api/admin/alerts` - List health alerts

### Example API Usage
```javascript
// Send a chat message
const response = await fetch('/api/chat/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'I have fever',
    phoneNumber: '+919999999999',
    language: 'en',
    location: { state: 'Delhi', pincode: '110001' }
  })
});
```

## 🧠 NLP Capabilities

The chatbot can understand and respond to:

### Symptom Queries
- Fever, COVID-19, Dengue, general illness symptoms
- Provides appropriate guidance and warning signs

### Prevention Questions
- Hand hygiene, mask usage, vaccination importance
- Disease-specific prevention measures

### Vaccination Information
- Age-appropriate vaccination schedules
- Nearby vaccination center locations
- Vaccine availability and booking

### Emergency Situations
- Recognizes emergency keywords
- Provides immediate emergency contact information
- Location-specific emergency numbers

## 🌍 Multilingual Support

### Supported Languages
- **English**: Full support for all features
- **Hindi**: Complete translation including:
  - UI elements and messages
  - Health guidance and responses
  - Emergency information

### Adding New Languages
1. Update `src/i18n.ts` with new language translations
2. Add language patterns in `backend/src/nlp/intents/healthIntents.ts`
3. Update language detection logic in components

## 🚨 Health Alert System

### Alert Types
- **Outbreak**: Disease outbreak notifications
- **Vaccination**: Vaccination drive announcements  
- **Prevention**: Seasonal health advisories
- **General**: Public health information

### Targeting Options
- **Geographic**: State, district, or pincode-based
- **Demographic**: Age and gender filters
- **Language**: Send in specific languages

### Alert Delivery
- Automatic delivery via WhatsApp (preferred) or SMS
- Real-time delivery with delivery tracking
- Bulk messaging with rate limiting

## 🔐 Security Features

- **Input Validation**: All user inputs are validated and sanitized
- **Rate Limiting**: API endpoints protected against abuse
- **CORS Protection**: Configured for secure cross-origin requests
- **Health Data Privacy**: No personal health data stored permanently
- **Secure Headers**: Security headers implemented via Helmet.js

## 📈 Monitoring & Analytics

### Dashboard Metrics
- Total and active users
- Conversation volumes and status
- Intent analysis and accuracy
- Language distribution
- Alert delivery statistics

### Performance Monitoring
- API response times
- Database query performance
- Message delivery success rates
- System health checks

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
npm test
```

### Integration Testing
- API endpoint testing
- Database connection testing
- WhatsApp/SMS integration testing

## 🚀 Deployment Options

### Docker Deployment (Recommended)
- Single-command deployment with `./deploy.sh`
- All services containerized
- Production-ready configuration

### Cloud Deployment
- **AWS**: ECS, RDS, ElastiCache
- **Google Cloud**: Cloud Run, Cloud SQL, Memorystore
- **Azure**: Container Instances, CosmosDB, Redis Cache

### Manual Deployment
- Node.js application server
- MongoDB database
- Nginx reverse proxy
- PM2 process manager

## 🔧 Configuration

### Environment Variables
All configuration via environment variables for security and flexibility.

### Database Configuration
- Automatic index creation
- Connection pooling
- Replica set support

### API Integration
- Configurable API endpoints
- Retry mechanisms
- Fallback strategies

## 📋 Roadmap

### Phase 2 Enhancements
- [ ] Voice interface for illiterate users
- [ ] Additional regional languages
- [ ] AI/ML model improvements
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Offline capability

### Integration Expansions
- [ ] More government health APIs
- [ ] Hospital management systems
- [ ] Pharmacy networks
- [ ] Insurance providers

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues
- **WhatsApp not connecting**: Ensure QR code is scanned
- **SMS not sending**: Verify Twilio credentials
- **Database connection**: Check MongoDB connection string

### Getting Help
- Create an issue in the repository
- Check the documentation
- Review logs: `docker-compose logs -f backend`

### Contact
- Email: support@healthchatbot.com
- Documentation: [Wiki](link-to-wiki)
- Community: [Discord](link-to-discord)

---

**Built with ❤️ for public health and community welfare**