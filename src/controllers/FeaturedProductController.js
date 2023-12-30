import { errorResponse, successResponse } from "../helpers/response";
import { create, deleteItem, fetch, fetchOne, isUnique, update } from "../helpers/schema";
import FeaturedProduct from "../models/featured";
import redis from "../config/redis";
const cloudinary = require("../config/cloudinary")

const createFeaturedProduct = async function (req, res) {
    let { buttonText, buttonUrl, categoryId, image } = req.body;
    let imageUrl, featuredProduct;
    try {
        if (!image) {
            return errorResponse(res, {
                statusCode: 422,
                message: "Add a product image.",
            });
        }
        const uniquebuttonText = await isUnique(FeaturedProduct, { buttonText, categoryId });
        if (!uniquebuttonText) {
            return errorResponse(res, {
                statusCode: 422,
                message: "Featured product with title exist!.",
            });
        }
        
        const upload = await cloudinary.uploader.upload(image, {
            folder: "featuredProduct",
            width: 500,
            height: 600,
            crop: "fill"
        });
        if (!upload) throw new Error("Error occured while uploading image.");
        imageUrl = upload.secure_url;
        featuredProduct = await create(
            FeaturedProduct,
            {
                buttonText, buttonUrl, imageUrl, categoryId
            }
        );
        redis.del("f-Product");
        return successResponse(res, {
            statusCode: 201,
            message: "Featured Product Created sucessfully!.",
            payload: featuredProduct,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

const fetchFeaturedProducts = async function (req, res) {
    let featuredProduct;
    try {
        featuredProduct = await redis.get("f-Product");
        if (featuredProduct) {
            return successResponse(res, {
                statusCode: 200,
                message: "Featured Product fetched sucessfully!.",
                payload: JSON.parse(featuredProduct),
            });
        }
        featuredProduct = await fetch(FeaturedProduct);
        redis.set("f-Product", JSON.stringify(featuredProduct), "EX", 3600);
        return successResponse(res, {
            statusCode: 200,
            message: "Featured Product fetched sucessfully!.",
            payload: featuredProduct,
        });
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

const fetchActiveFeaturedProducts = async function (req, res) {
    let featuredProduct;
    try {
        // featuredProduct = await redis.get("featuredProduct");
        // // console.log(featuredProduct)
        // if (featuredProduct) {
        //     return successResponse(res, {
        //         statusCode: 200,
        //         message: "Featured Product fetched sucessfully!.",
        //         payload: JSON.parse(featuredProduct),
        //     });
        // }
        featuredProduct = await fetch(FeaturedProduct, {active: true});
        // redis.set("featuredProduct", JSON.stringify(featuredProduct), "EX", 3600);
        return successResponse(res, {
            statusCode: 200,
            message: "Featured Product fetched sucessfully!.",
            payload: featuredProduct,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}


const fetchSingleFeaturedProducts = async function (req, res) {
    const { id } = req.params
    let feturedProduct;
    try {
        feturedProduct = await redis.get(`feturedProduct-${id}`);
        if (feturedProduct) {
            return successResponse(res, {
                statusCode: 200,
                message: "Fetured product fetched sucessfully!.",
                payload: JSON.parse(feturedProduct),
            });
        }
        feturedProduct = await fetchOne(FeaturedProduct, { _id: id });
        redis.set(`feturedProduct-${id}`, JSON.stringify(feturedProduct), "EX", 3600);
        return successResponse(res, {
            statusCode: 200,
            message: "Fetured product fetched sucessfully!.",
            payload: feturedProduct,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

const deleteFeaturedProduct = async function (req, res) {
    let { id } = req.params
    let featuredProduct
    try {
        featuredProduct = await fetchOne(FeaturedProduct, { _id: id })
        if (!featuredProduct) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Featured product not found.",
            });
        }
        featuredProduct = await deleteItem(
            FeaturedProduct,
            {
                _id: id
            }
        );
        return successResponse(res, {
            statusCode: 200,
            message: "Featured product deleted sucessfully!.",
            payload: featuredProduct,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

const updateFeaturedProduct = async function (req, res) {
    let { id } = req.params
    let { buttonText, buttonUrl, categoryId, active } = req.body;
    let featuredProduct
    try {
        featuredProduct = await fetchOne(FeaturedProduct, { _id: id })
        if (!featuredProduct) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Featured product not found.",
            });
        }
        featuredProduct = await update(
            FeaturedProduct,
            { _id: id }, { buttonText, buttonUrl, categoryId, active }
        );
        return successResponse(res, {
            statusCode: 200,
            message: "Featured product updated sucessfully!.",
            payload: featuredProduct,
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
    createFeaturedProduct,
    fetchFeaturedProducts,
    fetchSingleFeaturedProducts,
    deleteFeaturedProduct,
    updateFeaturedProduct,
    fetchActiveFeaturedProducts
}