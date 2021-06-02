import { sqlz } from '../data-access/sequelize';
import { DataTypes  } from 'sequelize';
import { TableNames } from '../config/db';

export const User = sqlz.define(TableNames.USER, {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^(?=.*[a-zA-Z])(?=.*[0-9])/
        }
    },
    age: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate: {
            isMoreAndLess(value: number) {
                if (value < 4 || value > 130) {
                    throw new Error('Age has to be between 4 and 130!');
                }
            }
        }
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: TableNames.USER
});
