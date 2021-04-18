import Joi from 'joi';

export const userBodySchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])')).required(),
    age: Joi.number().min(4).max(130).required(),
});

export const usersListQuerySchema = Joi.object({
    loginSubstring: Joi.string().required(),
    limit: Joi.number().min(1).max(128).required(),
})

