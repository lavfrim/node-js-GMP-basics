import { Router } from 'express';
import { getGroup, updateGroup, removeGroup, createGroup, getAllGroups, addUsersToGroup } from '../controllers/group';
import { addUsersToGroupBodySchema } from '../validationSchemas';
import { createValidator } from "express-joi-validation";

export const group = Router();
const validator = createValidator();

group.route('/:id')
    .get(getGroup)
    .patch(updateGroup)
    .delete(removeGroup)
    .put(validator.body(addUsersToGroupBodySchema), addUsersToGroup);

group.route('/')
    .get(getAllGroups)
    .post(createGroup);
