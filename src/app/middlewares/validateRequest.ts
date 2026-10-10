import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

export const validateRequest = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      if ((parsed as any).body !== undefined) {
        req.body = (parsed as any).body;
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
};
