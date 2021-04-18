import { AutoSuggestUsersRequestSchema, RequestWithInfo, User, UserRequestSchema } from '../types';
import { mockedUserDataBase } from '../mocks';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Response, NextFunction } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { getAutoSuggestUsers } from '../utils/getAutoSuggestUsers';
import { v4 as uuid } from 'uuid';

const userDataBase: User[] = [...mockedUserDataBase];

export const findUser = (req: RequestWithInfo, res: Response, next: NextFunction, id) => {
    const user = userDataBase.find((profile) => profile.id === id);

    if (user) {
        // mutation as recommend official express docs
        // http://expressjs.com/en/5x/api.html#app.listen_path_callback
        // article router.route(path)
        req.info = { user };
        next();
    } else {
        res.status(StatusCodes.NOT_FOUND);
        res.json({
            error: `[${ReasonPhrases.NOT_FOUND}]: There is no such user in the database`,
        });
    }
};

export const getAutoSuggestUserList = (req: ValidatedRequest<AutoSuggestUsersRequestSchema>, res: Response) => {
        const query = req.query;
        const autoSuggestUserList = getAutoSuggestUsers({ userDataBase, ...query });

        res.json(autoSuggestUserList);
};

export const createUser = (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
    const isUnique = !!!userDataBase.find((profile) => profile.login === req.body.login);

    if (isUnique) {
        const newUserProfile: User = {
            id: uuid(),
            isDeleted: false,
            ...req.body,
        };
        const isSuccessful = !!userDataBase.push(newUserProfile);

        if (isSuccessful) {
            res.status(StatusCodes.CREATED);
            res.json({
                message: `[${ReasonPhrases.CREATED}]: User was created`,
                user: newUserProfile,
            });
        }
    } else {
        res.status(StatusCodes.CONFLICT);
        res.json({
            message: `[${ReasonPhrases.CONFLICT}]: Such user already created`,
        });
    }
}




