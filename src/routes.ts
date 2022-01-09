import { Express, Request, Response } from "express";
import { createUserSessionHandler, deleteSessionHandler, getUserSessionHandler } from "./controller/session.controller";
import { createUserHandler } from "./controller/user.controller";
import validate from "./middleware/validateResource";
import { createSessionSchema } from "./schema/session.schema";
import { createUserSchema } from "./schema/user.schema";
import { requireUser } from "./middleware/requireUser";


function routes(app : Express) {
    app.get("/healtcheck", (req: Request, res: Response) => {
        return res.sendStatus(200);
    });

    app.post("/api/users", validate(createUserSchema), createUserHandler);

    app.post("/api/session", validate(createSessionSchema), createUserSessionHandler);

    app.get("/api/session",requireUser ,getUserSessionHandler);

    app.delete("/api/session",requireUser ,deleteSessionHandler);
}

export default routes;