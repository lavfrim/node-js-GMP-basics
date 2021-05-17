import { sqlz } from '../data-access/sequelize';
import { DataTypes } from 'sequelize';
import { TableNames } from '../config/db';
import { Permission } from '../types';

const permissionMethod: Permission[] = ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'];

export const Group = sqlz.define(TableNames.GROUP, {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: permissionMethod,
    },
}, {
    timestamps: false,
    tableName: TableNames.GROUP
});
