import express from 'express';
import { authenticate, authorize } from '@/middleware/auth';
import {
  getAllServices,
  getServiceById,
  searchServices,
  createService,
  updateService,
  deleteService,
} from '@/controllers/serviceController';

const router = express.Router();

router.get('/', getAllServices);
router.get('/search', searchServices);
router.get('/:id', getServiceById);
router.post('/', authenticate, authorize(['admin']), createService);
router.patch('/:id', authenticate, authorize(['admin']), updateService);
router.delete('/:id', authenticate, authorize(['admin']), deleteService);

export default router;
