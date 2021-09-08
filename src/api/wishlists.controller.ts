import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
import { WishlistService } from '../service/wishlist.service';


@Service()
export class WishlistsController {

    public router: Router;

    constructor(
        private readonly wishlistService: WishlistService
    ) {
        this.router = Router();
        this.initRoutes();
    }

    public async listAll(req: Request, res: Response) {
        const wishlists = await this.wishlistService.listAll();
        return res.send(wishlists);
    }

    public async listById(req: Request, res: Response) {
        return res.send(this.wishlistService.listById());
    }

    public async add(req: Request, res: Response) {
        return res.send(this.wishlistService.add());
    }

    public async update(req: Request, res: Response) {
        return res.send(this.wishlistService.update());
    }

    public async delete(req: Request, res: Response) {
        return res.send(this.wishlistService.delete());
    }

    /**
     * Initializes the routes for the controller WishlistsController
     * @private
     */
    private initRoutes() {
        this.router.get('/', (req, res) => this.listAll(req, res));
        this.router.get('/:id', (req, res) => this.listById(req, res));
        this.router.post('/', (req, res) => this.add(req, res));
        this.router.put('/:id', (req, res) => this.update(req, res));
        this.router.delete('/:id', (req, res) => this.delete(req, res));
    }
}