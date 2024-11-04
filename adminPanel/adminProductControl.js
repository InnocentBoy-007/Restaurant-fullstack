import mongoose from 'mongoose';
import Product from '../model/productModel.js'

export class CustomError extends Error {
    constructor(message, errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}

export class AdminControl {
    async addProduct(productDetails) {
        try {
            if (!productDetails || typeof productDetails !== 'object') {
                throw new CustomError("Product details are necessary!", 400);
            }

            // track the time of product addition
            const productAddedOn = new Date().toLocaleString();

            const addProductResponse = await Product.create({ ...productDetails, productAddedOn: productAddedOn })

            return {
                message: "Product added successfully! - backend",
                addProductResponse
            }
        } catch (error) {
            throw error;
        }

    }

    async updateProduct(id, productDetails) {
        try {
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                throw new CustomError("Invalid ID - backend", 409);
            }
            if (!productDetails || typeof productDetails !== 'object') {
                throw new CustomError("Product details are necessary!", 400);
            }

            const product = await Product.findById(id);
            if (!product) {
                throw new CustomError("Product not found! - backend", 404);
            }

            if (productDetails.productName) {
                product.productName = productDetails.productName;
            }

            if (productDetails.productPrice) {
                product.productPrice = productDetails.productPrice;
            }

            if (productDetails.productQuantity) {
                // add product quantity on top of the existing quantity
                product.productQuantity += productDetails.productQuantity;
            }

            // the productUpdatedOn field must be updated everytime there is an update on the product details
            product.productUpdatedOn = new Date().toLocaleString();
            await product.save(); // saving the updated product

            return {
                message: "Product updated successfully! - backend",
                product
            }
        } catch (error) {
            throw error;
        }
    }
}
