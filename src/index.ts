import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import 'reflect-metadata';
import morganMiddleware from './config/morganMiddleware'
import { initializeDB } from "./db";
import Logger from "./lib/logger";


// initialize configuration
dotenv.config();
const port = Number(process.env.SERVER_PORT || 8080);

initializeDB()
    .then(() => {
        // eslint-disable-next-line no-console
        Logger.info('✅ Database was initialized successfully!');
    })
    .catch((err) => {
        // eslint-disable-next-line no-console
        Logger.error(`Error while initializing database! Error: ${err}`);
    });

// App
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morganMiddleware);


//app.use('/api', BaseRouter);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    Logger.debug(`✅ WishlistR server started at http://localhost:${port}`);
});
// push the dev branch
