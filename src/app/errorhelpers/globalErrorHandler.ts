import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import AppError from "./AppError";
import { handleZodError } from "./handleZodError";
import { envVars } from "../../config/env";
import status from "http-status";

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode: number = err.statusCode || status.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong!";
  let errorSources: any = [];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err?.code === "P2002") {
    statusCode = status.CONFLICT;
    message = "Duplicate key violation. Record already exists.";
    errorSources = [
      {
        path: err.meta?.target || "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
