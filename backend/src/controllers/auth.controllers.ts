import { CONSTANTS } from "@/constants/common";
import { ERROR_MESSAGES } from "@/constants/errorMessages";
import { HttpStatus } from "@/constants/httpStatus";
import { responseError, responseSuccess } from "@/lib/apiResponses";
import { signJwt } from "@/lib/jwt";
import { hashPassword, verifyPassword } from "@/lib/passwordHash";
import { UserModel } from "@/models/user.model";
import type { Request, Response } from "express";

export async function signupController(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  const userExists = await UserModel.findOne({ username });
  
  if (userExists) {
    responseError(res, {
      statusCode: HttpStatus.BAD_REQUEST,
      error: ERROR_MESSAGES.USER_TAKEN
    })
    return;
  }

  const passwordHashed = await hashPassword(password);
  const user = await UserModel.create({ 
    username,
    password: passwordHashed
  });

  const token = signJwt(user.id);
  res.cookie(CONSTANTS.COOKIE_SESSION_NAME, token, {
    httpOnly: true,
    expires: new Date(Date.now() + CONSTANTS.HOUR_IN_MILIS)
  });

  responseSuccess(res, {
    message: CONSTANTS.SIGNUP_SUCCESS_MESSAGE
  });
}

export async function loginController(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });

  if (!user) {
    responseError(res, {
      statusCode: HttpStatus.BAD_REQUEST,
      error: ERROR_MESSAGES.INVALID_CREDENTIALS
    });
    return;
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    responseError(res, {
      statusCode: HttpStatus.BAD_REQUEST,
      error: ERROR_MESSAGES.INVALID_CREDENTIALS
    });
    return;
  }

  const token = signJwt(user.id);
  res.cookie(CONSTANTS.COOKIE_SESSION_NAME, token, { 
    httpOnly: true, 
    expires: new Date(Date.now() + CONSTANTS.HOUR_IN_MILIS)
  });

  responseSuccess(res, {
    message: CONSTANTS.LOGIN_SUCCESS_MESSAGE
  });
}

export async function logoutController(req: Request, res: Response): Promise<void> {
  res.clearCookie(CONSTANTS.COOKIE_SESSION_NAME);

  responseSuccess(res, {
    message: CONSTANTS.LOGOUT_SUCCESS_MESSAGE
  })
}