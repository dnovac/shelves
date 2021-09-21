import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
import Logger from '../lib/logger';
import { User } from '../model/User';
import { Wishlist } from '../model/Wishlist';
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
        const wishlistId: number = parseInt(req.params.id);
        const wishlist = await this.wishlistService.listById(wishlistId);
        return res.send(wishlist);
    }

    public async add(req: Request, res: Response) {
        const title: string = req.body.title;
        if (!title) {
            Logger.warn('Title is null')
            return res.status(400).send('Title should have a value.');
        }
        const wishlist: Wishlist = await this.wishlistService.save(title);
        return res.send(wishlist);
    }

    public async update(req: Request, res: Response) {
        const wishlistId: number = parseInt(req.params.id);
        const title: string = req.body.title;
        const user: User = req.body.user as User;

        if (!title) {
            Logger.warn('Title is null.')
            return res.status(400).send('Title should have a value.');
        }
        const wishlistToInsert: Wishlist = new Wishlist(title, user);

        return res.send(await this.wishlistService.update(wishlistId, wishlistToInsert));
    }

    public async delete(req: Request, res: Response) {
        const wishlistId: number = parseInt(req.params.id);
        return res.send(this.wishlistService.delete(wishlistId));
    }


    private initRoutes() {
        this.router.get('/', (req, res) => this.listAll(req, res));
        this.router.get('/:id', (req, res) => this.listById(req, res));
        this.router.post('/', (req, res) => this.add(req, res));
        this.router.put('/:id', (req, res) => this.update(req, res));
        this.router.delete('/:id', (req, res) => this.delete(req, res));
    }
}