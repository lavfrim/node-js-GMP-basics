import { Router } from 'express';
import { loginBodySchema } from '../validationSchemas';
import { createValidator } from 'express-joi-validation';
import { setToken } from "../controllers/auth";

export const auth = Router();
const validator = createValidator();

auth.route('/')
    .post(validator.body(loginBodySchema), setToken);