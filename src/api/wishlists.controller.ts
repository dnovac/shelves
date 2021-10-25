import { Request, Response, Router } from 'express';
import { Inject, Service } from 'typedi';
import Logger from '../lib/logger';
import authMiddleware from '../middleware/authentication';
import { IWishlist } from '../model/interfaces/wishlist';
import { WishlistService } from '../service/wishlist.service';


@Service()
export class WishlistsController {

    public router: Router;

    constructor(
        @Inject()
        private readonly wishlistService: WishlistService
    ) {
        this.router = Router();
        this.initRoutes();
    }

    public async listAll(req: Request, res: Response) {
        res.send(await this.wishlistService.listAll());
    }

    public async listById(req: Request, res: Response) {
        const wishlistId: number = parseInt(req.params.id);
        if (!wishlistId) {
            Logger.error('missing id when trying to listById');
            throw new Error('Id must be provided in order to fetch an wishlist by id.');
        }
        res.send(await this.wishlistService.listById(wishlistId));
    }

    public async save(req: Request, res: Response) {
        const wishlist: IWishlist = req.body;
        res.send(await this.wishlistService.save(wishlist));
    }

    public async update(req: Request, res: Response) {
        const wishlistId: number = parseInt(req.params.id);
        if (!wishlistId) {
            throw new Error('An id must be provided in order to update an wishlist');
        }
        const wishlist: IWishlist = req.body;

        return res.send(await this.wishlistService.update(wishlistId, wishlist));
    }

    public async delete(req: Request, res: Response) {
        const wishlistId: number = parseInt(req.params.id);
        if (!wishlistId) {
            throw new Error('An id must be provided in order to update an wishlist');
        }
        return res.send(this.wishlistService.delete(wishlistId));
    }


    private initRoutes() {
        this.router.get('/', authMiddleware, (req, res) => this.listAll(req, res));
        this.router.get('/:id', authMiddleware, (req, res) => this.listById(req, res));
        this.router.post('/', authMiddleware, (req, res) => this.save(req, res));
        this.router.put('/:id', authMiddleware, (req, res) => this.update(req, res));
        this.router.delete('/:id', authMiddleware, (req, res) => this.delete(req, res));
    }
}