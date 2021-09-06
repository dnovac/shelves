import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import 'reflect-metadata';
import { createConnection } from "typeorm";
import morganMiddleware from './config/morganMiddleware'
import Logger from "./lib/logger";


class Server {
    private app: express.Application;

    constructor() {
        dotenv.config();
        this.app = express();

        this.initConfiguration();
        this.initDatabase();
        this.initRoutes();
    }

    /**
     * Initializes the configuration for the app.
     * @private
     */
    private initConfiguration() {
        //this.app.set('port', port);
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