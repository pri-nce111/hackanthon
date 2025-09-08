import express from 'express';
import {
  getDashboardStats,
  getUsers,
  getConversations,
  createHealthAlert,
  getHealthAlerts,
  updateHealthAlert,
  getMessagingStatus
} from '../controllers/adminController.js';

const router = express.Router();

// Admin dashboard endpoints
router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.get('/conversations', getConversations);

// Health alerts management
router.post('/alerts', createHealthAlert);
router.get('/alerts', getHealthAlerts);
router.put('/alerts/:id', updateHealthAlert);

// System status
router.get('/messaging-status', getMessagingStatus);

export default router;