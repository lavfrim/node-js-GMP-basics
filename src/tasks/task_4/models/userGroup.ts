import { sqlz } from '../data-access/sequelize';
import { DataTypes  } from 'sequelize';
import { TableNames } from '../config/db';
import { Permission } from '../types';

const permissionMethod: Permission[] = ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'];

export const UserGroup = sqlz.define(TableNames.USER_GROUP, {
    id: {
        type: DataTypes.STRING,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
}, {
    timestamps: false,
    tableName: TableNames.GROUP
});
