import { ZodError } from "zod";
import status from "http-status";

export const handleZodError = (err: ZodError) => {
  const errorSources = err.issues.map((issue) => {
    return {
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  return {
    statusCode: status.BAD_REQUEST,
    message: "Validation Error",
    errorSources,
  };
};
