import { User } from './types';

export const mockedUserDataBase: User[] = [
    {
        id: 'id-1',
        login: 'freeman',
        password: 'hl98',
        age: 23,
        isDeleted: false,
    },
    {
        id: 'id-0',
        login: '`breen`',
        password: 'city17',
        age: 66,
        isDeleted: true,
    },
];