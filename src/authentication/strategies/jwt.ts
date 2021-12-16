import { BaseStrategy } from './base';
import { Strategy, StrategyOptions } from 'passport-jwt';
import { authenticate } from 'passport';
import { Handler, NextFunction, Request, Response } from 'express';
import { User } from '../../model/User';

export class JwtStrategy extends BaseStrategy {
  private readonly strategyOpts: StrategyOptions;


  public constructor(strategyOpts: StrategyOptions) {
    super();
    this.strategyOpts = strategyOpts;
    this._strategy = new Strategy(this.strategyOpts, this.verify)
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
      authenticate('jwt', { session: false }, (err, user: User, info) => {
        // internal error
        if (err) {
          return next(err);
        }
        if (info) {
          switch (info.message) {
            case 'No auth token':
              return res.status(401).json({
                error: 'No jwt provided!'
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

  /**
   * Verify incoming payloads from request -> validation in isAuthorized()
   *
   * @param payload JWT payload
   * @param next Express next
   * @returns
   */
  private async verify(payload: any, next: any): Promise<void> {
    try {
      const user = await this.userRepo.findOne({
        where: {
          id: payload.userID
        }
      });

      if (!user) {
        return next(null, null);
      }

      return next(null, user);
    } catch (err) {
      return next(err);
    }
  }
}
