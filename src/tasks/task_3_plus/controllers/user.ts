import { Response, Request, NextFunction } from 'express';
import { userServices } from "../services/user";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { sendNoSmth } from './sendNoSmth';
import { AutoSuggestUsersRequestSchema } from '../types';
import { ValidatedRequest } from "express-joi-validation";

export const getUser = (req: Request, res: Response, next: NextFunction) => {
    userServices.getUserById(req.params.id)
        .then((data) => {
            if (data === null) {
                return sendNoSmth(res);
            }

            res.json(data.dataValues);
        })
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
    userServices.updateUser(req.params.id, req.body)
        .then((data) => {
            if (!data[0]) {
                return sendNoSmth(res);
            }

            res.status(StatusCodes.CREATED);
            res.json({
                message: `[${ReasonPhrases.CREATED}]: User profile was updated`,
            });
        })
};

export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    userServices.deleteUser(req.params.id)
        .then((data) => {
            if (!data[0]) {
                return sendNoSmth(res);
            }

            res.status(StatusCodes.CREATED);
            res.json({
                message: `[${ReasonPhrases.CREATED}]: User was soft deleted`,
            });
        })
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
    const createUser = () => userServices.createUser(req.body)
        .then((data) => {
            if (!data) {
                throw 'data base error';
            }

            res.status(StatusCodes.CREATED);
            res.json({
                message: `[${ReasonPhrases.CREATED}]: User was created`,
                user: data.dataValues,
            });
        })

    userServices.getUserByField('login', req.body.login)
        .then((data) => {
            if (data === null) {
                return createUser();
            }

            res.status(StatusCodes.CONFLICT);
            res.json({
                message: `[${ReasonPhrases.CONFLICT}]: Such user already created`,
            });
        })
};

export const getAutoSuggestUserList = (req: ValidatedRequest<AutoSuggestUsersRequestSchema>, res: Response, next: NextFunction) => {
    const { loginSubstring, limit } = req.query;

    userServices.getSuggestUsers(loginSubstring, limit)
        .then((data) => {
            if (!data.length) {
                return sendNoSmth(res);
            }

            res.json(data.map((user) => user.dataValues));
        })
};
