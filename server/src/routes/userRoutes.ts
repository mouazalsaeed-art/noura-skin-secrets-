import express from 'express';
import { authenticate } from '@/middleware/auth';
import {
  register,
  login,
  getProfile,
  updateProfile,
} from '@/controllers/userController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.patch('/profile', authenticate, updateProfile);

export default router;
