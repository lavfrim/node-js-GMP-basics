import { setWentWrong } from "./setWentWrong";
import colors from "colors";
import { Request, Response } from "express";
import { AutoSuggestUsersRequestSchema } from "../types";

export const logoutServiceErrMsg = ({ name, req, res, err }: {
    name: string,
    req: Request | AutoSuggestUsersRequestSchema,
    res: Response,
    err?: any;
}) => {
    setWentWrong(req, res, err);
    process.stdout.write(colors.red(`[ERROR] in ${name}:\n${err}\n}`));
}