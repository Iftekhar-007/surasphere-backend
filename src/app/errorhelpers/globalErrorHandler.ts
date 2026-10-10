import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import AppError from "./AppError";
import { handleZodError } from "./handleZodError";
import { envVars } from "../../config/env";
import status from "http-status";

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode: number = err.statusCode || status.INTERNAL_SERVER_ERROR;
  let message = err.message || "An unexpected error occurred. Please try again.";
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
  } else if (err?.name === "MulterError") {
    statusCode = status.BAD_REQUEST;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File is too large. Maximum allowed size is 20MB.";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      message = `Unexpected file field "${err.field || "file"}".`;
    } else {
      message = err.message || "File upload error.";
    }
    errorSources = [
      {
        path: err.field || "file",
        message,
      },
    ];
  } else if (err?.code === "P2002") {
    statusCode = status.CONFLICT;
    const target = Array.isArray(err.meta?.target)
      ? err.meta.target.join(", ")
      : err.meta?.target || "field";
    message = `A record with this ${target} already exists.`;
    errorSources = [
      {
        path: target,
        message,
      },
    ];
  } else if (err?.code === "P2025") {
    statusCode = status.NOT_FOUND;
    message =
      (err.meta?.cause as string) ||
      "The requested record was not found.";
    errorSources = [
      {
        path: "",
        message,
      },
    ];
  } else if (err?.code === "P2003") {
    statusCode = status.BAD_REQUEST;
    message = "Foreign key reference failed. Related record does not exist.";
    errorSources = [
      {
        path: (err.meta?.field_name as string) || "",
        message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message || "Something went wrong!";
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
