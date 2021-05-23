import { NextFunction, Request, Response } from "express";
import { CustomError } from '../types';
import { loggerError } from '../utils/logger';

export const handleError = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const{ methodName, methodArguments, err } = error;
    loggerError.error({ methodName, methodArguments, message: err.message, err });
    next(error);
};