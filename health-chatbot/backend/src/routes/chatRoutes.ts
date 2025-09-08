import express from 'express';
import {
  processMessage,
  getConversationHistory,
  sendMessage,
  healthCheck
} from '../controllers/chatController.js';

const router = express.Router();

// Chat endpoints
router.post('/message', processMessage);
router.get('/history', getConversationHistory);
router.post('/send', sendMessage);
router.get('/health', healthCheck);

export default router;