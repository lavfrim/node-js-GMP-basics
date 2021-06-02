import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import {AutoSuggestUsersRequestSchema} from "../types";

export const setWentWrong = (_req: Request | AutoSuggestUsersRequestSchema, res: Response, err?: any) => {
    const errObj = {
        error: `[${ReasonPhrases.INTERNAL_SERVER_ERROR}]: Oops, something went wrong with sever response`,
        message: undefined
    };

    if (err) {
        errObj.message = `${err}`;
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errObj);
};
