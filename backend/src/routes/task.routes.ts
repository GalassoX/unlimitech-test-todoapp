import { createTask, deleteTask, getTasks, updateTask } from "@/controllers/task.controller";
import { isAuthenticated } from "@/middleware/isAuthenticated";
import { validateRequest } from "@/middleware/validateRequest";
import { Router } from "express";
import { z } from "zod";

const router: Router = Router();

router.use(isAuthenticated);

router.get('/api/v1/tasks', getTasks);

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.boolean().optional(),
});

router.post('/api/v1/tasks', validateRequest(createTaskSchema), createTask);

const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.boolean().optional(),
});

router.put('/api/v1/tasks/:id', validateRequest(updateTaskSchema), updateTask);

router.delete('/api/v1/tasks/:id', deleteTask);

export default router;