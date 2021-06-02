import { logger } from "../utils/logger";

export function tryCatchLogger<F extends (...args: any[]) => any>(func: F): F {
    return <F>async function (...args: any[]) {
        try {
            const start = Date.now();
            const result = await func(...args);
            const end = Date.now();
            process.stdout.write(`service method: ${func.name}; arguments: ${JSON.stringify(args)}, time: ${end - start}ms`);

            return result;
        } catch(err) {
            logger.error({ methodName: func.name, methodArguments: args, message: err.message, err });
        }
    }
}
