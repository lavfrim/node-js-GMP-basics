import { Response, Request, NextFunction } from 'express';
import { groupServices } from '../services/group';
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { logoutServiceErrMsg } from './logoutServiceErrMsg';
import { sendNoGroup } from './sendNoSmth';
import { ValidatedRequest } from "express-joi-validation";
import { AddUsersToGroupRequestSchema } from '../types';

export const getGroup = (req: Request, res: Response) => {
    groupServices.getGroupById(req.params.id)
        .then((data) => {
            if (data === null) {
                return sendNoGroup(res);
            }

            res.json(data.dataValues);
        })
};

export const updateGroup = (req: Request, res: Response) => {
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
};

export const removeGroup = (req: Request, res: Response) => {
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
};

export const createGroup = (req: Request, res: Response) => {
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

};

export const getAllGroups = (req: Request, res: Response) => {
    groupServices.getAllGroup()
        .then((data) => {
            if (data === null) {
                return sendNoGroup(res);
            }

            res.json(data.dataValues);
        })
};

export const addUsersToGroup = async (req: ValidatedRequest<AddUsersToGroupRequestSchema>, res: Response) => {
    await groupServices.addUsersToGroup(req.params.id, req.body.users)
};
