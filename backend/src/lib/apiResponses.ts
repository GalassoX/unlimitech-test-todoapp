import { CONSTANTS } from "@/constants/common";
import { ERROR_MESSAGES } from "@/constants/errorMessages";
import { HttpStatus } from "@/constants/httpStatus";
import type { Response } from "express";

interface StandardResponse {
  statusCode?: number;
  message?: string;
}

interface StandardSuccessResponse<T> extends StandardResponse {
  data?: T;
}

interface StandardErrorResponse extends StandardResponse {
  error: typeof ERROR_MESSAGES.GENERIC_ERROR;
}

export function responseSuccess<T>(res: Response, response: StandardSuccessResponse<T>): void {
  res.status(response.statusCode || HttpStatus.OK).json({
    data: response.data || {},
    message: response.message || "",
  });
}

export function responseError(res: Response, response: StandardErrorResponse): void {
  res.status(response.statusCode || HttpStatus.BAD_REQUEST).json({
    message: CONSTANTS.GENERIC_ERROR,
    error: response.error,
  });
}