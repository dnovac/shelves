import * as bcrypt from 'bcryptjs';
import { Request, Response, Router } from 'express';
import * as jwt from 'jsonwebtoken';
import { Inject, Service } from 'typedi';
import { UserService } from '../service/user.service';

@Service()
export class UsersController {
    public router: Router;

    @Inject()
    private readonly userService: UserService

    constructor() {
        this.router = Router();
        this.initRoutes();
    }

    public async register(req: Request, res: Response) {
        try {
            // Get user input
            const { username, firstName, lastName, age, email, password } = req.body;

            // Validate user input
            if (!(email && password && username)) {
                res.status(400).send("All input is required");
            }

            // check if user already exist
            // Validate if user exist in our database
            const oldUser = await this.userService.listByEmail(email);

            if (oldUser) {
                return res.status(409).send("User Already Exist. Please Login");
            }

            //Encrypt user password
            const encryptedPassword = await bcrypt.hash(password, 10);

            // Create user in our database
            const user = await this.userService.save({
                username,
                firstName,
                lastName,
                age,
                email: email?.toLowerCase(),
                password: encryptedPassword,
            });

            // Create token
            const token = jwt.sign(
                { user_id: user.id, email },
                process.env.TOKEN_KEY as string,
                {
                    expiresIn: process.env.TOKEN_EXPIRATION_TIME,
                }
            );
            // save user token
            user.token = token;

            // return new user
            res.status(201).json(user);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
        // Our register logic ends here
        return res.send('Registering');
        //return res.send(await this.userService.listAll());
    }

    public async login(req: Request, res: Response) {
        return res.send('Logginingin');
        //return res.send(await this.userService.listAll());
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
        this.router.post('/register', (req, res) => this.register(req, res));
        this.router.post('/login', (req, res) => this.login(req, res));
        // this.router.get('/', (req, res) => this.listAll(req, res));
        // this.router.get('/:id', (req, res) => this.listById(req, res));
        // this.router.post('/', (req, res) => this.add(req, res));
        // this.router.put('/:id', (req, res) => this.update(req, res));
        // this.router.delete('/:id', (req, res) => this.delete(req, res));
    }
}