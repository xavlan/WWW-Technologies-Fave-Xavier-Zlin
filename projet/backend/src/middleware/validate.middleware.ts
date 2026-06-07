import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors';

type RequestProperty = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, property: RequestProperty = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      next(
        new ValidationError('Validation failed', result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }))),
      );
      return;
    }

    req[property] = result.data;
    next();
  };
}
