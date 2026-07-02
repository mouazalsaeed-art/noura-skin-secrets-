import express from 'express';
import { authenticate } from '@/middleware/auth';
import {
  createPaymentIntent,
  confirmPayment,
  refundPayment,
} from '@/controllers/paymentController';

const router = express.Router();

router.post('/intent', authenticate, createPaymentIntent);
router.post('/confirm', authenticate, confirmPayment);
router.post('/refund', authenticate, refundPayment);

export default router;
