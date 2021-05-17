import { Request, Response, NextFunction } from 'express';

export const setAllowMethod = (req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
}
