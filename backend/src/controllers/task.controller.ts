import { CONSTANTS } from "@/constants/common";
import { ERROR_MESSAGES } from "@/constants/errorMessages";
import { HttpStatus } from "@/constants/httpStatus";
import { responseError, responseSuccess } from "@/lib/apiResponses";
import { TaskModel } from "@/models/task.model";
import type { Request, Response } from "express";
import mongoose, { isValidObjectId } from "mongoose";

export async function getTasks(req: Request, res: Response): Promise<void> {
  const userId: string = res.locals.userId;
  const { id } = req.query;

  const filter = isValidObjectId(id) 
    ? { userId, _id: new mongoose.Types.ObjectId(id as string) }
    : { userId };
  const tasks = await TaskModel.find(filter);

  responseSuccess(res, { data: tasks });
}

export async function createTask(req: Request, res: Response): Promise<void> {
  const { title, description, dueDate, status } = req.body;

  const newTask = await TaskModel.create({
    userId: new mongoose.Types.ObjectId(res.locals.userId as string),
    title,
    description,
    dueDate,
    status
  });

  responseSuccess(res, { 
    data: newTask.toJSON(),
    message: CONSTANTS.TASK_CREATED_MSG
  });
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { title, description, dueDate, status } = req.body;  

  if (!isValidObjectId(id)) {
    responseError(res, {
      statusCode: HttpStatus.BAD_REQUEST,
      error: ERROR_MESSAGES.INVALID_TASK_ID
    });
    return;
  }

  try {
    const userId: string = res.locals.userId;
    const taskId = new mongoose.Types.ObjectId(id);
    const filter = {
      _id: taskId,
      userId
    }
    const taskNewData = {
      title,
      description,
      dueDate,
      status,
      updatedAt: new Date()
    };

    const taskUpdated = await TaskModel.findOneAndUpdate(filter, taskNewData, { new: true });

    if (!taskUpdated) {
      responseError(res, {
        statusCode: HttpStatus.NOT_FOUND,
        error: ERROR_MESSAGES.TASK_NOT_FOUND
      });
      return;
    }

    responseSuccess(res, {
      message: 'Create a task with id: ' + taskId.toHexString(),
      data: taskUpdated?.toJSON()
    });
  } catch (error) {
    console.log(error);
    responseError(res, {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: ERROR_MESSAGES.GENERIC_ERROR
    });    
  }
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    responseError(res, {
      statusCode: HttpStatus.BAD_REQUEST,
      error: ERROR_MESSAGES.INVALID_TASK_ID
    });
    return;
  }

  try {
    const userId: string = res.locals.userId;
    const taskId = new mongoose.Types.ObjectId(id);
    const task = await TaskModel.findOneAndDelete({
      _id: taskId,
      userId
    });
    
    if (!task) {
      responseError(res, {
        statusCode: HttpStatus.NOT_FOUND,
        error: ERROR_MESSAGES.TASK_NOT_FOUND
      });
      return;
    }

    responseSuccess(res, { message: CONSTANTS.TASK_DELETED_MSG });
  } catch (error) {
    responseError(res, {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: ERROR_MESSAGES.GENERIC_ERROR
    });
  }
}