import { Express, Request, Response } from "express";
import { createUserSessionHandler, deleteSessionHandler, getUserSessionHandler } from "./controller/session.controller";
import { createUserHandler } from "./controller/user.controller";
import validate from "./middleware/validateResource";
import { createSessionSchema } from "./schema/session.schema";
import { createUserSchema } from "./schema/user.schema";
import { requireUser } from "./middleware/requireUser";
import { createProductSchema, deleteProductSchema, getProductSchema, updateProductSchema } from "./schema/product.schema";
import { createProductHandler, deleteProductHandler, getListProductHandler, getProductHandler, updateProductHandler } from "./controller/product.controller";


function routes(app : Express) {
    // contoh swagger
    /**
     * @openapi
     * /healthcheck:
     *  get:
     *     tags:
     *      - healthcheck
     *     description: "check"
     *     responses: 
     *       200:
     *          description: app running sucessfully
     */
    app.get("/healthcheck", (req: Request, res: Response) => {
        return res.sendStatus(200);
    });

  /**
   * @openapi
   * '/api/users':
   *  post:
   *     tags:
   *     - User
   *     summary: Register a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateUserInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateUserResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */

    app.post("/api/users", validate(createUserSchema), createUserHandler);

    app.post("/api/session", validate(createSessionSchema), createUserSessionHandler);

    app.get("/api/session",requireUser ,getUserSessionHandler);

    app.delete("/api/session",requireUser ,deleteSessionHandler);
    

    app.get("/api/product",getListProductHandler);
    app.post("/api/product",[requireUser, validate(createProductSchema)] ,createProductHandler);


  /**
   * @openapi
   * '/api/products/{productId}':
   *  get:
   *     tags:
   *     - Products
   *     summary: Get a single product by the productId
   *     parameters:
   *      - name: productId
   *        in: path
   *        description: The id of the product
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schema/Product'
   *       404:
   *         description: Product not found
   */

    app.put("/api/product/:productId",[requireUser, validate(updateProductSchema)] ,updateProductHandler);
    app.get("/api/product/:productId",[validate(getProductSchema)] ,getProductHandler);
    app.delete("/api/product/:productId",[requireUser, validate(deleteProductSchema)] ,deleteProductHandler);
}

export default routes;