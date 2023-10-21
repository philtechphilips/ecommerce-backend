import { errorResponse, successResponse } from "../helpers/response";
import { calculateDiscountPercentage, create, createSlug, deleteItem, fetch, fetchInRandomOrder, fetchOne, isUnique, selectFetch, update } from "../helpers/schema";
import redis from "../config/redis";
import Product from "../models/product";
import mongoose from "mongoose";
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
        const uniqueTitle = await isUnique(Product, { title });
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
                    width: 300,
                    height: 350,
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
        const slug = await createSlug(title);
        product = await create(
            Product,
            { title, slug, categoryId, categoryType, details, price, discount, discountInPercentage, highlights, instructions, sizes, colors, images }
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

const fetchSingleProductBySlug = async function (req, res) {
    const { slug } = req.params
    let products;
    try {
        // products = await redis.get(`singleproducts-${slug}`);
        // if (products) {
        //     return successResponse(res, {
        //         statusCode: 200,
        //         message: "Products fetched sucessfully!.",
        //         payload: JSON.parse(products),
        //     });
        // }
        products = await fetchOne(Product, { slug });
        if (products) {
            redis.set(`singleproducts-${slug}`, JSON.stringify(products), "EX", 3600);
            return successResponse(res, {
                statusCode: 200,
                message: "products fetched sucessfully!.",
                payload: products,
            });
        } else {
            return errorResponse(res, {
                statusCode: 400,
                message: "Invalid Slug!",
            });
        }
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
        // products = await redis.get("products");
        // // console.log(products)
        // if (products) {
        //     return successResponse(res, {
        //         statusCode: 200,
        //         message: "Products fetched sucessfully!.",
        //         payload: JSON.parse(products),
        //     });
        // }
        products = await fetchInRandomOrder(20, Product);
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

const fetchTrendingProducts = async function (req, res) {
    const { category } = req.params
    let products;
    try {
        // products = await redis.get("products");
        // // console.log(products)
        // if (products) {
        //     return successResponse(res, {
        //         statusCode: 200,
        //         message: "Products fetched sucessfully!.",
        //         payload: JSON.parse(products),
        //     });
        // }
        products = await fetch(Product, { isTrending: true, categoryId: category });
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


const fetchShopProducts = async function (req, res) {
    const { category, categoryType } = req.params
    let products;
    try {
        // products = await redis.get("products");
        // // console.log(products)
        // if (products) {
        //     return successResponse(res, {
        //         statusCode: 200,
        //         message: "Products fetched sucessfully!.",
        //         payload: JSON.parse(products),
        //     });
        // }
        products = await fetch(Product, { categoryId: category, categoryType });
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
    let { title, categoryId, categoryType, details, price, isTrending, discount, highlights, instructions, sizes, colors } = req.body;
    let product, discountInPercentage, slug;

    try {
        product = await fetchOne(Product, { _id: id })
        if (!product) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Product not found.",
            });
        }
        const uniqueTitle = await isUnique(Product, { title });
        if (title) {
            if (!uniqueTitle) {
                return errorResponse(res, {
                    statusCode: 422,
                    message: "product with title exists.",
                });
            }
            slug = await createSlug(title);
        }
        if (price && discount) {
            discountInPercentage = await calculateDiscountPercentage(price, discount);
        }

        product = await update(
            Product,
            { _id: id }, { title, slug, categoryId, categoryType, isTrending, details, price, discount, discountInPercentage, highlights, instructions, sizes, colors }
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

const searchProduct = async function (req, res) {
    let { query } = req.params
    let product
    if (!query) {
        return errorResponse(res, {
            statusCode: 400,
            message: "No query!",
        });
    }
    try {
        product = await Product.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { categoryType: { $regex: query, $options: 'i' } },
            ],
        }).limit(5);
        if (!product) {
            return errorResponse(res, {
                statusCode: 400,
                message: "No product found!",
            });
        }
        return successResponse(res, {
            statusCode: 200,
            message: "Product fetched sucessfully!.",
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
    updateProduct,
    fetchSingleProductBySlug,
    fetchTrendingProducts,
    fetchShopProducts,
    searchProduct
}