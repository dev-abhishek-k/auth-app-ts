import type {Response, Request, NextFunction} from 'express';
import {z} from 'zod';
export const validate = (schema: z.ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors= result.error.issues.map((issue) => issue.message);
    return res.status(400).json({
      success: false,
      message: errors.join(', ')
    });
  }

  req.body = result.data;
  next();
};