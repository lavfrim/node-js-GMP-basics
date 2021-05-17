import {ReasonPhrases, StatusCodes} from "http-status-codes";
import { Response } from 'express';

const handleMsg = (res: Response, name: string) => res.status(StatusCodes.NOT_FOUND).json({
    error: `[${ReasonPhrases.NOT_FOUND}]: There is no such ${name} in the database`,
});

export const sendNoSmth = (res: Response) => handleMsg(res, 'user');
export const sendNoGroup = (res: Response) => handleMsg(res, 'group');
