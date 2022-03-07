import { BaseStrategy } from './base';
import { Strategy, StrategyOptions } from 'passport-jwt';
import passport from 'passport';
import { Handler, NextFunction, Request, Response } from 'express';
import { User } from '../../model/User';
import { UserService } from '../../service/user-service';

export class JwtStrategy extends BaseStrategy {
  private readonly strategyOpts: StrategyOptions;

  public constructor(
    strategyOpts: StrategyOptions,
    private readonly userService: UserService,
  ) {
    super();
    this.strategyOpts = strategyOpts;
    this._strategy = new Strategy(this.strategyOpts, async (payload, next) => {
      // Verify incoming payloads from request -> validation in isAuthorized()
      // payload - JWT payload
      try {
        const user = await this.userService.findById(payload.userID);

        if (!user) {
          return next(null, null);
        }

        return next(null, user);
      } catch (err) {
        return next(err);
      }
    });
  }

  /**
   * Middleware for checking if a user is authorized to access the endpoint
   *
   * @param req Express request
   * @param res Express response
   * @param next Express next
   * @returns Returns if user is authorized
   */
  public isAuthorized(req: Request, res: Response, next: NextFunction): Handler | void {
    try {
      passport.authenticate('jwt', { session: false }, (err, user: User, info) => {
        // internal error
        if (err) {
          return next(err);
        }
        if (info) {
          switch (info.message) {
            case 'No auth token':
              return res.status(401).json({
                error: 'No JWT provided for Authorization!'
              });

            case 'jwt expired':
              return res.status(401).json({
                error: 'Jwt expired!'
              });
            default:
              return res.status(403).json({
                error: 'Token not ok! Forbidden.'
              })
          }
        }

        if (!user) {
          return res.status(401).json({
            error: 'User is not authorized!'
          });
        }

        // success - store user in req scope
        req.user = user;

        return next();
      })(req, res, next);
    } catch (err) {
      return next(err);
    }
  }

}
