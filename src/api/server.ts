import express from 'express';
import { initApi } from './routes';

export class Server {
  private readonly _app: express.Application = express();

  public constructor() {
    initApi(this.app);
  }

  public get app(): express.Application {
    return this._app;
  }
}
