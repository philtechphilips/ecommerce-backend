import dotenv from "dotenv";
import safeCompare from "safe-compare";
import { errorResponse, successResponse } from "../helpers/response";
import { create, fetch, fetchOne, isUnique, update } from "../helpers/schema";
import Banner from "../models/banner";
import redis from "../config/redis";
const cloudinary = require("../config/cloudinary")


dotenv.config();

const fetchBanner = async function (req, res) {
    let banner;  
    try {
        banner = await redis.get("banner");
        console.log(banner)
        if(banner){
            return successResponse(res, {
                statusCode: 200,
                message: "Banner fetched sucessfully!.",
                payload: JSON.parse(banner),
            });
        }
        banner = await fetch(Banner);
        redis.set("banner", JSON.stringify(banner), "EX", 3600);
        return successResponse(res, {
            statusCode: 200,
            message: "Banner fetched sucessfully!.",
            payload: banner,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

const createBanner = async function (req, res) {
    let { title, body, buttonText, buttonUrl, image } = req.body;
    let imageUrl, banner;
    try {
        if (!req.files) {
            return errorResponse(res, {
                statusCode: 422,
                message: "Add a banner image.",
            });
        }
        const uniqueTitle = await isUnique(Banner, { title });
        if(!uniqueTitle){
            return errorResponse(res, {
                statusCode: 422,
                message: "Banner with title exists.",
            });
        }
        const path = req.files.image.tempFilePath;
        const upload = await cloudinary.uploader.upload(path, {
            folder: "bannerImage",
            width: 1320,
            height: 400,
            crop: "fill"
        });
        if (!upload) throw new Error("Error occured while uploading image.");
        imageUrl = upload.secure_url;
        banner = await create(
            Banner,
            {
                title, body, buttonText, buttonUrl, imageUrl
            }
        );
        return successResponse(res, {
            statusCode: 201,
            message: "Banner Created sucessfully!.",
            payload: banner,
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
    createBanner,
    fetchBanner
}