import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        res.status(StatusCodes.UNAUTHORIZED);
        res.json({
            message: `[${ReasonPhrases.UNAUTHORIZED}]: you have to set x-access-token`,
        });
        return;
    }

    if (typeof token === "string") {
        jwt.verify(token, process.env.SECRET_JWT, (err, _object) => {
            if (err) {
                res.status(StatusCodes.FORBIDDEN);
                res.json({
                    message: `[${ReasonPhrases.FORBIDDEN}]: ${err.message}`,
                });
                return;
            }

            next()
        })
    } else {
        res.status(StatusCodes.UNAUTHORIZED);
        res.json({
            message: `[${ReasonPhrases.UNAUTHORIZED}]: x-access-token have to be string`,
        });
    }
};