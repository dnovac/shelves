import { Request, Response, Router } from 'express';
import { Inject, Service } from 'typedi';
import logger from '../../config/logger';
import { IWishlist } from '../../model/i-wishlist';
import { WishlistService } from '../../service/wishlist-service';
import { AuthenticationService } from '../../authentication/authentication-service';


@Service()
export class WishlistController {

  public router: Router;

  constructor(
    @Inject()
    private readonly wishlistService: WishlistService,
    @Inject()
    private authService: AuthenticationService
  ) {
    this.router = Router();
    // this.authService = new AuthenticationService();
    this.initRoutes();
  }

  public async findAll(req: Request, res: Response): Promise<void> {
    res.send(await this.wishlistService.findAll());
  }

  public async findById(req: Request, res: Response): Promise<void> {
    const wishlistId: number = parseInt(req.params.id);
    if (!wishlistId) {
      logger.error('missing id when trying to listById');
      throw new Error('Id must be provided in order to fetch an wishlist by id.');
    }
    res.send(await this.wishlistService.findById(wishlistId));
  }

  public async findByUsername(req: Request, res: Response): Promise<void> {
    const username: string = req.params.username;
    res.send(await this.wishlistService.findByUsername(username));
  }

  public async save(req: Request, res: Response): Promise<void> {
    const wishlist: IWishlist = req.body;
    try {
      res.send(await this.wishlistService.save(wishlist));
    } catch (err) {
      logger.error(`Error while trying to save wishlist. Error: ${err}`);
      res.status(500).send('Error while trying to save wishlist.');
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    const wishlistId: number = parseInt(req.params.id);
    if (!wishlistId) {
      throw new Error('An id must be provided in order to update an wishlist');
    }
    const wishlist: IWishlist = req.body;

    res.send(await this.wishlistService.update(wishlistId, wishlist));
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const wishlistId: number = parseInt(req.params.id);
    if (!wishlistId) {
      throw new Error('An id must be provided in order to update an wishlist');
    }
    res.send(await this.wishlistService.delete(wishlistId));
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
    this.router.get('/user/:username',
      this.authService.isAuthorized(),
      (req, res) => this.findByUsername(req, res)
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
