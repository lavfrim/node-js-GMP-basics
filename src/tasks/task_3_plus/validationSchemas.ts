import Joi from 'joi';

export const usersListQuerySchema = Joi.object({
    loginSubstring: Joi.string().required(),
    limit: Joi.number().min(1).max(128).required(),
});

export const addUsersToGroupBodySchema = Joi.object({
    users: Joi.array().unique().items(Joi.string().valid('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES')),
});

export const loginBodySchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().required(),
});
