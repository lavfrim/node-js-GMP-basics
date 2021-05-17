import { Op } from 'sequelize';
import { Group } from '../models/group';
import { GroupServices, Group as GroupInterface } from '../types';
import { v4 as uuid } from 'uuid';
import { userServices } from './user';
import { sqlz } from '../data-access/sequelize';

export const groupServices: GroupServices = {
    createGroup: (data) => {
        const newGroup: GroupInterface = {
            ...data,
            id: uuid(),
        };

        return Group.create(newGroup);
    },
    updateGroup: (id, groupInfo) => Group.update(groupInfo, {
        where: {
            id: {
                [Op.eq]: id,
            }
        }
    }),
    getGroupById: (id: string) => Group.findOne({
        where: {
            id: {
                [Op.eq]: id,
            },
        }
    }),
    getGroupByName: (name) => Group.findOne({
        where: {
            name: {
                [Op.eq]: name,
            },
        }
    }),
    getAllGroup: () => Group.findAll(),
    removeGroup: (id) => groupServices.getGroupById(id).then((group) => group.destroy()),
    addUsersToGroup: (id, usersIds) => sqlz.transaction(async () => {
        const group = await groupServices.getGroupById(id);
        const users = await Promise.all(usersIds.map((id) => userServices.getUserById(id)));
        await group.addUsers(users);
        return group;
    }),
};
