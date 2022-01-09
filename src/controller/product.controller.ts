import { Request, Response } from "express";
import { CreateProductInput, DeleteProductInput, GetProductInput, UpdateProductInput } from "../schema/product.schema";
import { createProduct, deleteProduct, findAllProduct, findAndUpdateProduct, findProduct } from "../service/product.service";

export async function createProductHandler(req: Request<{ }, { }, CreateProductInput["body"]>, res: Response) {
   try {
    const userId = res.locals.user._id;

    const body = req.body;

    const product = await createProduct({...body, user: userId});

    return res.status(200).send({
        data : {
            product
        }
    });
   } catch (error : any) {
       return res.status(500).send({
           error : error.message
       })
   }
}

export async function getProductHandler(req: Request<GetProductInput["params"]>, res: Response) {
    try {
        const productId = req.params.productId;
        const product = await findProduct({productId});
    
        if (!product) return res.sendStatus(500);
        return res.status(200).send({
            data : {
                product
            }
        });
    } catch (error: any) {
        return res.status(500).send({
            error : error.message
        })
    }
}


export async function getListProductHandler(req: Request, res: Response) {
    try {
        const product = await findAllProduct();
    
        if (!product) return res.sendStatus(500);
        return res.status(200).send({
            data : {
                product
            }
        });
    } catch (error: any) {
        return res.status(500).send({
            error : error.message
        })
    }
}

export async function updateProductHandler(req: Request<UpdateProductInput["params"]>, res: Response) {
    try {
        const userId = res.locals.user._id;

        const productId = req.params.productId;
    
        const update = req.body;
    
        const product = await findProduct({productId});
    
        if (!product) return res.sendStatus(500);
    
        if (String(product.user) !== userId) {
            return res.sendStatus(403);
        }
    
        const updateProduct = await findAndUpdateProduct({productId}, update, {new: true});
    
        return res.status(200).send({
            data : {
                updateProduct
            }
        });
    } catch (error : any) {
        return res.status(500).send({
            error : error.message
        })
    }
}

export async function deleteProductHandler(req: Request<DeleteProductInput["params"]>, res: Response) {
    try {
        const userId = res.locals.user._id;

        const productId = req.params.productId;
    
        const product = await findProduct({productId});
    
        if (!product) return res.sendStatus(500);
    
        if (String(product.user) !== userId) {
            return res.sendStatus(403);
        }
    
        await deleteProduct({productId});
    
        return res.status(200).send({
            data : {
                message : "success Delete",
            }
        });
    } catch (error : any) {
        return res.status(500).send({
            error : error.message
        })
    }
}