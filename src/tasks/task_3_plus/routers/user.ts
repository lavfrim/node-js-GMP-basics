import { Router } from 'express';
import { getUser, updateUser, deleteUser, createUser, getAutoSuggestUserList } from '../controllers/user';
import { usersListQuerySchema } from '../validationSchemas';
import { createValidator } from 'express-joi-validation';

export const user = Router();
const validator = createValidator();

user.route('/list')
    .get(validator.query(usersListQuerySchema), getAutoSuggestUserList);

user.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

user.route('/')
    .post(createUser);

