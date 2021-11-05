import { Repository } from 'typeorm';
import { User } from '../../model/User';
import { UserRepository } from '../../repository/user-repository';
import { Container } from 'typedi';
import { Strategy as StrategyJwt } from 'passport-jwt';
import { BasicStrategy } from 'passport-http';

export abstract class BaseStrategy {
  protected readonly userRepo: Repository<User> = Container.get(UserRepository);
  protected _strategy: StrategyJwt | BasicStrategy;

  /**
   *
   * @returns Returns Passport Strategy
   */
  public get strategy(): StrategyJwt | BasicStrategy {
    return this._strategy;
  }

}
