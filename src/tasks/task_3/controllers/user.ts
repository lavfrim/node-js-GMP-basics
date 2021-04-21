import { Response, Request } from 'express';
import { userServices } from "../services/user";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { logoutServiceErrMsg } from './logoutServiceErrMsg';
import { sendNoUser } from './sendNoUser';
import { AutoSuggestUsersRequestSchema } from '../types';
import { ValidatedRequest } from "express-joi-validation";

export const getUser = (req: Request, res: Response) => {
    userServices.getUserById(req.params.id)
        .then((data) => {
            if (data === null) {
                return sendNoUser(res);
            }

            res.json(data.dataValues);
        })
        .catch((err) => {
            logoutServiceErrMsg({ name: 'getUserById', req, res, err });
        })
};

export const updateUser = (req: Request, res: Response) => {
    userServices.updateUser(req.params.id, req.body)
        .then((data) => {
            if (!data[0]) {
                return sendNoUser(res);
            }

            res.status(StatusCodes.CREATED);
            res.json({
                message: `[${ReasonPhrases.CREATED}]: User profile was updated`,
            });
        })
        .catch((err) => {
            logoutServiceErrMsg({ name: 'updateUser', req, res, err });
        })
};

export const deleteUser = (req: Request, res: Response) => {
    userServices.deleteUser(req.params.id)
        .then((data) => {
            if (!data[0]) {
                return sendNoUser(res);
            }

            res.status(StatusCodes.CREATED);
            res.json({
                message: `[${ReasonPhrases.CREATED}]: User was soft deleted`,
            });
        })
        .catch((err) => {
            logoutServiceErrMsg({ name: 'deleteUser', req, res, err });
        })
};

export const createUser = (req: Request, res: Response) => {
    const createUser = () => userServices.createUser(req.body)
        .then((data) => {
            if (!data) {
                logoutServiceErrMsg({ name: 'createUser', req, res });
            }

            res.status(StatusCodes.CREATED);
            res.json({
                message: `[${ReasonPhrases.CREATED}]: User was created`,
                user: data.dataValues,
            });
        })
        .catch((err) => {
            logoutServiceErrMsg({ name: 'createUser', req, res, err });
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
            logoutServiceErrMsg({ name: 'getUserByField', req, res, err });
        })

};

export const getAutoSuggestUserList = (req: ValidatedRequest<AutoSuggestUsersRequestSchema>, res: Response) => {
    const { loginSubstring, limit } = req.query;

    userServices.getSuggestUsers(loginSubstring, limit)
        .then((data) => {
            if (!data.length) {
                return sendNoUser(res);
            }

            res.json(data.map((user) => user.dataValues));
        })
        .catch((err) => {
            logoutServiceErrMsg({ name: 'getAutoSuggestUserList', req, res, err });
        })
};