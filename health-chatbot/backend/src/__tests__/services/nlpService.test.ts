import { NLPService } from '../../services/nlpService.js';

describe('NLPService', () => {
  let nlpService: NLPService;

  beforeEach(() => {
    nlpService = new NLPService();
  });

  describe('processMessage', () => {
    it('should identify fever symptoms in English', async () => {
      const result = await nlpService.processMessage('I have high fever and body ache', 'en');
      
      expect(result.intent).toBe('fever_symptoms');
      expect(result.confidence).toBeGreaterThan(0.3);
      expect(result.category).toBe('symptoms');
      expect(result.response).toContain('Fever can have many causes');
    });

    it('should identify fever symptoms in Hindi', async () => {
      const result = await nlpService.processMessage('मुझे बुखार है और शरीर में दर्द है', 'hi');
      
      expect(result.intent).toBe('fever_symptoms');
      expect(result.confidence).toBeGreaterThan(0.3);
      expect(result.category).toBe('symptoms');
      expect(result.response).toContain('बुखार के कई कारण हो सकते हैं');
    });

    it('should identify COVID symptoms', async () => {
      const result = await nlpService.processMessage('I think I have COVID symptoms like cough and fever', 'en');
      
      expect(result.intent).toBe('covid_symptoms');
      expect(result.confidence).toBeGreaterThan(0.3);
      expect(result.category).toBe('symptoms');
      expect(result.response).toContain('COVID-19 symptoms');
    });

    it('should identify vaccination queries', async () => {
      const result = await nlpService.processMessage('When should I get vaccinated?', 'en');
      
      expect(result.intent).toBe('vaccination_schedule');
      expect(result.confidence).toBeGreaterThan(0.3);
      expect(result.category).toBe('vaccination');
      expect(result.response).toContain('vaccination schedule');
    });

    it('should identify dengue symptoms', async () => {
      const result = await nlpService.processMessage('I have high fever and severe headache, could it be dengue?', 'en');
      
      expect(result.intent).toBe('dengue_symptoms');
      expect(result.confidence).toBeGreaterThan(0.3);
      expect(result.category).toBe('symptoms');
      expect(result.response).toContain('Dengue symptoms');
    });

    it('should identify prevention queries', async () => {
      const result = await nlpService.processMessage('How can I prevent diseases?', 'en');
      
      expect(result.intent).toBe('preventive_care');
      expect(result.confidence).toBeGreaterThan(0.3);
      expect(result.category).toBe('prevention');
      expect(result.response).toContain('preventive healthcare');
    });

    it('should identify emergency situations', async () => {
      const result = await nlpService.processMessage('This is a medical emergency, I need urgent help', 'en');
      
      expect(result.intent).toBe('emergency');
      expect(result.confidence).toBeGreaterThan(0.3);
      expect(result.category).toBe('emergency');
      expect(result.response).toContain('MEDICAL EMERGENCY');
    });

    it('should handle unknown queries with fallback', async () => {
      const result = await nlpService.processMessage('What is the weather today?', 'en');
      
      expect(result.intent).toBe('fallback');
      expect(result.confidence).toBe(0);
      expect(result.category).toBe('general');
      expect(result.response).toContain('health-related questions');
    });

    it('should handle empty or invalid input', async () => {
      const result = await nlpService.processMessage('', 'en');
      
      expect(result.intent).toBe('fallback');
      expect(result.confidence).toBe(0);
      expect(result.response).toContain('health-related questions');
    });
  });

  describe('getAvailableIntents', () => {
    it('should return all available intents', () => {
      const intents = nlpService.getAvailableIntents();
      
      expect(intents).toHaveLength(6); // fever, covid, dengue, vaccination, prevention, emergency
      expect(intents.map(i => i.name)).toContain('fever_symptoms');
      expect(intents.map(i => i.name)).toContain('covid_symptoms');
      expect(intents.map(i => i.name)).toContain('vaccination_schedule');
    });
  });

  describe('getIntentsByCategory', () => {
    it('should return intents by symptoms category', () => {
      const symptomsIntents = nlpService.getIntentsByCategory('symptoms');
      
      expect(symptomsIntents.length).toBeGreaterThan(0);
      expect(symptomsIntents.every(intent => intent.category === 'symptoms')).toBe(true);
    });

    it('should return intents by vaccination category', () => {
      const vaccinationIntents = nlpService.getIntentsByCategory('vaccination');
      
      expect(vaccinationIntents.length).toBeGreaterThan(0);
      expect(vaccinationIntents.every(intent => intent.category === 'vaccination')).toBe(true);
    });

    it('should return empty array for non-existent category', () => {
      const nonExistentIntents = nlpService.getIntentsByCategory('non-existent');
      
      expect(nonExistentIntents).toHaveLength(0);
    });
  });
});