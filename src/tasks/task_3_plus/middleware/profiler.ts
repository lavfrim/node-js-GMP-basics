import { NextFunction, Request, Response } from "express";
import { EventEmitter } from 'events';

export const profiles = new EventEmitter();

export const profiler = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.once('finish', () => {
        profiles.emit('route', { req, passingTime: Date.now() - start });
    });

    next();
};
