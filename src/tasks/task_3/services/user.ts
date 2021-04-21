import { Op } from 'sequelize';
import { User } from '../models/user';
import { UserServices, User as UserInterface } from '../types';
import { v4 as uuid } from 'uuid';

export const userServices: UserServices = {
    createUser: (data) => {
        const newUser: UserInterface = {
            ...data,
            id: uuid(),
            isDeleted: false,
        };

        return User.create(newUser);
    },
    getUserById: (id: string) => User.findOne({
        where: {
            id: {
                [Op.eq]: id,
            },
        }
    }),
    getUserByField: (field, value) => User.findOne({
        where: {
            [field]: {
                [Op.eq]: value,
            },
        }
    }),
    updateUser: (id, userInfo) => User.update(userInfo, {
        where: {
            id: {
                [Op.eq]: id,
            }
        }
    }),
    deleteUser: (id) => User.update({ isDeleted: true }, {
        where: {
            id: {
                [Op.eq]: id,
            }
        }
    }),
    getSuggestUsers: (subStr: string, limit: number) => User.findAll({
        where: {
            login: {
                [Op.like]: `%${subStr}%`
            },
        },
        order: [
            ['login', 'ASC'],
        ],
        limit,
    }),
};