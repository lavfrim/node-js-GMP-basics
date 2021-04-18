import { RequestWithInfo } from '../types';
import { Response } from 'express';

export const getUser = (req: RequestWithInfo, res: Response) => {
    const {user} = req.info;

    if (user) {
        res.json(user);
    }
};
