import { config } from 'dotenv';
import express from 'express';
import 'reflect-metadata';
import { Connection, createConnection, useContainer } from "typeorm";
import { Container } from 'typeorm-typedi-extensions';
import logger from "./config/logger";
import { Server } from './api/server';
import { createServer, Server as HttpServer } from 'http';
import { env } from './config/globals';

config();

// StartUp
(async function main() {
  try {
    // DI
    await useContainer(Container);

    // DB connection
    logger.info('Initializing ORM connection...');
    const connection: Connection = await createConnection();

    // Init express server
    const app: express.Application = new Server().app;
    const server: HttpServer = createServer(app);

    // Start express server
    server.listen(env.NODE_PORT)

    server.on('listening', () => {
      logger.info(`✅ WishlistR server is listening on port: ${env.NODE_PORT} in ${env.NODE_ENV} mode.`);
    })

    server.on('close', () => {
      connection.close().then(() => logger.info('DB connection closed.'));
      logger.info('Node server closed.');
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Something very bad happened!\n ${err}`)
  }
})();
