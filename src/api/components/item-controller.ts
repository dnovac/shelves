import logger from '../../config/logger';
import { Request, Response, Router } from 'express';
import { Inject, Service } from 'typedi';
import { IItem } from '../../model/i-item';
import { ItemService } from '../../service/item-service';
import { AuthenticationService } from '../../authentication/authentication-service';

@Service()
export class ItemController {
  public router: Router;

  constructor(
    @Inject()
    private readonly itemService: ItemService,
    @Inject()
    private authService: AuthenticationService,
  ) {
    this.router = Router();
    this.initRoutes();
  }

  public async findAll(req: Request, res: Response): Promise<void> {
    res.send(await this.itemService.findAll());
  }

  public async findById(req: Request, res: Response): Promise<void> {
    const itemId: number = parseInt(req.params.id);
    const item: IItem | undefined = await this.itemService.findById(itemId);
    if (item) {
      res.status(200).send(item);
    }
    res.status(404).send(item);
  }

  public async findByCollectionId(req: Request, res: Response): Promise<void> {
    try {
      const collectionId: number = parseInt(req.params.id);
      const items = await this.itemService.findByCollectionId(collectionId);

      res.status(200).send(items ? items : []);
    } catch (err) {
      res.status(500).send(`Error while trying to fetch items for collection ${req.params.id}.`);
    }
  }

  public async save(req: Request, res: Response): Promise<void> {
    const itemOptions: IItem = req.body;

    // TODO: validate body with lib
    if (!req.body.title || req.body.title === '') {
      res.status(400).send('Title field is mandatory.');
      return;
    }

    try {
      res.send(await this.itemService.save(
        itemOptions
      ));
    } catch (e) {
      logger.error(`An error occurred while trying to save an item. Error: ${e}`);
      res.status(500).send((e as Error).message);
    }
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
    try {
      res.send(await this.itemService.delete(itemId));
    } catch (e) {
      logger.error(`An error occurred while deleting an item. ${e}`);
      res.status(500).send((e as Error).message);
    }
  }


  private initRoutes() {
    this.router.get('/',
      this.authService.isAuthorized(),
      (req, res) => this.findAll(req, res)
    );
    this.router.get('/:id',
      this.authService.isAuthorized(),
      (req, res) => this.findById(req, res)
    );
    this.router.get('/collection/:id',
      this.authService.isAuthorized(),
      (req, res) => this.findByCollectionId(req, res)
    );
    this.router.post('/',
      this.authService.isAuthorized(),
      (req, res) => this.save(req, res)
    );
    this.router.put('/:id',
      this.authService.isAuthorized(),
      (req, res) => this.update(req, res)
    );
    this.router.delete('/:id',
      this.authService.isAuthorized(),
      (req, res) => this.delete(req, res)
    );
  }
}
