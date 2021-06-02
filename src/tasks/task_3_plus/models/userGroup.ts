import { sqlz } from '../data-access/sequelize';
import { DataTypes  } from 'sequelize';
import { TableNames } from '../config/db';
import { User } from './user';
import { Group } from './group';

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

// Set DB relationships
User.belongsToMany(Group, { through: UserGroup, constraints: true, onDelete: 'CASCADE' });
Group.belongsToMany(User, { through: UserGroup, constraints: true, onDelete: 'CASCADE' });
