import { ZodError } from "zod";
import status from "http-status";

export const handleZodError = (err: ZodError) => {
  const errorSources = err.issues.map((issue) => {
    // Exclude 'body', 'query', 'params' wrapper names from path for clean UI display
    const filteredPath = issue.path.filter(
      (p) => p !== "body" && p !== "query" && p !== "params"
    );
    const pathString =
      filteredPath.join(".") ||
      (issue.path[issue.path.length - 1] as string) ||
      "";

    return {
      path: pathString,
      message: issue.message,
    };
  });

  const detailedMessage = errorSources
    .map((e) => (e.path ? `${e.path}: ${e.message}` : e.message))
    .join("; ");

  return {
    statusCode: status.BAD_REQUEST,
    message: detailedMessage || "Validation Error",
    errorSources,
  };
};
