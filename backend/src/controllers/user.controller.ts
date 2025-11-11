import { ERROR_MESSAGES } from "@/constants/errorMessages";
import { HttpStatus } from "@/constants/httpStatus";
import { responseError, responseSuccess } from "@/lib/apiResponses";
import { UserModel } from "@/models/user.model";
import type { Request, Response, NextFunction } from "express";

export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = res.locals.userId;

  const user = await UserModel.findById(userId);

  if (!user) {
    responseError(res, {
      statusCode: HttpStatus.UNAUTHORIZED,
      error: ERROR_MESSAGES.ACCOUNT_NOT_FOUND
    });
    return;
  }

  const userInfo = user.toJSON();

  responseSuccess(res, {
    data: { ...userInfo, password: undefined },
  });
}