import { json, Router, urlencoded } from 'express';
import { env } from '../config/globals';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morganMiddleware from './morgan-middleware';
import authMiddleware from './authentication';
import helmet from 'helmet';

/**
 * Init Express App middlewares
 * @param {Router} router
 */
export function registerMiddleware(router: Router): void {
  // Put the Helmet on
  router.use(helmet());

  if (env.NODE_ENV === 'development') {
    router.use(cors({ origin: '*' }));
  } else {
    router.use(cors({ origin: ['http://localhost:4200'] }));
  }

  router.use(json());
  router.use(urlencoded({ extended: true }));
  router.use(cookieParser());
  router.use(morganMiddleware);
  router.use(authMiddleware);
}
