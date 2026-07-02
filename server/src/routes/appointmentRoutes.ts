import express from 'express';
import { authenticate, authorize } from '@/middleware/auth';
import {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  confirmAppointment,
  completeAppointment,
} from '@/controllers/appointmentController';

const router = express.Router();

router.get('/', authenticate, getAllAppointments);
router.post('/', authenticate, createAppointment);
router.patch('/:id', authenticate, updateAppointment);
router.delete('/:id', authenticate, cancelAppointment);
router.patch('/:id/confirm', authenticate, authorize(['admin']), confirmAppointment);
router.patch('/:id/complete', authenticate, authorize(['admin']), completeAppointment);

export default router;
