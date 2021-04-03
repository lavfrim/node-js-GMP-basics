import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import path from 'path';

import { userRouter } from './routers/user'

dotenv.config();
const app = express();

const PORT = Number(process.env.APP_PORT) || 3000;
const serverStartMsg = `---------------------------------------------------------------------
${colors.blue(`Server running on port: ${PORT}...`)}
`;

app.use(express.json());
app.use(path.posix.join(process.env.APP_URL_BASE_V1, 'user'), userRouter);

app.listen(PORT, () => {
    process.stdout.write(serverStartMsg);
});

