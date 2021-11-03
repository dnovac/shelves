// // Set env to test
// import express from 'express';
//
// import { config } from 'dotenv';
// import { Connection, ConnectionOptions, createConnection } from 'typeorm';
// import { createServer, Server as HttpServer } from 'http';
// import supertest from 'supertest';
//
// // Set env variables from .env file
// process.env.NODE_ENV = 'test';
// config();
//
// /**
//  * TestFactory
//  * - Loaded in each unit test
//  * - Starts server and DB connection
//  */
// export class TestFactory {
//
//   private app: express.Application;
//   private connection: Connection;
//   private server: HttpServer;
//
//   // DB connection options
//   private options: ConnectionOptions = {
//     type: 'postgres',
//     database: new Uint8Array(),
//     location: 'database',
//     logging: false,
//     synchronize: true,
//     entities: ['dist/model/*.js']
//   };
//
//   public get app(): supertest.SuperTest<supertest.Test> {
//     return supertest(this.app);
//   }
//
//   public get connection(): Connection {
//     return this.connection;
//   }
//
//   public get server(): HttpServer {
//     return this.server;
//   }
//
//   /**
//    * Connect to DB and start server
//    */
//   public async init(): Promise<void> {
//     this.connection = await createConnection(this.options);
//     this.app = new Server().;
//     this.server = createServer(this.app).listen(process.env.NODE_PORT);
//   }
//
//   /**
//    * Close server and DB connection
//    */
//   public async close(): Promise<void> {
//     this._server.close();
//     this._connection.close();
//   }
// }
