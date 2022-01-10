import { object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - name
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        name:
 *          type: string
 *          default: Jane Doe
 *        password:
 *          type: string
 *          default: stringPassword123
 *        passwordConfirmation:
 *          type: string
 *          default: stringPassword123
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        name:
 *          type: string
 *        _id:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */

export const createUserSchema = object({
    body: object({
        name : string({
            required_error: "Name is required",
        }),
        password : string({
            required_error: "password is required",
        }).min(6, "password is too short, should be 6 min"),
        passwordConfirmation : string({
            required_error: "passwordConfirmation is required",
        }),
        email: string({
            required_error: "email is required",
        }).email("not a valid email"),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "password do not match",
        path:["passwordConfirmation"],
    }),
});

export type createUserInput = Omit<TypeOf<typeof createUserSchema>, "body.passwordConfirmation">;