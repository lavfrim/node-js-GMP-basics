import { Sequelize } from 'sequelize';
import { db, dbDialect } from '../config/db';
import colors from 'colors';

export const sqlz = new Sequelize(
    db.database,
    db.user,
    db.password as string,
    {
        host: db.host,
        dialect: dbDialect,
    },
);

sqlz.authenticate()
    .then(() => process.stdout.write(colors.blue(`Sequelize connected to ${db.database} successfully\n`)))
    .catch((err) => {
        process.stdout.write(colors.red(`Sequelize cannot connect to ${db.database}\n${err}\n`));
        throw err;
    });
