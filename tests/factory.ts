import 'reflect-metadata';

// Set env to test
process.env.NODE_ENV = 'test';

// Set env vars from .env file
import { config } from 'dotenv';

config();

import express from 'express';
import supertest from 'supertest';

import { Connection, ConnectionOptions, createConnection, getConnectionOptions, useContainer } from 'typeorm';
import { createServer, Server as HttpServer } from 'http';
import { Server } from '../src/api/server';
import { env } from '../src/config/globals';
import { Container } from 'typeorm-typedi-extensions';

/**
 * TestFactory
 * - Loaded in each unit test
 * - Starts server and DB connection
 */
export class TestFactory {

  private _app: express.Application;
  private _connection: Connection;
  private _server: HttpServer;

  public get app(): supertest.SuperTest<supertest.Test> {
    return supertest(this._app);
  }

  public get connection(): Connection {
    return this._connection;
  }

  public get server(): HttpServer {
    return this._server;
  }

  /**
   * Connect to DB and start server
   */
  public async init(): Promise<void> {
    // DI
    await useContainer(Container);
    // DB connection options
    const connOpts = await getConnectionOptions();
    this._connection = await createConnection({
      ...connOpts,
      database: 'wishlistr', // Todo: Should use another db just for tests?
      synchronize: false,
      logging: false,
    } as ConnectionOptions);
    // App
    this._app = new Server().app;
    this._server = createServer(this._app).listen(env.NODE_PORT);
  }

  /**
   * Close server and DB connection
   */
  public async close(): Promise<void> {
    await this._server.close();
    await this._connection.close();
  }

}
