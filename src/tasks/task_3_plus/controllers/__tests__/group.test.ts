import {addUsersToGroup, createGroup, getAllGroups, getGroup, removeGroup, updateGroup} from '../group';
import { reqMock, resMock, dataMock } from '../__mocks__/user.mock';
import { groupServices } from '../../services/group';
import { mocked } from "ts-jest/utils";
import { sendNoGroup } from '../sendNoSmth';
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { logoutServiceErrMsg } from '../logoutServiceErrMsg';
import {userServices} from "../../services/user";
import {createUser} from "../user";

jest.mock('../../services/group', () => ({
    groupServices: {
        getGroupById: jest.fn(),
        updateGroup: jest.fn(),
        removeGroup: jest.fn(),
        createGroup: jest.fn(),
        getGroupByName: jest.fn(),
        getAllGroup: jest.fn(),
        addUsersToGroup: jest.fn(),
    },
}));
jest.mock('../sendNoSmth', () => ({
    sendNoGroup: jest.fn(),
}));
jest.mock('../logoutServiceErrMsg', () => ({
    logoutServiceErrMsg: jest.fn(),
}))

describe('Test group controllers', () => {
    describe('getGroup', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call groupServices.getGroupById with correct value', async () => {
            mocked(groupServices.getGroupById).mockResolvedValue(dataMock);
            await getGroup(reqMock as any, resMock as any);
            expect(groupServices.getGroupById).toBeCalledWith(reqMock.params.id);
        });

        it('should call sendNoGroup with correct value', async () => {
            mocked(groupServices.getGroupById).mockResolvedValue(null);
            await getGroup(reqMock as any, resMock as any);
            expect(sendNoGroup).toBeCalledWith(resMock);
            expect(resMock.json).not.toBeCalled();
        });

        it('should call json method with correct value', async () => {
            mocked(groupServices.getGroupById).mockResolvedValue(dataMock);
            await getGroup(reqMock as any, resMock as any);
            expect(sendNoGroup).not.toBeCalled();
            expect(resMock.json).toBeCalledWith(dataMock.dataValues);
        });
    });

    describe('updateGroup', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call groupServices.updateGroup with correct value', async () => {
            mocked(groupServices.updateGroup).mockResolvedValue(dataMock);
            await updateGroup(reqMock as any, resMock as any);
            expect(groupServices.updateGroup).toBeCalledWith(reqMock.params.id, reqMock.body);
        });

        it('should call sendNoGroup with correct value', async () => {
            mocked(groupServices.updateGroup).mockResolvedValue([]);
            await updateGroup(reqMock as any, resMock as any);
            expect(sendNoGroup).toBeCalledWith(resMock);
            expect(resMock.json).not.toBeCalled();
        });

        it('should call json method with correct value', async () => {
            mocked(groupServices.updateGroup).mockResolvedValue([dataMock]);
            await updateGroup(reqMock as any, resMock as any);
            expect(sendNoGroup).not.toBeCalled();
            expect(resMock.status).toBeCalledWith(StatusCodes.CREATED);
            expect(resMock.json.mock.calls[0][0].message).toBe(`[${ReasonPhrases.CREATED}]: Group profile was updated`);
        });
    });

    describe('removeGroup', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call groupServices.updateGroup with correct value', async () => {
            mocked(groupServices.removeGroup).mockResolvedValue(dataMock);
            await removeGroup(reqMock as any, resMock as any);
            expect(groupServices.removeGroup).toBeCalledWith(reqMock.params.id);
        });

        it('should call sendNoGroup with correct value', async () => {
            mocked(groupServices.removeGroup).mockResolvedValue([]);
            await removeGroup(reqMock as any, resMock as any);
            expect(sendNoGroup).toBeCalledWith(resMock);
            expect(resMock.json).not.toBeCalled();
        });

        it('should call json method with correct value', async () => {
            mocked(groupServices.removeGroup).mockResolvedValue([dataMock]);
            await removeGroup(reqMock as any, resMock as any);
            expect(sendNoGroup).not.toBeCalled();
            expect(resMock.status).toBeCalledWith(StatusCodes.CREATED);
            expect(resMock.json.mock.calls[0][0].message).toBe(`[${ReasonPhrases.CREATED}]: Group was hard deleted`);
        });
    });

    describe('createGroup', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call groupServices.getGroupByName with correct value', async () => {
            mocked(groupServices.getGroupByName).mockResolvedValue([{}]);
            await createGroup(reqMock as any, resMock as any);
            expect(groupServices.getGroupByName).toBeCalledWith(reqMock.body.name);
        });

        it('should call groupServices.createGroup with correct value', async () => {
            mocked(groupServices.getGroupByName).mockResolvedValue(null);
            mocked(groupServices.createGroup).mockResolvedValue(null);
            await createGroup(reqMock as any, resMock as any);
            expect(groupServices.createGroup).toBeCalledWith(reqMock.body);
            expect(resMock.json).not.toBeCalled();
            expect(resMock.status).not.toBeCalled();
        });

        it('should call groupServices.createGroup, json and status methods with correct value', async () => {
            mocked(groupServices.getGroupByName).mockResolvedValue(dataMock);
            await createGroup(reqMock as any, resMock as any);
            expect(groupServices.createGroup).not.toBeCalled();
            expect(resMock.status).toBeCalledWith(StatusCodes.CONFLICT);
            expect(resMock.json.mock.calls[0][0]).toMatchObject({
                message: `[${ReasonPhrases.CONFLICT}]: Such group already created`,
            });
        });
    });

    describe('getAllGroups', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call groupServices.getAllGroup with correct value', async () => {
            mocked(groupServices.getAllGroup).mockResolvedValue(dataMock);
            await getAllGroups(reqMock as any, resMock as any);
            expect(groupServices.getAllGroup).toBeCalled();
        });

        it('should call sendNoGroup with correct value', async () => {
            mocked(groupServices.getAllGroup).mockResolvedValue(null);
            await getAllGroups(reqMock as any, resMock as any);
            expect(sendNoGroup).toBeCalledWith(resMock);
            expect(resMock.json).not.toBeCalled();
        });

        it('should call json method with correct value', async () => {
            mocked(groupServices.getAllGroup).mockResolvedValue(dataMock);
            await getAllGroups(reqMock as any, resMock as any);
            expect(sendNoGroup).not.toBeCalled();
            expect(resMock.json).toBeCalledWith(dataMock.dataValues);
        });
    });

    describe('addUsersToGroup', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call groupServices.getAllGroup with correct value', async () => {
            mocked(groupServices.addUsersToGroup).mockResolvedValue(dataMock);
            await addUsersToGroup(reqMock as any, resMock as any);
            expect(groupServices.addUsersToGroup).toBeCalledWith(reqMock.params.id, reqMock.body.users);
        });
    });
});
