import { Request, Response, Router } from 'express';
import { Inject, Service } from 'typedi';
import authMiddleware from '../../middleware/authentication';
import { IItem } from '../../model/i-item';
import { ItemService } from '../../service/item-service';

@Service()
export class ItemController {
  public router: Router;

  constructor(
    @Inject()
    private readonly itemService: ItemService
  ) {
    this.router = Router();
    this.initRoutes();
  }

  public async findAll(req: Request, res: Response): Promise<void> {
    res.send(await this.itemService.findAll());
  }

  public async findById(req: Request, res: Response): Promise<void> {
    const itemId: number = parseInt(req.params.id);

    res.send(await this.itemService.findById(itemId));
  }

  public async save(req: Request, res: Response): Promise<void> {
    const itemOptions: IItem = req.body;
    const item = await this.itemService.save(
      itemOptions
    );
    res.send(item);
  }

  public async update(req: Request, res: Response): Promise<void> {
    const itemId: number = parseInt(req.params.id);
    if (!itemId) {
      throw new Error('An id must be provided for an update.');
    }
    const item: IItem = req.body;
    res.send(await this.itemService.update(itemId, item));
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const itemId: number = parseInt(req.params.id);
    if (!itemId) {
      throw new Error('An id must be provided for an item deletion.');
    }
    res.send(this.itemService.delete(itemId));
  }


  private initRoutes() {
    this.router.get('/', authMiddleware, (req, res) => this.findAll(req, res));
    this.router.get('/:id', authMiddleware, (req, res) => this.findById(req, res));
    this.router.post('/', authMiddleware, (req, res) => this.save(req, res));
    this.router.put('/:id', authMiddleware, (req, res) => this.update(req, res));
    this.router.delete('/:id', authMiddleware, (req, res) => this.delete(req, res));

  }
}
