import Joi from 'joi';

export const usersListQuerySchema = Joi.object({
    loginSubstring: Joi.string().required(),
    limit: Joi.number().min(1).max(128).required(),
})

