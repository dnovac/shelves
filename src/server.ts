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


class Server {
    private app: express.Application;

    private wishlistsController: WishlistsController;
    private itemsController: ItemsController;
    private usersController: UsersController;

    constructor() {
        dotenv.config();
        this.app = express();

        this.initConfiguration();
        this.initDatabase();
        /** Tell TypeORM to use the container provided by this lib to resolve it's dependencies. */
        useContainer(Container);
        this.initContainersDI();

        this.initRoutes();
    }

    private initContainersDI(): void {
        this.wishlistsController = Container.get(WishlistsController);
        this.itemsController = Container.get(ItemsController);
        this.usersController = Container.get(UsersController);
    }

    /**
     * Initializes the configuration for the app.
     * @private
     */
    private initConfiguration() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(morganMiddleware);
    }

    /**
     * Initializes postgres database
     * @private
     */
    private initDatabase(): void {
        createConnection()
            .then(() => {
                Logger.info('✅ Database was initialized successfully!');
            })
            .catch((err) => {
                Logger.error(`Error while initializing database! Error: ${ err }`);
            });
    }

    /**
     * Initializes the routes for the app.
     * @private
     */
    private initRoutes() {

        this.app.get('/', (req, res) => {
            res.send('Hello World');
        });

        this.app.use('/api/wishlists/', this.wishlistsController.router);
        this.app.use('/api/items/', this.itemsController.router);
        this.app.use('/api/users/', this.usersController.router);
    }

    /**
     * Used to start the server
     */
    public start(): void {
        const port = Number(process.env.SERVER_PORT || 8080);

        this.app.listen(port, () => {
            Logger.debug(`✅ WishlistR server started at http://localhost:${ port }`);
        });
    }
}


// Starts the server
const server = new Server();
server.start();