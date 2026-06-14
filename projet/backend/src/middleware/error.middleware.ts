import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ZodError } from 'zod';
import {
  AppError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../utils/errors';

function logError(err: Error): void {
  if (process.env.NODE_ENV === 'production') {
    console.error(
      JSON.stringify({
        level: 'error',
        message: err.message,
        name: err.name,
        timestamp: new Date().toISOString(),
      }),
    );
    return;
  }

  console.error(err);
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code ?? 'APP_ERROR',
        ...(err.details !== undefined && { details: err.details }),
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
    });
    return;
  }

  if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
    res.status(401).json({
      success: false,
      error: {
        message: 'Invalid or expired token',
        code: 'UNAUTHORIZED',
      },
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = err.meta?.target;
      const fields = Array.isArray(target) ? target : target ? [String(target)] : [];
      const isSkuConflict = fields.some((field) => field === 'sku' || field.includes('sku'));

      const conflict = isSkuConflict
        ? new ConflictError('SKU already exists', 'SKU_CONFLICT')
        : new ConflictError('A record with this value already exists', 'CONFLICT');

      res.status(conflict.statusCode).json({
        success: false,
        error: {
          message: conflict.message,
          code: conflict.code ?? 'CONFLICT',
        },
      });
      return;
    }

    if (err.code === 'P2025') {
      const notFound = new NotFoundError();
      res.status(notFound.statusCode).json({
        success: false,
        error: {
          message: notFound.message,
          code: 'NOT_FOUND',
        },
      });
      return;
    }

    if (err.code === 'P2003') {
      const validation = new ValidationError('Invalid reference — check category and related fields');
      res.status(validation.statusCode).json({
        success: false,
        error: {
          message: validation.message,
          code: 'VALIDATION_ERROR',
        },
      });
      return;
    }
  }

  logError(err);

  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
}
