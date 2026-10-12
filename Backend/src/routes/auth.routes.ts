import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';

const router = Router();


// user auth APIs

router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.loginUser);
router.get('/user/logout', authController.logoutUser);



// food partner auth APIs
router.post('/food-partner/register', authController.registerFoodPartner);
router.post('/food-partner/login', authController.loginFoodPartner);
router.get('/food-partner/logout', authController.logoutFoodPartner);
router.get('/session', authController.getSession);

export default router;