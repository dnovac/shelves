import * as bcrypt from 'bcryptjs';
import { Request, Response, Router } from 'express';
import * as jwt from 'jsonwebtoken';
import { Inject, Service } from 'typedi';
import logger from '../../config/logger';
import { UserService } from '../../service/user-service';
import { AuthenticationService } from '../../authentication/authentication-service';

@Service()
export class UserController {
  public readonly router: Router = Router();

  constructor(
    @Inject()
    private readonly userService: UserService,
    @Inject()
    private readonly authService: AuthenticationService,
  ) {
    this.initRoutes();
  }

  public async register(req: Request, res: Response): Promise<Response | void> {
    try {
      // Get user input
      const { username, firstName, lastName, age, email, password } = req.body;

      // Validate user input
      if (!(email && password && username)) {
        res.status(400).send("All input is required");
      }

      // check if user already exist
      // Validate if user already exist in our database
      // todo: username should also be unique
      const alreadyExists = await this.userService.isAlreadyInDb(username);
      if (alreadyExists) {
        return res.status(400).send("User Already Exist. Please Login");
      }

      // Encrypt user password
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Create user in our database
      const { id } = await this.userService.save({
        username,
        firstName,
        lastName,
        age,
        email: email?.toLowerCase(),
        password: encryptedPassword,
      });

      // Create token
      const token = jwt.sign(
        { user_id: id, username },
        process.env.TOKEN_KEY as string,
        {
          expiresIn: process.env.TOKEN_EXPIRATION_TIME,
        }
      );
      // save user token
      //user.token = token;

      // return new user
      return res.status(200).json({ token: token });
    } catch (err) {
      logger.error(err);
      return res.status(500).send(`An error occurred while registering: ${(err as Error).message}`);
    }
  }

  public async login(req: Request, res: Response): Promise<Response | void> {
    try {
      // Get user input
      const { email, password, username } = req.body; // ToDo: username or email - one of em unique, the other deleted;

      // Validate user input
      if (!(email && password && username)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await this.userService.findByEmail(email);

      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        // const token = jwt.sign(
        //   { user_id: user.id, email },
        //   process.env.TOKEN_KEY as string,
        //   {
        //     expiresIn: process.env.TOKEN_EXPIRATION_TIME,
        //   }
        // );
        // Create token
        const token: string = this.authService.createToken(user.id);
        res.status(200).json({ token });
      } else {
        res.status(401).send("Invalid Credentials");
      }
    } catch (err) {
      logger.error(err);
      res.status(500).send('An error occurred');
    }
  }


  /**
   * Initializes the routes for the controller UsersController
   * @private
   */
  private initRoutes(): void {
    this.router.post('/register',
      (req, res) => this.register(req, res));
    this.router.post(
      '/login',
      (req, res) => this.login(req, res));
  }
}
