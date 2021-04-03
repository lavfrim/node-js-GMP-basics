import express from 'express';
import {
    ReasonPhrases,
    StatusCodes,
} from 'http-status-codes';
import { v4 as uuid } from 'uuid';
import { User, newUserRequestBody, RequestWithInfo, AutoSuggestUsersRequestQuery } from '../types';
import { mockedUserDataBase } from '../mocks';
import { getAutoSuggestUsers } from '../utils/getAutoSuggestUsers';

export const userRouter = express.Router();
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

userRouter.get('/list', (req, res) => {
    // body validation
    const query = req.query as unknown as AutoSuggestUsersRequestQuery;
    const autoSuggestUserList = getAutoSuggestUsers({ userDataBase, ...query });

    res.json(autoSuggestUserList);
});

userRouter.get('/:id', (req: RequestWithInfo, res) => {
    const { user } = req.info;

    if (user) {
        res.json(user);
    }
});

userRouter.post('/', (req, res) => {
    // body validation
    if (!req.body.password) {
        res.status(StatusCodes.BAD_REQUEST);
        res.json({
            error: `[${ReasonPhrases.BAD_REQUEST}]: Request body have to be { login: string; password: string; age: number }`,
        })
    }

    const isUnique = !!!userDataBase.find((profile) => profile.login === req.body.login);

    if (isUnique) {
        const newUserProfile = {
            id: uuid(),
            isDeleted: false,
            ...req.body as newUserRequestBody,
        };
        const isSuccessful = userDataBase.push(newUserProfile);

        if (isSuccessful) {
            res.status(StatusCodes.CREATED);
            res.json({
                message: `[${ReasonPhrases.CREATED}]: User was created`,
                user: newUserProfile,
            });
        }
    }

    res.status(StatusCodes.CONFLICT);
    res.json({
        message: `[${ReasonPhrases.CONFLICT}]: Such user already created`,
    })
})

userRouter.patch('/:id', (req: RequestWithInfo, res) => {
    const { user } = req.info;
    // body validation

    if (user && req.body) {
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
