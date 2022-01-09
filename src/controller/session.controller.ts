import { Request, Response } from "express";
import config from "config";
import { createSession, findSessions, updateSession } from "../service/session.service";
import { validatePassword } from "../service/user.service";
import { signJWT } from "../utils/jwt.utils";

export async function createUserSessionHandler(req: Request, res: Response) {
    // validate user password
    const user = await validatePassword(req.body);

    if (!user) return res.status(401).send("invalid email or password");
    const id : string = user._id;

    // create a session
    const session = await createSession(id, req.get("user-agent") || "")
    // create an access token

    const accessToken = signJWT(
        {
            ...user,
            session : session._id,
        },
        { 
            expiresIn : config.get("accessTokenTtl"), // 15m
        }
    );

    const refreshToken = signJWT(
        {
            ...user,
            session : session._id,
        },
        { 
            expiresIn : config.get("refreshTokenTtl"), // 1y
        }
    );


    // return access & refresh token

    return res.send( {accessToken , refreshToken})
}

export async function getUserSessionHandler(req: Request, res: Response) {
    const userId = res.locals.user._id;

    const session = await findSessions({user: userId, valid: true});

    return res.status(200).send({
        data : {
            session
        }
    });
}

export async function deleteSessionHandler(req: Request, res: Response) {
    const sessionId = res.locals.user.session;
    await updateSession({_id: sessionId }, {valid: false});

    return res.status(200).send({
        accessToken: null,
        refreshToken: null,
    })
}