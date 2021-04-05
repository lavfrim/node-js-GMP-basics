import express from 'express';
import {
    createValidator,
} from 'express-joi-validation';
import { userBodySchema, usersListQuerySchema } from '../validationSchemas';
import { getUser } from '../controllers/getUser';
import { updateUser } from '../controllers/updateUser';
import { deleteUser } from '../controllers/deleteUser';
import { findUser, getAutoSuggestUserList, createUser } from '../controllers/controllersWithMockedDataBase';

export const userRouter = express.Router();
const validator = createValidator();

userRouter.param('id', findUser);

userRouter.route('/list')
    .get(validator.query(usersListQuerySchema), getAutoSuggestUserList);

userRouter.route('/:id')
    .get(getUser)
    .patch(validator.body(userBodySchema), updateUser)
    .delete(deleteUser);

userRouter.route('/')
    .post(validator.body(userBodySchema), createUser);
