import { Request, Response } from 'express';
import { userServices } from '../services/user';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

export const setToken = (req: Request, res: Response) => {
    userServices.getUserByField('login', req.body.login)
        .then((data) => {
            if (!data) {
                res.status(StatusCodes.UNAUTHORIZED);
                res.json({
                    message: `[${ReasonPhrases.UNAUTHORIZED}]: wrong login`,
                });
                return;
            }

            if (data.password !== req.body.password) {
                res.status(StatusCodes.UNAUTHORIZED);
                res.json({
                    message: `[${ReasonPhrases.UNAUTHORIZED}]: wrong password`,
                });
                return;
            }

            res.status(StatusCodes.OK);
            res.json({
                token: jwt.sign({ login: req.body.login, password: data.password }, process.env.SECRET_JWT, { expiresIn: '60s' }),
                message: `[${ReasonPhrases.OK}]: here are your lucking token`,
            });
        })
};