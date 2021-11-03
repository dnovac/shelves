import express from 'express';
import { initRESTRoutes } from './routes';

export class Server {
  private readonly _app: express.Application = express();

  public constructor() {
    initRESTRoutes(this.app);
  }

  public get app(): express.Application {
    return this._app;
  }
}
