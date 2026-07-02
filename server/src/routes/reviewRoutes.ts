import express from 'express';
import { authenticate, authorize } from '@/middleware/auth';
import {
  getServiceReviews,
  createReview,
  verifyReview,
  deleteReview,
} from '@/controllers/reviewController';

const router = express.Router();

router.get('/service/:serviceId', getServiceReviews);
router.post('/', authenticate, createReview);
router.patch('/:id/verify', authenticate, authorize(['admin']), verifyReview);
router.delete('/:id', authenticate, authorize(['admin']), deleteReview);

export default router;
