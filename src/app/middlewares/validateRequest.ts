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
      req.body = (parsed as any).body ?? req.body;
      req.query = (parsed as any).query ?? req.query;
      req.params = (parsed as any).params ?? req.params;
      return next();
    } catch (error) {
      return next(error);
    }
  };
};
