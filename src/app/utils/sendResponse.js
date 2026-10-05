export const sendResponse = (res, data) => {
    return res.status(data.statusCode).json({
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        meta: data.meta,
        data: data.data,
    });
};
