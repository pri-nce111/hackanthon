import request from 'supertest';
import express from 'express';
import chatRoutes from '../../routes/chatRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/chat', chatRoutes);

describe('Chat Controller', () => {
  describe('POST /api/chat/message', () => {
    it('should process a valid chat message', async () => {
      const response = await request(app)
        .post('/api/chat/message')
        .send({
          message: 'I have fever',
          phoneNumber: '+919999999999',
          language: 'en'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('message');
      expect(response.body.data).toHaveProperty('intent');
      expect(response.body.data).toHaveProperty('confidence');
    });

    it('should reject invalid phone number', async () => {
      const response = await request(app)
        .post('/api/chat/message')
        .send({
          message: 'I have fever',
          phoneNumber: 'invalid-phone',
          language: 'en'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should reject empty message', async () => {
      const response = await request(app)
        .post('/api/chat/message')
        .send({
          message: '',
          phoneNumber: '+919999999999',
          language: 'en'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should handle Hindi language', async () => {
      const response = await request(app)
        .post('/api/chat/message')
        .send({
          message: 'मुझे बुखार है',
          phoneNumber: '+919999999999',
          language: 'hi'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toContain('बुखार');
    });

    it('should process message with location', async () => {
      const response = await request(app)
        .post('/api/chat/message')
        .send({
          message: 'Where can I get vaccinated?',
          phoneNumber: '+919999999999',
          language: 'en',
          location: {
            state: 'Delhi',
            pincode: '110001'
          }
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/chat/history', () => {
    it('should get conversation history', async () => {
      const response = await request(app)
        .get('/api/chat/history')
        .query({
          phoneNumber: '+919999999999',
          limit: 10
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should reject invalid phone number for history', async () => {
      const response = await request(app)
        .get('/api/chat/history')
        .query({
          phoneNumber: 'invalid-phone'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/chat/health', () => {
    it('should return health check', async () => {
      const response = await request(app)
        .get('/api/chat/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('healthy');
    });
  });
});