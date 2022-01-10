import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Product, { ProductDocument } from "../models/product.model";
import { databaseresponseTimeHistogram } from "../utils/metrics";

export async function createProduct(input: DocumentDefinition<Omit<ProductDocument, "createdAt" | "updatedAt">>) {
    return Product.create(input)
}

export async function findProduct(query: FilterQuery<ProductDocument>, options: QueryOptions = {lean: true}) {
    const metricsLabels = {
        operation: "findProduct",
      };
    
      const timer = databaseresponseTimeHistogram.startTimer();
      try {
        const result = await Product.findOne(query, {}, options);
        timer({ ...metricsLabels, success: "true" });
        return result;
      } catch (e) {
        timer({ ...metricsLabels, success: "false" });
    
        throw e;
      }
}

export async function findAllProduct(options: QueryOptions = {lean: true}) {
    return Product.find({},{}, options);
}

export async function findAndUpdateProduct(
    query: FilterQuery<ProductDocument>, update: UpdateQuery<ProductDocument>,  options: QueryOptions
) {
    return Product.findOneAndUpdate(query, update, options);
}

export async function deleteProduct(query: FilterQuery<ProductDocument>) {
    return Product.deleteOne(query);
}