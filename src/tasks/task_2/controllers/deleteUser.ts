import { RequestWithInfo } from '../types';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Response } from 'express';

export const deleteUser = (req: RequestWithInfo, res: Response) => {
    const { user } = req.info;

    if (user) {
        user.isDeleted = !user.isDeleted;

        res.status(StatusCodes.CREATED);
        res.json({
            message: `[${ReasonPhrases.CREATED}]: User was ${user.isDeleted ? 'soft deleted' : 'restored'}`,
            user: user,
        });
    }
};
