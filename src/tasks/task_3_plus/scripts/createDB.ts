import { Client } from 'pg';
import { mockedUserDataBase } from '../mocks';
import { db, TableNames } from '../config/db';
import colors from 'colors';
import { User } from '../types';

const CREATE_DB_QUERY = {
    text: `CREATE DATABASE ${db.database}
    WITH 
    OWNER = ${db.user}
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1251'
    LC_CTYPE = 'English_United States.1251'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;`,
};

const CREATE_TABLES_QUERY = {
    text: `CREATE TABLE IF NOT EXISTS ${TableNames.USER} (
    id VARCHAR ( 255 ) UNIQUE NOT NULL,
    login VARCHAR ( 255 ) NOT NULL,
    password VARCHAR ( 255 ) NOT NULL,
    age SMALLINT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL,
    PRIMARY KEY (id)
  );`,
};

const getFillTableQuery = (user: User) => ({
    text: `INSERT INTO public.users(
                id, login, password, age, "isDeleted")
                VALUES ($1, $2, $3, $4, $5);`,
    values: [user.id, user.login, user.password, user.age, user.isDeleted],
});

const fillTable = (client: Client) => Promise.all(
    mockedUserDataBase.map((user) => client.query(getFillTableQuery(user))),
);

(async () => {
    const client = new Client(db);

    try {
        // Database creation does not end for an unknown reason and does not throw an error
        // Also, databases created through the Query-Tool in pgAdmin 4 are
        // not displayed as visible, but exist somewhere

        // process.stdout.write(`Creating database ${db.database}...\n`);
        // await client.query(CREATE_DB_QUERY);
        // process.stdout.write('Created\n\n');

        // To work correctly on the local machine, create a database task_3 and `npm run task3`

        process.stdout.write(`Connecting to data base: ${db.database}...\n`);
        await client.connect();
        process.stdout.write(`Connected\n\n`);

        process.stdout.write(`Creating table: ${TableNames.USER}...\n`);
        await client.query(CREATE_TABLES_QUERY);
        process.stdout.write(`Created\n\n`);

        process.stdout.write(`Table ${TableNames.USER} filling by mock data...\n`)
        await fillTable(client);
        process.stdout.write('Table filled\n\n');
        process.exit();
    } catch (err) {
        process.stdout.write(colors.red(`SCRIPT ERROR\n${err}\n`));
        throw err;
    }
})();
