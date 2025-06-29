// src/routes/index.ts
import { Router } from 'express';
import * as usersController from '../controllers/usersController';
import * as authController from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/auth/register', usersController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authenticateToken, authController.logout);

export { router };