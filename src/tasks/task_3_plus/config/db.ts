import dotenv from 'dotenv';
import { ClientConfig } from 'pg';

dotenv.config();

export const db: ClientConfig = {
    database: process.env.DB_DATABASE || 'Users',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
};

export const dbDialect = 'postgres';
export enum TableNames {
    USER = 'users',
    GROUP = 'groups',
    USER_GROUP = 'userGroups',
}
