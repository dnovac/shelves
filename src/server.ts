import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import 'reflect-metadata';
import { createConnection, useContainer } from "typeorm";
import { Container } from 'typeorm-typedi-extensions';
import { ItemsController } from './api/items.controller';
import { UsersController } from './api/users.controller';
import { WishlistsController } from './api/wishlists.controller';
import morganMiddleware from './config/morganMiddleware'
import Logger from "./lib/logger";


// class Server {
//     private app: express.Application;
//
//     private wishlistsController: WishlistsController;
//     private itemsController: ItemsController;
//     private usersController: UsersController;
//
//     constructor() {
//         dotenv.config();
//         this.app = express();
//
//         /** Tell TypeORM to use the container provided by this lib to resolve it's dependencies. */
//         useContainer(Container);
//
//         this.initConfiguration();
//         this.initDatabase();
//         this.initContainersDI();
//         this.initRoutes();
//     }
//
//     private initContainersDI(): void {
//         this.wishlistsController = Container.get(WishlistsController);
//         this.itemsController = Container.get(ItemsController);
//         this.usersController = Container.get(UsersController);
//     }
//
//     /**
//      * Initializes the configuration for the app.
//      * @private
//      */
//     private initConfiguration() {
//         this.app.use(express.json());
//         this.app.use(express.urlencoded({ extended: true }));
//         this.app.use(cookieParser());
//         this.app.use(morganMiddleware);
//     }
//
//     /**
//      * Initializes postgres database
//      * @private
//      */
//     private initDatabase(): void {
//         createConnection()
//             .then(() => {
//                 Logger.info('✅ Database was initialized successfully!');
//             })
//             .catch((err) => {
//                 Logger.error(`Error while initializing database! Error: ${ err }`);
//             });
//     }
//
//     /**
//      * Initializes the routes for the app.
//      * @private
//      */
//     private initRoutes() {
//
//         this.app.get('/', (req, res) => {
//             res.send('Hello World');
//         });
//
//         this.app.use('/api/wishlists/', this.wishlistsController.router);
//         this.app.use('/api/items/', this.itemsController.router);
//         this.app.use('/api/users/', this.usersController.router);
//     }
//
//     /**
//      * Used to start the server
//      */
//     public start(): void {
//         const port = Number(process.env.SERVER_PORT || 8080);
//
//         this.app.listen(port, () => {
//             Logger.debug(`✅ WishlistR server started at http://localhost:${ port }`);
//         });
//     }
// }


// Starts the server
// const server = new Server();
// server.start();


const main = async () => {
    const port = Number(process.env.SERVER_PORT || 8080);
    await dotenv.config();

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(morganMiddleware);

    await useContainer(Container);

    await createConnection()
        .then(async (conn) => {
            Logger.info('✅ Database was initialized successfully!');
            // ToDo: remove it after dev finished
            await conn.synchronize();
        })
        .catch((err) => {
            Logger.error(`Error while initializing database! Error: ${ err }`);
        });


    const wishlistsController = Container.get(WishlistsController);
    const itemsController = Container.get(ItemsController);
    const usersController = Container.get(UsersController);

    // Routes
    app.get('/', (req, res) => {
        res.send('Hello World');
    });
    app.use('/api/wishlists/', wishlistsController.router);
    app.use('/api/items/', itemsController.router);
    app.use('/api/users/', usersController.router);

    // App Init
    app.listen(port, () => {
        Logger.debug(`✅ WishlistR server started at http://localhost:${ port }`);
    });
}

// Start App
main().catch(err => {
    // eslint-disable-next-line no-console
    console.log(`Something very bad happened${err}`);
});