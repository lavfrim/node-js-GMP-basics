import { createLogger, format, transports } from 'winston';
import path from 'path';

const getMessage = ({ timestamp, level, message, methodName, methodArguments, err, ...args }) => (
`${timestamp.slice(0, 19).replace('T', ' ')} [${level}]: ${message}
    called: ${methodName}
        with: ${JSON.stringify(methodArguments)}
${Object.keys(err).length && JSON.stringify(err, null, 2)}
${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`
);


export const loggerError = createLogger({
    transports: [
        new transports.File({
            filename: path.join(__dirname, '..', 'logs', 'Error.log'),
            format: format.combine(
                format.timestamp(),
                format.printf(getMessage),
            )
        }),
        new transports.Console({
            format: format.combine(
                format.colorize({ all: true, colors: { info: 'red' }}),
                format.timestamp(),
                format.printf(getMessage),
            )
        })
    ]
});
