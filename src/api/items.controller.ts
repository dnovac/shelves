import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
import { Item } from '../models/Item';
import { ItemService } from '../service/item.service';

@Service()
export class ItemsController {
    public router: Router;

    constructor(private readonly itemService: ItemService) {
        this.router = Router();
        this.initRoutes();
    }

    public async listAll(req: Request, res: Response) {
        return res.send(await this.itemService.listAll());
    }

    public async listById(req: Request, res: Response) {
        const itemId: number = parseInt(req.params.id);
        const item = await this.itemService.listById(itemId);
        return res.send(item);
    }

    public async add(req: Request, res: Response) {
        const item: Item = await this.itemService.add(
            new Item(req.body.title, req.body.url, req.body.imageUrl, req.body.wishlist)
        );
        return res.send(item);
    }

    public async update(req: Request, res: Response) {
        const itemId: number = parseInt(req.params.id);
        const item: Item = new Item(req.body.title, req.body.url, req.body.imageUrl, req.body.wishlist);
        return res.send(await this.itemService.update(itemId, item));
    }

    public async delete(req: Request, res: Response) {
        const itemId: number = parseInt(req.params.id);
        return res.send(this.itemService.delete(itemId));
    }


    private initRoutes() {
        this.router.get('/', (req, res) => this.listAll(req, res));
        this.router.get('/:id', (req, res) => this.listById(req, res));
        this.router.post('/', (req, res) => this.add(req, res));
        this.router.put('/:id', (req, res) => this.update(req, res));
        this.router.delete('/:id', (req, res) => this.delete(req, res));

    }
}