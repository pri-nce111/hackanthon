import { NLPService, NLPResult } from './nlpService.js';
import { GovernmentApiService } from './governmentApiService.js';
import { MessagingService } from './messagingService.js';
import { User, IUser } from '../models/User.js';
import { Conversation, IConversation } from '../models/Conversation.js';
import { logger } from '../utils/logger.js';

export interface ChatResponse {
  message: string;
  intent: string;
  confidence: number;
  suggestions?: string[];
  requiresFollowUp?: boolean;
  metadata?: Record<string, any>;
}

export interface UserContext {
  userId: string;
  phoneNumber: string;
  language: 'en' | 'hi';
  location?: {
    state?: string;
    district?: string;
    pincode?: string;
  };
  conversationId?: string;
}

export class ChatbotService {
  private nlpService: NLPService;
  private governmentApiService: GovernmentApiService;
  private messagingService: MessagingService;

  constructor() {
    this.nlpService = new NLPService();
    this.governmentApiService = new GovernmentApiService();
    this.messagingService = new MessagingService();
  }

  /**
   * Process user message and generate response
   */
  async processMessage(userMessage: string, context: UserContext): Promise<ChatResponse> {
    try {
      logger.info(`Processing message from user ${context.phoneNumber}: ${userMessage}`);

      // Get or create user
      const user = await this.getOrCreateUser(context);
      
      // Get or create conversation
      const conversation = await this.getOrCreateConversation(user, context);

      // Process message with NLP
      const nlpResult = await this.nlpService.processMessage(userMessage, context.language);

      // Add user message to conversation
      conversation.messages.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
        intent: nlpResult.intent,
        confidence: nlpResult.confidence
      });

      // Generate enhanced response based on intent
      const enhancedResponse = await this.enhanceResponse(nlpResult, context);

      // Add assistant response to conversation
      conversation.messages.push({
        role: 'assistant',
        content: enhancedResponse.message,
        timestamp: new Date(),
        metadata: enhancedResponse.metadata
      });

      // Update conversation tags
      if (!conversation.tags.includes(nlpResult.category)) {
        conversation.tags.push(nlpResult.category);
      }

      await conversation.save();

      // Update user's last active time
      user.lastActive = new Date();
      await user.save();

      logger.info(`Response generated for user ${context.phoneNumber}, intent: ${nlpResult.intent}`);

