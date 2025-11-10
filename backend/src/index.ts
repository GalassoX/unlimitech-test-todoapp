import express from 'express';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import { connectDB } from './config/db';
import { logging } from './middleware/logging';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logging);

app.use(healthRoutes);
app.use(authRoutes);
app.use(taskRoutes);

app.listen(3000, async () => {
  await connectDB();
  console.log('Server is running on http://localhost:3000');
});