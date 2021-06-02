import { NextFunction, Request, Response } from 'express';

export const methodLogger = (req: Request, res: Response, next: NextFunction) => {
    process.stdout.write(`Method: ${req.method}
url: ${req.url}
query: ${JSON.stringify(req.query, null,2)}
body: ${JSON.stringify(req.body, null, 2)}\n\n`);

    next();
};