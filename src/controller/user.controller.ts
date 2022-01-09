import { Request, Response } from "express";
import { createUserInput } from "../schema/user.schema";
import { createUser } from "../service/user.service";
import logger from "../utils/logger";
import { omit } from "lodash";

export async function createUserHandler(req : Request<{}, {}, createUserInput["body"]>, res: Response) {
    try {
        const user = await createUser(req.body); // call create user service
        return res.status(200).send({
            data : {
                user,
            }
        });
    } catch (error : any) {
        logger.error(error);
        return res.status(409).send(error.message);
    }
}