import type { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES } from "@/constants/errorMessages";
import { HttpStatus } from "@/constants/httpStatus";
import { responseError } from "@/lib/apiResponses";
import { z } from "zod";

export function validateRequest(schema: z.ZodObject<any, any>): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        responseError(res, {
          statusCode: HttpStatus.BAD_REQUEST,
          error: ERROR_MESSAGES.INVALID_REQUEST
        });
        return;
      }

      responseError(res, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: ERROR_MESSAGES.GENERIC_ERROR
      });
    }
  }
}