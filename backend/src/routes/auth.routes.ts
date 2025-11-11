import { loginController, logoutController, signupController } from '@/controllers/auth.controllers';
import { isAuthenticated } from '@/middleware/isAuthenticated';
import { validateRequest } from '@/middleware/validateRequest';
import { Router } from 'express';
import { z } from 'zod';

const router: Router = Router();

const userSignupSchema = z.object({
  username: z.string().min(1, 'username is required'),
  password: z.string().min(8, 'password must be at least 8 characters long'),
});

router.post('/api/v1/auth/signup', validateRequest(userSignupSchema), signupController);

const userLoginSchema = z.object({
  username: z.string().min(1, 'username is required'),
  password: z.string().min(1, 'password is required'),
});

router.post('/api/v1/auth/login', validateRequest(userLoginSchema), loginController);

router.post('/api/v1/auth/logout', isAuthenticated, logoutController);

export default router;