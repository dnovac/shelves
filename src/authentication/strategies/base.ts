import { Strategy as StrategyJwt } from 'passport-jwt';
import { BasicStrategy } from 'passport-http';

export abstract class BaseStrategy {
  protected _strategy: StrategyJwt | BasicStrategy;

  /**
   *
   * @returns Returns Passport Strategy
   */
  public get strategy(): StrategyJwt | BasicStrategy {
    return this._strategy;
  }

}