      return enhancedResponse;

    } catch (error) {
      logger.error('Error processing message:', error);
      
      const errorMessage = context.language === 'hi'
        ? 'क्षमा करें, मुझे आपके संदेश को समझने में समस्या हुई है। कृपया दोबारा कोशिश करें या यदि यह एक आपातकाल है तो 108 पर कॉल करें।'
        : 'Sorry, I had trouble processing your message. Please try again or call 108 if this is an emergency.';

      return {
        message: errorMessage,
        intent: 'error',
        confidence: 0
      };
    }
  }

  /**
   * Enhance NLP response with additional context and data
   */
  private async enhanceResponse(nlpResult: NLPResult, context: UserContext): Promise<ChatResponse> {
    let enhancedMessage = nlpResult.response;
    let suggestions: string[] = [];
    let requiresFollowUp = false;
    let metadata: Record<string, any> = {};

    // Enhance based on intent category
    switch (nlpResult.category) {
      case 'vaccination':
        enhancedMessage = await this.enhanceVaccinationResponse(nlpResult, context);
        suggestions = this.getVaccinationSuggestions(context.language);
        break;

      case 'symptoms':
        enhancedMessage = await this.enhanceSymptomsResponse(nlpResult, context);
        suggestions = this.getSymptomsSuggestions(context.language);
        requiresFollowUp = true;
        break;

      case 'prevention':
        suggestions = this.getPreventionSuggestions(context.language);
        break;

      case 'emergency':
        // For emergencies, add location-specific emergency numbers
        enhancedMessage = await this.enhanceEmergencyResponse(nlpResult, context);
        break;

      default:
        suggestions = this.getGeneralSuggestions(context.language);
    }

    // Add location-specific health alerts if available
    if (context.location) {
      const alerts = await this.governmentApiService.getHealthAlerts(
        context.location.state,
        context.location.district
      );

      if (alerts.length > 0) {
        const alertMessage = context.language === 'hi'
          ? '\n\n🚨 आपके क्षेत्र में स्वास्थ्य अलर्ट:\n'
          : '\n\n🚨 Health Alerts in Your Area:\n';

        enhancedMessage += alertMessage;
        alerts.slice(0, 2).forEach(alert => {
          enhancedMessage += `• ${alert.title}: ${alert.description}\n`;
        });
      }
    }

    return {
      message: enhancedMessage,
      intent: nlpResult.intent,
      confidence: nlpResult.confidence,
      suggestions,
      requiresFollowUp,
      metadata
    };
  }

  /**
   * Enhance vaccination-related responses
   */
  private async enhanceVaccinationResponse(nlpResult: NLPResult, context: UserContext): Promise<string> {
    let response = nlpResult.response;

    // Add vaccination schedule
    const schedule = this.governmentApiService.getVaccinationSchedule(context.language);
    response += '\n\n' + schedule;

    // If user has location, try to fetch nearby vaccination centers
    if (context.location?.pincode) {
      const today = new Date().toISOString().split('T')[0].split('-').reverse().join('-'); // DD-MM-YYYY format
      const centers = await this.governmentApiService.getVaccinationCentersByPincode(
        context.location.pincode,
        today
      );

      if (centers.length > 0) {
        const centersInfo = this.governmentApiService.formatVaccinationCenters(centers, context.language);
        response += '\n\n' + centersInfo;
      }
    }

    return response;
  }

  /**
   * Enhance symptoms-related responses
   */
  private async enhanceSymptomsResponse(nlpResult: NLPResult, context: UserContext): Promise<string> {
    let response = nlpResult.response;

    // Add COVID stats if relevant
    if (nlpResult.intent.includes('covid')) {
      const covidStats = await this.governmentApiService.getCovidStats();
      if (covidStats) {
        const statsMessage = context.language === 'hi'
          ? `\n\n📊 भारत में वर्तमान कोविड-19 आंकड़े:\n• सक्रिय मामले: ${covidStats.active.toLocaleString()}\n• कुल मामले: ${covidStats.cases.toLocaleString()}\n• ठीक हुए: ${covidStats.recovered.toLocaleString()}`
          : `\n\n📊 Current COVID-19 Stats for India:\n• Active Cases: ${covidStats.active.toLocaleString()}\n• Total Cases: ${covidStats.cases.toLocaleString()}\n• Recovered: ${covidStats.recovered.toLocaleString()}`;
        
        response += statsMessage;
      }
    }

    return response;
  }

  /**
   * Enhance emergency responses with location-specific info
   */
  private async enhanceEmergencyResponse(nlpResult: NLPResult, context: UserContext): Promise<string> {
    let response = nlpResult.response;

    // Add state-specific emergency numbers if available
    if (context.location?.state) {
      const stateEmergencyInfo = this.getStateEmergencyNumbers(context.location.state, context.language);
      if (stateEmergencyInfo) {
        response += '\n\n' + stateEmergencyInfo;
      }
    }

    return response;
  }

  /**
   * Get state-specific emergency numbers
   */
  private getStateEmergencyNumbers(state: string, language: 'en' | 'hi'): string | null {
    const emergencyNumbers: Record<string, { en: string; hi: string }> = {
      'Delhi': {
        en: '🏥 Delhi Emergency Numbers:\n• AIIMS Emergency: 011-26588500\n• Delhi Police: 100\n• Fire Brigade: 101',
        hi: '🏥 दिल्ली आपातकालीन नंबर:\n• एम्स आपातकाल: 011-26588500\n• दिल्ली पुलिस: 100\n• दमकल: 101'
      },
      'Maharashtra': {
        en: '🏥 Maharashtra Emergency Numbers:\n• Mumbai Police: 100\n• Fire Brigade: 101\n• State Helpline: 104',
        hi: '🏥 महाराष्ट्र आपातकालीन नंबर:\n• मुंबई पुलिस: 100\n• दमकल: 101\n• राज्य हेल्पलाइन: 104'
      }
    };

    return emergencyNumbers[state]?.[language] || null;
  }

  /**
   * Get vaccination-related suggestions
   */
  private getVaccinationSuggestions(language: 'en' | 'hi'): string[] {
    return language === 'hi' ? [
      'मेरे पास टीकाकरण केंद्र खोजें',
      'बच्चों के लिए टीका कार्यक्रम',
      'कोविड टीका जानकारी'
    ] : [
      'Find vaccination centers near me',
      'Child vaccination schedule',
      'COVID vaccine information'
    ];
  }

  /**
   * Get symptoms-related suggestions
   */
  private getSymptomsSuggestions(language: 'en' | 'hi'): string[] {
    return language === 'hi' ? [
      'बुखार के लक्षण',
      'डेंगू की जानकारी',
      'कब डॉक्टर से मिलें'
    ] : [
      'Fever symptoms',
      'Dengue information',
      'When to see a doctor'
    ];
  }

  /**
   * Get prevention-related suggestions
   */
  private getPreventionSuggestions(language: 'en' | 'hi'): string[] {
    return language === 'hi' ? [
      'हाथ धोने की सही विधि',
      'मच्छरों से बचाव',
      'स्वस्थ आहार सुझाव'
    ] : [
      'Proper hand washing technique',
      'Mosquito prevention',
      'Healthy diet tips'
    ];
  }

  /**
   * Get general suggestions
   */
  private getGeneralSuggestions(language: 'en' | 'hi'): string[] {
    return language === 'hi' ? [
      'लक्षणों के बारे में पूछें',
      'टीकाकरण की जानकारी',
      'रोकथाम के उपाय'
    ] : [
      'Ask about symptoms',
      'Vaccination information',
      'Prevention measures'
    ];
  }

  /**
   * Get or create user
   */
  private async getOrCreateUser(context: UserContext): Promise<IUser> {
    let user = await User.findOne({ phoneNumber: context.phoneNumber });

    if (!user) {
      user = new User({
        phoneNumber: context.phoneNumber,
        language: context.language,
        location: context.location,
        preferences: {
          receiveAlerts: true,
          preferredTime: '09:00'
        }
      });
      await user.save();
      logger.info(`New user created: ${context.phoneNumber}`);
    } else {
      // Update user language and location if provided
      if (context.language) user.language = context.language;
      if (context.location) user.location = { ...user.location, ...context.location };
      await user.save();
    }

    return user;
  }

  /**
   * Get or create conversation
   */
  private async getOrCreateConversation(user: IUser, context: UserContext): Promise<IConversation> {
    // Look for active conversation in the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    let conversation = await Conversation.findOne({
      userId: user._id,
      status: 'active',
      updatedAt: { $gte: oneDayAgo }
    });

    if (!conversation) {
      conversation = new Conversation({
        userId: user._id,
        phoneNumber: context.phoneNumber,
        language: context.language,
        messages: [],
        status: 'active',
        tags: []
      });
      await conversation.save();
      logger.info(`New conversation created for user: ${context.phoneNumber}`);
    }

    return conversation;
  }

  /**
   * Send message via preferred channel (WhatsApp/SMS)
   */
  async sendMessage(phoneNumber: string, message: string, type: 'whatsapp' | 'sms' = 'whatsapp'): Promise<boolean> {
    return await this.messagingService.sendMessage({
      to: phoneNumber,
      message,
      type
    });
  }

  /**
   * Get conversation history for a user
   */
  async getConversationHistory(phoneNumber: string, limit: number = 10): Promise<IConversation[]> {
    return await Conversation.find({ phoneNumber })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .populate('userId', 'name phoneNumber');
  }
}