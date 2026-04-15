import type { IApiError } from "../types/api-error.type.ts";
import { HTTP_STATUS } from "../constants/http_status";
export class ApiError extends Error implements IApiError {
  success: false;
  message: string;
  statusCode: number;
  errors?: Record<string, any> | undefined;
  stack?: string;

  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, any>,
    stack?: string
  ) {
    super(message);

    this.success = false;
    this.message = message;
    this.statusCode = statusCode;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }


  static badRequest(message = "Bad Request", errors?: Record<string, any>) {
    return new ApiError(HTTP_STATUS.BAD_REQUEST, message, errors);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(HTTP_STATUS.UNAUTHORIZED, message);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(HTTP_STATUS.FORBIDDEN, message);
  }

  static notFound(message = "Not Found") {
    return new ApiError(HTTP_STATUS.NOT_FOUND, message);
  }

  static conflict(message = "Conflict") {
    return new ApiError(HTTP_STATUS.CONFLICT, message);
  }

  static internal(message = "Internal Server Error") {
    return new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
  }
}