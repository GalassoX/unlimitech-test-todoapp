import { CONSTANTS } from '@/constants/common';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { HttpStatus } from '@/constants/httpStatus';
import { responseError } from '@/lib/apiResponses';
import { verifyJwt } from '@/lib/jwt';
import type { NextFunction, Request, Response } from 'express';

export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies[CONSTANTS.COOKIE_SESSION_NAME];
  if (!token) {
    responseError(res, { 
      statusCode: HttpStatus.UNAUTHORIZED,
      error: ERROR_MESSAGES.UNAUTHORIZED
    });
    return;
  }

  try {
    const decode = verifyJwt(token);
    res.locals.userId = decode.userId;
    next();
  } catch (error) {
    responseError(res, { 
      statusCode: HttpStatus.BAD_REQUEST,
      error: ERROR_MESSAGES.INVALID_TOKEN
    });
  }
}