import { JwtStrategy } from './strategies/jwt';
import { ExtractJwt, StrategyOptions } from 'passport-jwt';
import { sign, SignOptions } from 'jsonwebtoken';
import passport from 'passport';
import { Handler, NextFunction, Request, Response } from 'express';
import { Container, Service } from 'typedi';
import { UserService } from '../service/user-service';

export type PassportStrategy = 'jwt';

@Service()
export class AuthenticationService {
  private readonly defaultStrategy: PassportStrategy;
  private jwtStrategy: JwtStrategy;


  private readonly strategyOpts: StrategyOptions = {
    audience: 'shelves-api-client',
    issuer: 'shelves-api',
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.TOKEN_KEY,
  }

  // JWT opts
  private readonly signOpts: SignOptions = {
    audience: this.strategyOpts.audience,
    expiresIn: process.env.TOKEN_EXPIRATION_TIME,
    issuer: this.strategyOpts.issuer
  }


  public constructor(userService: UserService, defaultStrategy: PassportStrategy = 'jwt') {
    this.defaultStrategy = defaultStrategy;
    this.jwtStrategy = new JwtStrategy(this.strategyOpts, Container.get(UserService));
  }

  /**
   * Create JWT
   *
   * @param userID Used for JWT payload
   * @returns JWT
   */
  public createToken(userID: number): string {
    return sign({ userID }, this.strategyOpts.secretOrKey as string, this.signOpts);
  }

  /**
   * Init passport strategies
   *
   */
  public initStrategies(): void {
    passport.use('jwt', this.jwtStrategy.strategy);
  }

  /**
   * Setup target passport authorization
   *
   * @param strategy Passport strategy
   * @returns Returns if user is authorized
   */
  public isAuthorized(strategy?: PassportStrategy): Handler {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (process.env.NODE_ENV !== 'test') {
          // if no strategy is provided use default strategy
          const tempStrategy: PassportStrategy = strategy || this.defaultStrategy;
          return this.doAuthentication(req, res, next, tempStrategy);
        }

        return next();
      } catch (err) {
        return next(err);
      }
    };
  }

  /**
   * Executes the target passport authorization
   *
   * @param req Express request
   * @param res Express response
   * @param next Express next
   * @param strategy Passport strategy name
   * @returns Returns if user is authorized
   */
  private doAuthentication(
    req: Request,
    res: Response,
    next: NextFunction,
    strategy: PassportStrategy
  ): Handler | void {
    try {
      switch (strategy) {
        case 'jwt':
          return this.jwtStrategy.isAuthorized(req, res, next);
        default:
          throw new Error(`Unknown passport strategy: ${strategy}`);
      }
    } catch (err) {
      return next(err);
    }
  }

}
