import * as bcrypt from 'bcryptjs';
import { NextFunction, Request, Response, Router } from 'express';
import * as jwt from 'jsonwebtoken';
import { Inject, Service } from 'typedi';
import logger from '../../config/logger';
import { UserService } from '../../service/user-service';
import { AuthenticationService } from '../../authentication/authentication-service';
import { body } from 'express-validator';

@Service()
export class UserController {
  public router: Router;
  private readonly authService: AuthenticationService = new AuthenticationService(); // todo can be DI'd

  constructor(
    @Inject()
    private readonly userService: UserService
  ) {
    this.router = Router();
    this.initRoutes();
  }

  public async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
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
        res.status(400).send("User Already Exist. Please Login");
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
        { user_id: id, email },
        process.env.TOKEN_KEY as string,
        {
          expiresIn: process.env.TOKEN_EXPIRATION_TIME,
        }
      );
      // save user token
      //user.token = token;

      // return new user
      res.status(200).json({ token: token });
    } catch (err) {
      logger.error(err);
      res.status(500).send('An error occurred');
      return next(err);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
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
      return next(err);
    }
  }


  /**
   * Initializes the routes for the controller UsersController
   * @private
   */
  private initRoutes() {
    this.router.post(
      '/register',  // ToDo: this can also be /register/:uuid generated from FE.
      body('email').isEmail(),
      body('password').isString(),
      body('username').isString(),
      this.authService.validateRequest,
      this.register
    );
    this.router.post(
      '/login',
      body('email').isEmail(),
      body('password').isString(),
      body('username').isString(),
      this.authService.validateRequest,
      this.login
    );
  }
}
