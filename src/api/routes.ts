import { Request, Response, Router } from 'express';
import { Container } from 'typeorm-typedi-extensions';
import { WishlistController } from './components/wishlist-controller';
import { ItemController } from './components/item-controller';
import { UserController } from './components/user-controller';
import { initMiddlewares } from '../middleware';


/**
 * Init Express REST routes
 *
 * @param {Router} router
 * @returns {void}
 */
export function initApi(router: Router): void {
  const prefix = '/api'; // for versioning /api/v1

  router.get(prefix, (req: Request, res: Response) => res.send('PING'));

  initMiddlewares(router);
  initAPIRoutes(router, prefix);


}

/**
 * Initializes components routes
 * @param {Router} router
 * @param {string} prefix
 */
export function initAPIRoutes(router: Router, prefix = ''): void {
  // Register API routes
  router.use(`${prefix}/wishlists/`, Container.get(WishlistController).router);
  router.use(`${prefix}/items/`, Container.get(ItemController).router);
  router.use(`${prefix}/users/`, Container.get(UserController).router);
}
