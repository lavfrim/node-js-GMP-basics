import {
    ContainerTypes,
    ValidatedRequestSchema,
} from 'express-joi-validation';
import {Error} from "sequelize";

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

export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

export interface Group {
    id: string;
    name: string;
    permissions: Permission[];
}

export interface newGroupRequestBody {
    name: string;
    permissions: Permission[];
}

export interface GroupServices {
    createGroup: (group: newGroupRequestBody) => Promise<SequelizeResponse>;
    updateGroup: (id: string, groupInfo: newGroupRequestBody) => Promise<SequelizeResponse>;
    getGroupById: (id: string) => Promise<SequelizeResponse>;
    getAllGroup: () => Promise<SequelizeResponse>;
    removeGroup: (id: string) => Promise<SequelizeResponse>;
    getGroupByName: (name: string) => Promise<SequelizeResponse>;
    addUsersToGroup: (id: string, users: addUsersToGroupRequestBody['users'] ) => Promise<SequelizeResponse>
}

export interface addUsersToGroupRequestBody {
    users: string[];
}

export interface AddUsersToGroupRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: addUsersToGroupRequestBody;
}

export interface CustomError {
    methodName: string,
    methodArguments: any[],
    err: Error,
}