import { Request } from 'express';
import {
    ContainerTypes,
    ValidatedRequestSchema,
} from 'express-joi-validation';

type SequelizeResponse = any;

export interface User {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
}

export interface newUserRequestBody {
    login: string;
    password: string;
    age: number;
}

export interface AutoSuggestUsersRequestQuery {
    loginSubstring: string;
    limit: number;
}

export interface AutoSuggestUsersRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: AutoSuggestUsersRequestQuery;
}

export interface UserServices {
    createUser: (user: newUserRequestBody) => Promise<SequelizeResponse>;
    getUserById: (id: string) => Promise<SequelizeResponse>;
    getUserByField: (field: keyof User, value: User[keyof User]) => Promise<SequelizeResponse>;
    updateUser: (id: string, userInfo: newUserRequestBody) => Promise<SequelizeResponse>;
    deleteUser: (id: string) => Promise<SequelizeResponse>;
    getSuggestUsers: (subStr: string, limit: number) => Promise<SequelizeResponse>;
}
