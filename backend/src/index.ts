import express from 'express';
import cookieParser from 'cookie-parser';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes';
import { connectDB } from './config/db';
import { logging } from './middleware/logging';
import { corsMiddleware } from './middleware/cors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(corsMiddleware);
app.use(logging);

app.use(healthRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(taskRoutes);

app.listen(3000, async () => {
  await connectDB();
  console.log('Server is running on http://localhost:3000');
});