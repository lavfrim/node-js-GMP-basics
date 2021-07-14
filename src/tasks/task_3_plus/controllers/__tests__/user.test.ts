import { createUser, deleteUser, getAutoSuggestUserList, getUser, updateUser } from '../user'
import { userServices } from '../../services/user';
import { reqMock, resMock, dataMock } from '../__mocks__/user.mock';
import { mocked } from "ts-jest/utils";
import { sendNoSmth } from '../sendNoSmth';
import { ReasonPhrases, StatusCodes } from "http-status-codes";

jest.mock('../../services/user', () => ({
    userServices: {
        getUserById: jest.fn(),
        updateUser: jest.fn(),
        deleteUser: jest.fn(),
        getUserByField: jest.fn(),
        createUser: jest.fn(),
        getSuggestUsers: jest.fn(),
    },
}));
jest.mock('../sendNoSmth', () => ({
    sendNoSmth: jest.fn(),
}));

describe('Test user controllers', () => {
    describe('getUser', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call userServices.getUserById with correct value', async () => {
            mocked(userServices.getUserById).mockResolvedValue(dataMock);
            await getUser(reqMock as any, resMock as any);
            expect(userServices.getUserById).toBeCalledWith(reqMock.params.id);
        });

        it('should call json method with correct value', async () => {
            mocked(userServices.getUserById).mockResolvedValue(dataMock);
            await getUser(reqMock as any, resMock as any);
            expect(resMock.json).toBeCalledWith(dataMock.dataValues);
            expect(sendNoSmth).not.toBeCalledWith(resMock);
        });

        it('should call sendNoSmth with correct value', async() => {
            mocked(userServices.getUserById).mockResolvedValue(null);
            await getUser(reqMock as any, resMock as any);
            expect(sendNoSmth).toBeCalledWith(resMock);
            expect(resMock.json).not.toBeCalledWith(dataMock.dataValues);
        });
    });

    describe('updateUser', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call userServices.updateUser with correct value', async () => {
            mocked(userServices.updateUser).mockResolvedValue([{}]);
            await updateUser(reqMock as any, resMock as any);
            expect(userServices.updateUser).toBeCalledWith(reqMock.params.id, reqMock.body);
        });

        it('should call sendNoSmth with correct value', async () => {
            mocked(userServices.updateUser).mockResolvedValue([]);
            await updateUser(reqMock as any, resMock as any);
            expect(sendNoSmth).toBeCalledWith(resMock);
            expect(resMock.status).not.toBeCalled();
            expect(resMock.json).not.toBeCalled();
        });

        it('should call status and json methods with correct value', async () => {
            mocked(userServices.updateUser).mockResolvedValue([{}]);
            await updateUser(reqMock as any, resMock as any);
            expect(sendNoSmth).not.toBeCalledWith(resMock);
            expect(resMock.status).toBeCalledWith(StatusCodes.CREATED);
            expect(resMock.json.mock.calls[0][0].message).toBe(`[${ReasonPhrases.CREATED}]: User profile was updated`);
        });
    });

    describe('deleteUser', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call userServices.deleteUser with correct value', async () => {
            mocked(userServices.deleteUser).mockResolvedValue([{}]);
            await deleteUser(reqMock as any, resMock as any);
            expect(userServices.deleteUser).toBeCalledWith(reqMock.params.id);
        });

        it('should call sendNoSmth with correct value', async () => {
            mocked(userServices.deleteUser).mockResolvedValue([]);
            await deleteUser(reqMock as any, resMock as any);
            expect(sendNoSmth).toBeCalledWith(resMock);
            expect(resMock.status).not.toBeCalled();
            expect(resMock.json).not.toBeCalled();
        });

        it('should call status and json methods with correct value', async () => {
            mocked(userServices.deleteUser).mockResolvedValue([{}]);
            await deleteUser(reqMock as any, resMock as any);
            expect(sendNoSmth).not.toBeCalledWith(resMock);
            expect(resMock.status).toBeCalledWith(StatusCodes.CREATED);
            expect(resMock.json.mock.calls[0][0].message).toBe(`[${ReasonPhrases.CREATED}]: User was soft deleted`);
        });
    });

    describe('createUser', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call userServices.getUserByField with correct value', async () => {
            mocked(userServices.getUserByField).mockResolvedValue([{}]);
            await createUser(reqMock as any, resMock as any);
            expect(userServices.getUserByField).toBeCalledWith('login', reqMock.body.login);
        });

        it('should call userServices.createUser with correct value', async () => {
            mocked(userServices.getUserByField).mockResolvedValue(null);
            mocked(userServices.createUser).mockResolvedValue(null);
            await createUser(reqMock as any, resMock as any);
            expect(userServices.createUser).toBeCalledWith(reqMock.body);
            expect(resMock.json).not.toBeCalled();
            expect(resMock.status).not.toBeCalled();
        });

        it('should call userServices.createUser, json and status methods with correct value', async () => {
            mocked(userServices.getUserByField).mockResolvedValue(dataMock);
            await createUser(reqMock as any, resMock as any);
            expect(userServices.createUser).not.toBeCalled();
            expect(resMock.status).toBeCalledWith(StatusCodes.CONFLICT);
            expect(resMock.json.mock.calls[0][0]).toMatchObject({
                message: `[${ReasonPhrases.CONFLICT}]: Such user already created`,
            });
        });
    });

    describe('getAutoSuggestUserList', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call userServices.getUserByField with correct value', async () => {
            mocked(userServices.getSuggestUsers).mockResolvedValue([]);
            await getAutoSuggestUserList(reqMock as any, resMock as any);
            expect(userServices.getSuggestUsers).toBeCalledWith(reqMock.query.loginSubstring, reqMock.query.limit);
        });

        it('should call sendNoSmth with correct value', async () => {
            mocked(userServices.getSuggestUsers).mockResolvedValue([]);
            await getAutoSuggestUserList(reqMock as any, resMock as any);
            expect(sendNoSmth).toBeCalledWith(resMock);
            expect(resMock.json).not.toBeCalled();
        });

        it('should call json method with correct value', async () => {
            mocked(userServices.getSuggestUsers).mockResolvedValue([dataMock]);
            await getAutoSuggestUserList(reqMock as any, resMock as any);
            expect(sendNoSmth).not.toBeCalled();
            expect(resMock.json).toBeCalledWith([dataMock].map((user) => user.dataValues));
        });
    });
});
