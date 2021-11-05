import { json, Router, urlencoded } from 'express';
import { env } from '../config/globals';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morganMiddleware from './morgan-middleware';
import helmet from 'helmet';
import { AuthenticationService } from '../authentication/authentication-service';

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

  // ToDo: get rid of this
  // router.use(authMiddleware);

  // Setup passport strategies
  new AuthenticationService().initStrategies();
}