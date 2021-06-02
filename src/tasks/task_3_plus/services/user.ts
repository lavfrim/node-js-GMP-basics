import { Op } from 'sequelize';
import { User } from '../models/user';
import { UserServices, User as UserInterface } from '../types';
import { v4 as uuid } from 'uuid';
import { tryCatchLogger } from "../decorators/method-logger";

const createUser = (data) => {
    const newUser: UserInterface = {
        ...data,
        id: uuid(),
        isDeleted: false,
    };

    return User.create(newUser);
};

const getUserById = (id: string) => User.findOne({
    where: {
        id: {
            [Op.eq]: id,
        },
    }
})

const getUserByField = (field, value) => User.findOne({
    where: {
        [field]: {
            [Op.eq]: value,
        },
    }
});

const updateUser = (id, userInfo) => User.update(userInfo, {
    where: {
        id: {
            [Op.eq]: id,
        }
    }
});

const deleteUser = (id) => User.update({ isDeleted: true }, {
    where: {
        id: {
            [Op.eq]: id,
        }
    }
});

const getSuggestUsers = (subStr: string, limit: number) => User.findAll({
    where: {
        login: {
            [Op.like]: `%${subStr}%`
        },
    },
    order: [
        ['login', 'ASC'],
    ],
    limit,
});

export const userServices: UserServices = {
    createUser: tryCatchLogger(createUser),
    getUserById: tryCatchLogger(getUserById),
    getUserByField: tryCatchLogger(getUserByField),
    updateUser: tryCatchLogger(updateUser),
    deleteUser: tryCatchLogger(deleteUser),
    getSuggestUsers: tryCatchLogger(getSuggestUsers),
};
