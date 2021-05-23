import { Response, Request, NextFunction } from 'express';
import { groupServices } from '../services/group';
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { logoutServiceErrMsg } from './logoutServiceErrMsg';
import { sendNoGroup } from './sendNoSmth';
import { ValidatedRequest } from "express-joi-validation";
import { AddUsersToGroupRequestSchema } from '../types';

export const getGroup = (req: Request, res: Response, next: NextFunction) => {
    groupServices.getGroupById(req.params.id)
        .then((data) => {
            if (data === null) {
                return sendNoGroup(res);
            }

            res.json(data.dataValues);
        })
        .catch((err) => {
            next({ methodName: 'getGroupById', methodArguments: [req.params.id], err });
        })
};

export const updateGroup = (req: Request, res: Response, next: NextFunction) => {
    groupServices.updateGroup(req.params.id, req.body)
        .then((data) => {
            if (!data[0]) {
                return sendNoGroup(res);
            }

            res.status(StatusCodes.CREATED);
            res.json({
                message: `[${ReasonPhrases.CREATED}]: Group profile was updated`,
            });
        })
        .catch((err) => {
            next({ methodName: 'updateGroup', methodArguments: [req.params.id, req.body], err });
        })
};

export const removeGroup = (req: Request, res: Response, next: NextFunction) => {
    groupServices.removeGroup(req.params.id)
        .then((data) => {
            if (!data[0]) {
                return sendNoGroup(res);
            }

            res.status(StatusCodes.CREATED);
            res.json({
                message: `[${ReasonPhrases.CREATED}]: Group was hard deleted`,
            });
        })
        .catch((err) => {
            next({ methodName: 'removeGroup', methodArguments: [req.params.id], err });
        })
};

export const createGroup = (req: Request, res: Response, next: NextFunction) => {
    const createGroup = () => groupServices.createGroup(req.body)
        .then((data) => {
            if (!data) {
                logoutServiceErrMsg({ name: 'createGroup', req, res });
            }

            res.status(StatusCodes.CREATED);
            res.json({
                message: `[${ReasonPhrases.CREATED}]: Group was created`,
                user: data.dataValues,
            });
        })
        .catch((err) => {
            next({ methodName: 'createGroup', methodArguments: [req.body], err });
        })

    groupServices.getGroupByName(req.body.name)
        .then((data) => {
            if (data === null) {
                return createGroup();
            }

            res.status(StatusCodes.CONFLICT);
            res.json({
                message: `[${ReasonPhrases.CONFLICT}]: Such group already created`,
            });
        })
        .catch((err) => {
            next({ methodName: 'getGroupByName', methodArguments: [req.body.name], err });
        })

};

export const getAllGroups = (req: Request, res: Response, next: NextFunction) => {
    groupServices.getAllGroup()
        .then((data) => {
            if (data === null) {
                return sendNoGroup(res);
            }

            res.json(data.dataValues);
        })
        .catch((err) => {
            next({ methodName: 'getAllGroup', methodArguments: [], err });
        })
};

export const addUsersToGroup = async (req: ValidatedRequest<AddUsersToGroupRequestSchema>, res: Response, next: NextFunction) => {
    try {
        await groupServices.addUsersToGroup(req.params.id, req.body.users);
    } catch (err) {
        next({ methodName: 'addUsersToGroup', methodArguments: [req.params.id, req.body.users], err });
    }
};
