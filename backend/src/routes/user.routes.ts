import { getUser } from '@/controllers/user.controller';
import { isAuthenticated } from '@/middleware/isAuthenticated';
import { Router } from 'express';

const router: Router = Router();

router.use(isAuthenticated);

router.get('/api/v1/user', getUser);

export default router;