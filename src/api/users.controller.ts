import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
import { UserService } from '../service/user.service';

@Service()
export class UsersController {
    public router: Router;

    constructor(public readonly userService: UserService) {
        this.router = Router();
        this.initRoutes();
    }

    public async listAll(req: Request, res: Response) {
        return res.send(await this.userService.listAll());
    }

    public async listById(req: Request, res: Response) {
        return res.send("listbyid");
    }

    public async add(req: Request, res: Response) {
        return res.send("add");
    }

    public async update(req: Request, res: Response) {
        return res.send("update");
    }

    public async delete(req: Request, res: Response) {
        return res.send("delete");
    }

    /**
     * Initializes the routes for the controller UsersController
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