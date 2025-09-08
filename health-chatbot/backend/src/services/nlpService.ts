import natural from 'natural';
import { healthIntents, Intent } from '../nlp/intents/healthIntents.js';
import { logger } from '../utils/logger.js';

export interface NLPResult {
  intent: string;
  confidence: number;
  response: string;
  category: string;
  keywords: string[];
}

export class NLPService {
  private tokenizer: natural.WordTokenizer;
  private stemmer: natural.PorterStemmer;
  private tfidf: natural.TfIdf;

  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
    this.tfidf = new natural.TfIdf();
    this.initializeTfIdf();
  }

  private initializeTfIdf(): void {
    // Initialize TF-IDF with all intent patterns
    healthIntents.forEach(intent => {
      const allPatterns = [...intent.patterns.en, ...intent.patterns.hi];
      allPatterns.forEach(pattern => {
        this.tfidf.addDocument(pattern.toLowerCase());
      });
    });
  }

  private preprocessText(text: string): string[] {
    // Convert to lowercase and tokenize
    const tokens = this.tokenizer.tokenize(text.toLowerCase()) || [];
    
    // Remove stop words and stem
    const stopWords = ['the', 'is', 'are', 'was', 'were', 'i', 'me', 'my', 'you', 'your', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const hindiStopWords = ['है', 'हैं', 'था', 'थे', 'मैं', 'मुझे', 'मेरा', 'आप', 'आपका', 'एक', 'और', 'या', 'लेकिन', 'में', 'पर', 'को', 'के', 'से', 'की'];
    
    const allStopWords = [...stopWords, ...hindiStopWords];
    
    return tokens
      .filter(token => !allStopWords.includes(token) && token.length > 2)
      .map(token => this.stemmer.stem(token));
  }

  private calculateSimilarity(userTokens: string[], patternTokens: string[]): number {
    const userSet = new Set(userTokens);
    const patternSet = new Set(patternTokens);
    
    const intersection = new Set([...userSet].filter(x => patternSet.has(x)));
    const union = new Set([...userSet, ...patternSet]);
    
    return intersection.size / union.size;
  }

  private findBestIntent(userInput: string, language: 'en' | 'hi'): { intent: Intent; confidence: number } | null {
    const userTokens = this.preprocessText(userInput);
    let bestMatch: { intent: Intent; confidence: number } | null = null;
    let highestConfidence = 0;

    for (const intent of healthIntents) {
      const patterns = intent.patterns[language];
      let maxSimilarity = 0;

      // Check pattern similarity
      for (const pattern of patterns) {
        const patternTokens = this.preprocessText(pattern);
        const similarity = this.calculateSimilarity(userTokens, patternTokens);
        maxSimilarity = Math.max(maxSimilarity, similarity);
      }

      // Check keyword matches
      const keywordMatches = intent.keywords.filter(keyword => 
        userInput.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      
      const keywordScore = keywordMatches / intent.keywords.length;
      
      // Combined confidence score
      const confidence = (maxSimilarity * 0.7) + (keywordScore * 0.3);

      if (confidence > highestConfidence && confidence > 0.3) { // Minimum threshold
        highestConfidence = confidence;
        bestMatch = { intent, confidence };
      }
    }

    return bestMatch;
  }

  public async processMessage(userInput: string, language: 'en' | 'hi' = 'en'): Promise<NLPResult> {
    try {
      logger.debug(`Processing message: ${userInput} in language: ${language}`);

      const match = this.findBestIntent(userInput, language);

      if (!match) {
        // Fallback response
        const fallbackResponse = language === 'hi' 
          ? 'मुझे खुशी होगी कि मैं आपकी मदद कर सकूं। कृपया अपने लक्षण, रोकथाम के उपाय, या टीकाकरण के बारे में पूछें। यदि यह एक मेडिकल इमरजेंसी है, तो कृपया तुरंत 108 या 112 पर कॉल करें।'
          : 'I\'d be happy to help you with health-related questions. Please ask about symptoms, prevention measures, or vaccinations. If this is a medical emergency, please call 108 or 112 immediately.';

        return {
          intent: 'fallback',
          confidence: 0,
          response: fallbackResponse,
          category: 'general',
          keywords: []
        };
      }

      const response = match.intent.responses[language][0]; // Get first response
      
      return {
        intent: match.intent.name,
        confidence: match.confidence,
        response,
        category: match.intent.category,
        keywords: match.intent.keywords
      };

    } catch (error) {
      logger.error('Error processing message:', error);
      
      const errorResponse = language === 'hi'
        ? 'क्षमा करें, मुझे आपके संदेश को समझने में समस्या हुई है। कृपया दोबारा कोशिश करें।'
        : 'Sorry, I had trouble understanding your message. Please try again.';

      return {
        intent: 'error',
        confidence: 0,
        response: errorResponse,
        category: 'general',
        keywords: []
      };
    }
  }

  public getAvailableIntents(): Intent[] {
    return healthIntents;
  }

  public getIntentsByCategory(category: string): Intent[] {
    return healthIntents.filter(intent => intent.category === category);
  }
}