import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';

const router = Router();


// user auth APIs

router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.loginUser);
router.get('/user/logout', authController.logoutUser);



// video partner auth APIs
router.post('/video-partner/register', authController.registerVideoPartner);
router.post('/video-partner/login', authController.loginVideoPartner);
router.get('/video-partner/logout', authController.logoutVideoPartner);
router.get('/session', authController.getSession);

export default router;