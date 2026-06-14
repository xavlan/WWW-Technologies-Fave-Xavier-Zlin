import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { rateLimiter } from './middleware/rateLimiter.middleware';
import { errorHandler } from './middleware/error.middleware';
import { apiRouter } from './routes';

export function createApp(): Application {
  const app = express();

  if (env.NODE_ENV !== 'test') {
    app.set('trust proxy', 1);
  }

  app.use(helmet());
  app.use(
    cors({
      origin:
        env.NODE_ENV === 'test'
          ? (origin, callback) => {
              if (
                !origin ||
                /^https?:\/\/(localhost|127\.0\.0\.1):3000$/.test(origin)
              ) {
                callback(null, true);
              } else {
                callback(new Error('Not allowed by CORS'));
              }
            }
          : env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '10kb' }));
  app.use(rateLimiter);

  if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: {
        status: 'ok',
        service: 'techinventory-api',
        environment: env.NODE_ENV,
      },
    });
  });

  app.use('/api/v1', apiRouter);

  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        message: 'Route not found',
        code: 'NOT_FOUND',
      },
    });
  });

  app.use(errorHandler);

  return app;
}
