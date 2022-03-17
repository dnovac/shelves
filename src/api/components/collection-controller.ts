import { Request, Response, Router } from 'express';
import { Inject, Service } from 'typedi';
import logger from '../../config/logger';
import { ICollection } from '../../model/i-collection';
import { CollectionService } from '../../service/collection-service';
import { AuthenticationService } from '../../authentication/authentication-service';


@Service()
export class CollectionController {

  public router: Router;

  constructor(
    @Inject()
    private readonly collectionService: CollectionService,
    @Inject()
    private authService: AuthenticationService
  ) {
    this.router = Router();
    this.initRoutes();
  }

  public async findAll(req: Request, res: Response): Promise<void> {
    res.send(await this.collectionService.findAll());
  }

  public async findById(req: Request, res: Response): Promise<void> {
    const collectionId: number = parseInt(req.params.id);
    if (!collectionId) {
      logger.error('missing id when trying to listById');
      throw new Error('Id must be provided in order to fetch an collection by id.');
    }
    res.send(await this.collectionService.findById(collectionId));
  }

  public async findByUserId(req: Request, res: Response): Promise<void> {
    const userId: string = req.params.id;
    res.send(await this.collectionService.findByUserId(parseInt(userId)));
  }

  public async save(req: Request, res: Response): Promise<void> {
    const collection: ICollection = req.body;
    try {
      res.send(await this.collectionService.save(collection));
    } catch (err) {
      logger.error(`Error while trying to save collection. Error: ${err}`);
      res.status(500).send('Error while trying to save collection.');
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    const collectionId: number = parseInt(req.params.id);
    if (!collectionId) {
      throw new Error('An id must be provided in order to update a collection.');
    }
    const collection: ICollection = req.body;

    res.send(await this.collectionService.update(collectionId, collection));
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const collectionId: number = parseInt(req.params.id);
    if (!collectionId) {
      throw new Error('An id must be provided in order to update a collection.');
    }
    res.send(await this.collectionService.delete(collectionId));
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
    this.router.get('/user/:id',
      this.authService.isAuthorized(),
      (req, res) => this.findByUserId(req, res)
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
