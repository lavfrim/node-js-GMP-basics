import { Request } from 'express';

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

export interface RequestWithInfo extends Request {
    info: Record<string, any>
}

export interface AutoSuggestUsersRequestQuery {
    loginSubstring: string;
    limit: number;
}

export interface AutoSuggestUsersOption extends AutoSuggestUsersRequestQuery {
    userDataBase: User[];
}
