import { errorResponse, successResponse } from "../helpers/response";
import { calculateDiscountPercentage, create, deleteItem, fetch, fetchOne, isUnique, update } from "../helpers/schema";
import redis from "../config/redis";
import Product from "../models/product";
const cloudinary = require("../config/cloudinary")


const createProducts = async function (req, res) {
    let { title, categoryId, categoryType, details, price, discount, highlights, instructions, sizes, colors } = req.body;
    let imageUrl, product;
    try {
        if (!req.files) {
            return errorResponse(res, {
                statusCode: 422,
                message: "Add a product image.",
            });
        }
        const uniqueTitle = await isUnique(Product, { title, categoryId });
        if (!uniqueTitle) {
            return errorResponse(res, {
                statusCode: 422,
                message: "product with title exists.",
            });
        }
        const files = req.files.images;
        let images = []
        // Loop through each file and upload to Cloudinary
        for (const file of files) {
            try {
                const upload = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: "products",
                    width: 500,
                    height: 600,
                    crop: "fill"
                }, (error, result) => {
                    if (error) {
                        throw new Error("Error occured while uploading image.");
                    }
                });
                images.push(upload.secure_url)
            } catch (e) {
                console.log(e)
            }
        }
        const discountInPercentage = await calculateDiscountPercentage(price, discount);
        product = await create(
            Product,
            { title, categoryId, categoryType, details, price, discount, discountInPercentage, highlights, instructions, sizes, colors, images }
        );
        return successResponse(res, {
            statusCode: 201,
            message: "product Created sucessfully!.",
            payload: product,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

const fetchSingleProduct = async function (req, res) {
    const { id } = req.params
    let products;
    try {
        products = await redis.get(`singleproducts-${id}`);
        if (products) {
            return successResponse(res, {
                statusCode: 200,
                message: "Products fetched sucessfully!.",
                payload: JSON.parse(products),
            });
        }
        products = await fetchOne(Product, { _id: id });
        redis.set(`singleproducts-${id}`, JSON.stringify(products), "EX", 3600);
        return successResponse(res, {
            statusCode: 200,
            message: "products fetched sucessfully!.",
            payload: products,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}


const fetchProducts = async function (req, res) {
    let products;
    try {
        products = await redis.get("products");
        // console.log(products)
        if (products) {
            return successResponse(res, {
                statusCode: 200,
                message: "Products fetched sucessfully!.",
                payload: JSON.parse(products),
            });
        }
        products = await fetch(Product);
        redis.set("products", JSON.stringify(products), "EX", 3600);
        return successResponse(res, {
            statusCode: 200,
            message: "Products fetched sucessfully!.",
            payload: products,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}


const deleteProduct = async function (req, res) {
    let { id } = req.params
    let product
    try {
        product = await fetchOne(Product, { _id: id })
        if (!product) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Product not found.",
            });
        }
        product = await deleteItem(
            Product,
            {
                _id: id
            }
        );
        return successResponse(res, {
            statusCode: 200,
            message: "Product deleted sucessfully!.",
            payload: product,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}


const updateProduct = async function (req, res) {
    let { id } = req.params
    let { title, categoryId, categoryType, details, price, discount, highlights, instructions, sizes, colors } = req.body;
    let product, discountInPercentage

    try {
        product = await fetchOne(Product, { _id: id })
        if (!product) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Product not found.",
            });
        }
        if (price && discount) {
            discountInPercentage = await calculateDiscountPercentage(price, discount);
        }
        product = await update(
            Product,
            { _id: id }, { title, categoryId, categoryType, details, price, discount, discountInPercentage, highlights, instructions, sizes, colors }
        );
        return successResponse(res, {
            statusCode: 200,
            message: "Product updated sucessfully!.",
            payload: product,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

export {
    createProducts,
    fetchProducts,
    fetchSingleProduct,
    deleteProduct,
    updateProduct
}