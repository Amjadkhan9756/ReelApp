import { Router } from 'express';
import { getFoodPartnerById } from '../controllers/food-partner.controller.js';

/* /api/food-partner/:id */
const router = Router();
router.get('/:id', getFoodPartnerById);

export default router;