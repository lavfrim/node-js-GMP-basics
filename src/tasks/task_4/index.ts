import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import path from 'path';

import { user } from './routers/user';
import { group } from './routers/group';
import { setAllowMethod } from './controllers/setAllowMethed';
import { setWentWrong } from './controllers/setWentWrong';

import { User } from './models/user';
import { Group } from './models/group';
import { UserGroup } from './models/userGroup';

dotenv.config();
const index = express();

const PORT = Number(process.env.APP_PORT) || 3000;
const serverStartMsg = `---------------------------------------------------------------------
${colors.blue(`Server running on port: ${PORT}...`)}
`;

// Set DB relationships
User.belongsToMany(Group, { through: UserGroup, constraints: true, onDelete: 'CASCADE' });
Group.belongsToMany(User, { through: UserGroup, constraints: true, onDelete: 'CASCADE' });

index.use(express.json());
index.use(setAllowMethod);
index.use(path.posix.join(process.env.APP_URL_BASE_V1, 'user'), user);
index.use(path.posix.join(process.env.APP_URL_BASE_V1, 'group'), group);
index.use(setWentWrong)

index.listen(PORT, () => {
    process.stdout.write(serverStartMsg);
})
