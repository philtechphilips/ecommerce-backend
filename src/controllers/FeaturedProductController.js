import { errorResponse, successResponse } from "../helpers/response";
import { create, fetch, isUnique } from "../helpers/schema";
import FeauredProduct from "../models/featured";
import redis from "../config/redis";
const cloudinary = require("../config/cloudinary")

const createFeaturedProduct = async function (req, res) {
    let { buttonText, buttonUrl, categoryId } = req.body;
    let imageUrl, featuredProduct;
    try {
        if (!req.files) {
            return errorResponse(res, {
                statusCode: 422,
                message: "Add a product image.",
            });
        }
        const uniquebuttonText = await isUnique(FeauredProduct, { buttonText, categoryId });
        if (!uniquebuttonText) {
            return errorResponse(res, {
                statusCode: 422,
                message: "Featured product with title exist!.",
            });
        }
        const path = req.files.image.tempFilePath;
        const upload = await cloudinary.uploader.upload(path, {
            folder: "featuredProduct",
            width: 500,
            height: 600,
            crop: "fill"
        });
        if (!upload) throw new Error("Error occured while uploading image.");
        imageUrl = upload.secure_url;
        featuredProduct = await create(
            FeauredProduct,
            {
                buttonText, buttonUrl, imageUrl, categoryId
            }
        );
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
        featuredProduct = await redis.get("featuredProduct");
        // console.log(featuredProduct)
        if (featuredProduct) {
            return successResponse(res, {
                statusCode: 200,
                message: "Featured Product fetched sucessfully!.",
                payload: JSON.parse(featuredProduct),
            });
        }
        featuredProduct = await fetch(FeauredProduct, {active: true});
        redis.set("featuredProduct", JSON.stringify(featuredProduct), "EX", 3600);
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

export {
    createFeaturedProduct,
    fetchFeaturedProducts
}