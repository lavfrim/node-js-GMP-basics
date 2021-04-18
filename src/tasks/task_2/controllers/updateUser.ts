import { RequestWithInfo } from '../types';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Response } from 'express';

export const updateUser = (req: RequestWithInfo, res: Response) => {
    const { user } = req.info;

    if (user) {
        Object.keys(req.body).forEach((prop) => {
            user[prop] = req.body[prop];
        })
        res.status(StatusCodes.CREATED);
        res.json({
            message: `[${ReasonPhrases.CREATED}]: User profile was updated`,
            user: user,
        });
    }
};
