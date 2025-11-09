import { Router } from 'express';

const router: Router = Router();

router.post('/api/v1/auth/login', (req, res) => {
  // Lógica de autenticación aquí
  res.json({ message: 'Login successful' });
});

export default router;