import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import 'reflect-metadata';
import { createConnection, useContainer } from "typeorm";
import { Container } from 'typeorm-typedi-extensions';
import { ItemsController } from './api/items.controller';
import { UserController } from './api/user-controller';
import { WishlistsController } from './api/wishlists.controller';
import morganMiddleware from './config/morganMiddleware'
import Logger from "./lib/logger";

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
            // ToDo: remove it after prod and use migration scripts;
            await conn.synchronize();
        })
        .catch((err) => {
            Logger.error(`Error while initializing database! Error: ${ err }`);
        });


    const wishlistsController = Container.get(WishlistsController);
    const itemsController = Container.get(ItemsController);
    const usersController = Container.get(UserController);

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
    console.log(`Something very bad happened ${err}`);
});
