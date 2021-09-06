import express from 'express';
import dotenv from 'dotenv';


// initialize configuration
dotenv.config();

const port = process.env.SERVER_PORT;
// App
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
// tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
// push the dev branch
