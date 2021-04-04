import express from 'express';
import {
    ReasonPhrases,
    StatusCodes,
} from 'http-status-codes';
import { v4 as uuid } from 'uuid';
import {
    ValidatedRequest,
    createValidator,
} from 'express-joi-validation';
import { userBodySchema, usersListQuerySchema } from '../validationSchemas';
import { User, RequestWithInfo, UserRequestSchema, AutoSuggestUsersRequestSchema } from '../types';
import { mockedUserDataBase } from '../mocks';
import { getAutoSuggestUsers } from '../utils/getAutoSuggestUsers';

export const userRouter = express.Router();
const validator = createValidator();
const userDataBase: User[] = [...mockedUserDataBase];

userRouter.param('id', (req: RequestWithInfo, res, next, id) => {
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
})

userRouter.get(
    '/list',
    validator.query(usersListQuerySchema),
    (req: ValidatedRequest<AutoSuggestUsersRequestSchema>, res) => {
    const query = req.query;
    const autoSuggestUserList = getAutoSuggestUsers({ userDataBase, ...query });

    res.json(autoSuggestUserList);
});

userRouter.get('/:id', (req: RequestWithInfo, res) => {
    const { user } = req.info;

    if (user) {
        res.json(user);
    }
});

userRouter.post(
    '/',
    validator.body(userBodySchema),
    (req: ValidatedRequest<UserRequestSchema>, res) => {
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
});

userRouter.patch(
    '/:id',
    validator.body(userBodySchema),
    (req: RequestWithInfo, res) => {
    const { user } = req.info;

    if (user) {
        Object.keys(req.body).forEach((prop) => {
            user[prop] = req.body[prop];
        })
        res.status(StatusCodes.CREATED);
        res.json({
            message: `[${ReasonPhrases.CREATED}]: User profile was updated`,
            user: user,
        });
    }
});

userRouter.delete('/:id', (req: RequestWithInfo, res) => {
    const { user } = req.info;

    if (user) {
        user.isDeleted = !user.isDeleted;

        res.status(StatusCodes.CREATED);
        res.json({
            message: `[${ReasonPhrases.CREATED}]: User was ${user.isDeleted ? 'soft deleted' : 'restored'}`,
            user: user,
        });
    }
});
