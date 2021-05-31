import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import path from 'path';

import { user } from './routers/user';
import { group } from './routers/group';
import { setAllowMethod } from './middleware/setAllowMethed';
import { setWentWrong } from './middleware/setWentWrong';
import { methodLogger } from './middleware/method-logger';
import { profiles, profiler } from './middleware/profiler';
import { logger } from './utils/logger';

dotenv.config();
const index = express();

const PORT = Number(process.env.APP_PORT) || 3000;
const serverStartMsg = `---------------------------------------------------------------------
${colors.blue(`Server running on port: ${PORT}...`)}
`;

index.use(express.json());
index.use(setAllowMethod);
index.use(profiler);
index.use(methodLogger);
index.use(path.posix.join(process.env.APP_URL_BASE_V1, 'user'), user);
index.use(path.posix.join(process.env.APP_URL_BASE_V1, 'group'), group);
index.use(setWentWrong);

profiles.on('route', ({ req, passingTime }) => {
    process.stdout.write(`
method: ${req.method},
rout: ${req.url},
passing time: ${passingTime}ms\n`)
});

process.on('uncaughtException', err => {
    logger.error({ err, methodName: 'uncaughtException', methodArguments: 'n/a', message: err.message });
    logger.on('finish', () => process.exit(1));
});

process.on('unhandledRejection', reason => {
    logger.error({ methodName: 'uncaughtException', methodArguments: 'n/a', message: reason });
});

index.listen(PORT, () => {
    process.stdout.write(serverStartMsg);
})
