import { Response } from "express";
import { IApiResponse } from "../types";

export const sendResponse = <T>(res: Response, data: IApiResponse<T>) => {
  return res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    meta: data.meta,
    data: data.data,
  });
};
