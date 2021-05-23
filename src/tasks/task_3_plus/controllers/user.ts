import { Response, Request, NextFunction } from 'express';
import { userServices } from "../services/user";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { logoutServiceErrMsg } from './logoutServiceErrMsg';
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
        .catch((err) => {
            next({ methodName: 'getUserById', methodArguments: [req.params.id], err });
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
        .catch((err) => {
            next({ methodName: 'updateUser', methodArguments: [req.params.id, req.body], err });
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
        .catch((err) => {
            next({ methodName: 'deleteUser', methodArguments: [req.params.id], err });
        })
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
    const createUser = () => userServices.createUser(req.body)
        .then((data) => {
            if (!data) {
                next({ methodName: 'createUser', methodArguments: [req.body] });
            }

            res.status(StatusCodes.CREATED);
            res.json({
                message: `[${ReasonPhrases.CREATED}]: User was created`,
                user: data.dataValues,
            });
        })
        .catch((err) => {
            next({ methodName: 'createUser', methodArguments: [req.body], err });
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
        .catch((err) => {
            next({ methodName: 'getUserByField', methodArguments: ['login', req.body.login] , err });
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
        .catch((err) => {
            next({ methodName: 'getAutoSuggestUserList', methodArguments: [loginSubstring, limit], err });
        })
};
