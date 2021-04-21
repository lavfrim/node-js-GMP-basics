import {ReasonPhrases, StatusCodes} from "http-status-codes";
import { Response } from 'express';

export const sendNoUser = (res: Response) => res.status(StatusCodes.NOT_FOUND).json({
    error: `[${ReasonPhrases.NOT_FOUND}]: There is no such user in the database`,
});