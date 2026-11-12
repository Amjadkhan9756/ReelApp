import { Router } from 'express';
import { getVideoPartnerById } from '../controllers/video-partner.controller.js';

/* /api/video-partner/:id */
const router = Router();
router.get('/:id', getVideoPartnerById);

export default router;