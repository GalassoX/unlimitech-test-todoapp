import { getTasks, createTask, updateTask, deleteTask } from '@/controllers/task.controller';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { CONSTANTS } from '@/constants/common';
import { HttpStatus } from '@/constants/httpStatus';
import { responseError, responseSuccess } from '@/lib/apiResponses';
import { TaskModel } from '@/models/task.model';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

jest.mock('@/models/task.model');
jest.mock('@/lib/apiResponses');

describe('Task Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response> & { locals?: any };
  const mockUserId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      params: {},
      query: {},
      body: {},
    };

    res = {
      locals: {
        userId: mockUserId.toString(),
      },
    };
  });

  describe('getTasks', () => {
    it('should retrieve all tasks for a user', async () => {
      const mockTasks = [
        {
          _id: 'task-1',
          title: 'Task 1',
          description: 'Description 1',
          status: 'pending',
          userId: mockUserId,
        },
        {
          _id: 'task-2',
          title: 'Task 2',
          description: 'Description 2',
          status: 'completed',
          userId: mockUserId,
        },
      ];

      (TaskModel.find as jest.Mock).mockResolvedValue(mockTasks);

      await getTasks(req as Request, res as Response);

      expect(TaskModel.find).toHaveBeenCalledWith({ userId: mockUserId.toString() });
      expect(responseSuccess).toHaveBeenCalledWith(res, {
        data: mockTasks,
      });
    });

    it('should retrieve a specific task by id', async () => {
      const taskId = new mongoose.Types.ObjectId();
      req.query = { id: taskId.toString() };

      const mockTask = [
        {
          _id: taskId,
          title: 'Task 1',
          description: 'Description 1',
          status: 'pending',
          userId: mockUserId,
        },
      ];

      (TaskModel.find as jest.Mock).mockResolvedValue(mockTask);

      await getTasks(req as Request, res as Response);

      expect(TaskModel.find).toHaveBeenCalledWith({
        userId: mockUserId.toString(),
        _id: expect.any(mongoose.Types.ObjectId),
      });
      expect(responseSuccess).toHaveBeenCalledWith(res, {
        data: mockTask[0],
      });
    });

    it('should return error if task not found with id query', async () => {
      const taskId = new mongoose.Types.ObjectId();
      req.query = { id: taskId.toString() };

      (TaskModel.find as jest.Mock).mockResolvedValue([]);

      await getTasks(req as Request, res as Response);

      expect(responseError).toHaveBeenCalledWith(res, {
        statusCode: HttpStatus.NOT_FOUND,
        error: ERROR_MESSAGES.TASK_NOT_FOUND,
      });
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Task description',
        status: 'pending',
      };

      req.body = taskData;

      const mockNewTask = {
        _id: 'task-123',
        userId: mockUserId,
        ...taskData,
        toJSON: jest.fn().mockReturnValue({
          _id: 'task-123',
          userId: mockUserId.toString(),
          ...taskData,
        }),
      };

      (TaskModel.create as jest.Mock).mockResolvedValue(mockNewTask);

      await createTask(req as Request, res as Response);

      expect(TaskModel.create).toHaveBeenCalledWith({
        userId: expect.any(mongoose.Types.ObjectId),
        ...taskData,
      });
      expect(responseSuccess).toHaveBeenCalledWith(res, {
        data: mockNewTask.toJSON(),
        message: CONSTANTS.TASK_CREATED_MSG,
      });
    });

    it('should handle errors during task creation', async () => {
      req.body = {
        title: 'New Task',
        description: 'Task description',
        status: 'pending',
      };

      (TaskModel.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(
        createTask(req as Request, res as Response)
      ).rejects.toThrow('Database error');
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const taskId = new mongoose.Types.ObjectId();
      req.params = { id: taskId.toString() };
      req.body = {
        title: 'Updated Task',
        description: 'Updated description',
        status: 'completed',
      };

      const mockUpdatedTask = {
        _id: taskId,
        userId: mockUserId,
        ...req.body,
        updatedAt: new Date(),
        toJSON: jest.fn().mockReturnValue({
          _id: taskId,
          userId: mockUserId.toString(),
          ...req.body,
        }),
      };

      (TaskModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedTask);

      await updateTask(req as Request, res as Response);

      expect(TaskModel.findOneAndUpdate).toHaveBeenCalledWith(
        {
          _id: expect.any(mongoose.Types.ObjectId),
          userId: mockUserId.toString(),
        },
        expect.objectContaining({
          title: 'Updated Task',
          description: 'Updated description',
          status: 'completed',
          updatedAt: expect.any(Date),
        }),
        { new: true }
      );
      expect(responseSuccess).toHaveBeenCalled();
    });

    it('should return error if task id is invalid', async () => {
      req.params = { id: 'invalid-id' };
      req.body = {
        title: 'Updated Task',
        description: 'Updated description',
        status: 'completed',
      };

      await updateTask(req as Request, res as Response);

      expect(responseError).toHaveBeenCalledWith(res, {
        statusCode: HttpStatus.BAD_REQUEST,
        error: ERROR_MESSAGES.INVALID_TASK_ID,
      });
      expect(TaskModel.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it('should return error if task not found', async () => {
      const taskId = new mongoose.Types.ObjectId();
      req.params = { id: taskId.toString() };
      req.body = {
        title: 'Updated Task',
        description: 'Updated description',
        status: 'completed',
      };

      (TaskModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      await updateTask(req as Request, res as Response);

      expect(responseError).toHaveBeenCalledWith(res, {
        statusCode: HttpStatus.NOT_FOUND,
        error: ERROR_MESSAGES.TASK_NOT_FOUND,
      });
    });

    it('should handle database errors gracefully', async () => {
      const taskId = new mongoose.Types.ObjectId();
      req.params = { id: taskId.toString() };
      req.body = {
        title: 'Updated Task',
        description: 'Updated description',
        status: 'completed',
      };

      (TaskModel.findOneAndUpdate as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await updateTask(req as Request, res as Response);

      expect(responseError).toHaveBeenCalledWith(res, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: ERROR_MESSAGES.GENERIC_ERROR,
      });
    });
  });

  describe('deleteTask', () => {
    it('should delete an existing task', async () => {
      const taskId = new mongoose.Types.ObjectId();
      req.params = { id: taskId.toString() };

      const mockDeletedTask = {
        _id: taskId,
        userId: mockUserId,
        title: 'Task to delete',
      };

      (TaskModel.findOneAndDelete as jest.Mock).mockResolvedValue(mockDeletedTask);

      await deleteTask(req as Request, res as Response);

      expect(TaskModel.findOneAndDelete).toHaveBeenCalledWith({
        _id: expect.any(mongoose.Types.ObjectId),
        userId: mockUserId.toString(),
      });
      expect(responseSuccess).toHaveBeenCalledWith(res, {
        message: CONSTANTS.TASK_DELETED_MSG,
      });
    });

    it('should return error if task id is invalid', async () => {
      req.params = { id: 'invalid-id' };

      await deleteTask(req as Request, res as Response);

      expect(responseError).toHaveBeenCalledWith(res, {
        statusCode: HttpStatus.BAD_REQUEST,
        error: ERROR_MESSAGES.INVALID_TASK_ID,
      });
      expect(TaskModel.findOneAndDelete).not.toHaveBeenCalled();
    });

    it('should return error if task not found', async () => {
      const taskId = new mongoose.Types.ObjectId();
      req.params = { id: taskId.toString() };

      (TaskModel.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      await deleteTask(req as Request, res as Response);

      expect(responseError).toHaveBeenCalledWith(res, {
        statusCode: HttpStatus.NOT_FOUND,
        error: ERROR_MESSAGES.TASK_NOT_FOUND,
      });
    });

    it('should handle database errors gracefully', async () => {
      const taskId = new mongoose.Types.ObjectId();
      req.params = { id: taskId.toString() };

      (TaskModel.findOneAndDelete as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await deleteTask(req as Request, res as Response);

      expect(responseError).toHaveBeenCalledWith(res, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: ERROR_MESSAGES.GENERIC_ERROR,
      });
    });
  });
});
