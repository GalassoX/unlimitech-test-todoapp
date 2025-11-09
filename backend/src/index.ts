import express from 'express';
import healthRoute from './routes/health.routes';

const app = express();

app.use(express.json());

app.use(healthRoute);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});