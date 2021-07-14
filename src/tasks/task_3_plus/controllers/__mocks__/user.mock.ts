export const reqMock = {
    params: {
        id: 'mockedIdNumber',
    },
    body: {
        login: 'mockedLogin',
        name: 'mockedName',
        users: 'mockedUsers',
    },
    query: {
        loginSubstring: 'mockedLoginSubstring',
        limit: 'mockedLimit',
    },
};

export const resMock = {
    json: jest.fn(),
    status: jest.fn(),
};

export const dataMock = {
    dataValues: [{}],
};
