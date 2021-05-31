import { Op } from 'sequelize';
import { Group } from '../models/group';
import { GroupServices, Group as GroupInterface } from '../types';
import { v4 as uuid } from 'uuid';
import { userServices } from './user';
import { sqlz } from '../data-access/sequelize';
import { tryCatchLogger } from "../decorators/method-logger";

const createGroup = (data) => {
    const newGroup: GroupInterface = {
        ...data,
        id: uuid(),
    };

    return Group.create(newGroup);
};

const updateGroup = (id, groupInfo) => Group.update(groupInfo, {
    where: {
        id: {
            [Op.eq]: id,
        }
    }
});

const getGroupById = (id: string) => Group.findOne({
    where: {
        id: {
            [Op.eq]: id,
        },
    }
});

const getGroupByName = (name) => Group.findOne({
    where: {
        name: {
            [Op.eq]: name,
        },
    }
});

const getAllGroup = () => Group.findAll();

const removeGroup = (id) => groupServices.getGroupById(id).then((group) => group.destroy());

const addUsersToGroup = (id, usersIds) => sqlz.transaction(async () => {
    const group = await groupServices.getGroupById(id);
    const users = await Promise.all(usersIds.map((id) => userServices.getUserById(id)));
    await group.addUsers(users);
    return group;
});

export const groupServices: GroupServices = {
    createGroup: tryCatchLogger(createGroup),
    updateGroup: tryCatchLogger(updateGroup),
    getGroupById: tryCatchLogger(getGroupById),
    getGroupByName: tryCatchLogger(getGroupByName),
    getAllGroup: tryCatchLogger(getAllGroup),
    removeGroup: tryCatchLogger(removeGroup),
    addUsersToGroup: tryCatchLogger(addUsersToGroup),
};
