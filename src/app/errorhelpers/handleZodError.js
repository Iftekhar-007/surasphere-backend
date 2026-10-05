import status from "http-status";
export const handleZodError = (err) => {
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
