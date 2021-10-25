import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';

const config = process.env;

async function authMiddleware(req: any, res: Response, next: NextFunction) {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY as string);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
}

export default authMiddleware;
