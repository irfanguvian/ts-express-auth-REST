import { object, string, TypeOf } from "zod"

/**
 * @openapi
 * components:
 *   schema:
 *     Product:
 *       type: object
 *       required:
 *        - title
 *        - description
 *        - price
 *        - image
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         image:
 *           type: string
 */

const payload = {
    body: object({
        title: string({
            required_error: "Title is required"
        }),
        description: string({
            required_error: "Description is required"
        }).min(120, "description must least 120 character"),
        price: string({
            required_error: "Price is required"
        }),
        image: string({
            required_error: "Image is required"
        }),

    })
};

const params = {
    params: object({
        productId: string({
            required_error: "productId is required"
        })
    })
}

export const createProductSchema = object({
    ...payload,
});

export const updateProductSchema = object({
    ...payload,
    ...params
});

export const deleteProductSchema = object({
    ...params,
});


export const getProductSchema = object({
    ...params,
});

export type CreateProductInput = TypeOf<typeof createProductSchema>
export type UpdateProductInput = TypeOf<typeof updateProductSchema>
export type GetProductInput = TypeOf<typeof getProductSchema>
export type DeleteProductInput = TypeOf<typeof deleteProductSchema>