import dotenv from "dotenv";
import { errorResponse, successResponse } from "../helpers/response";
import { create, deleteItem, fetch, fetchOne, isUnique, update } from "../helpers/schema";
import Banner from "../models/banner";
import redis from "../config/redis";
const cloudinary = require("../config/cloudinary")


dotenv.config();

const fetchBanner = async function (req, res) {
    let banner;
    try {
        banner = await redis.get("banner");
        // console.log(banner)
        if (banner) {
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

const fetchSingleBanner = async function (req, res) {
    const { id } = req.params
    let banner;
    try {
        banner = await redis.get(`singleBanner-${id}`);
        if (banner) {
            return successResponse(res, {
                statusCode: 200,
                message: "Banner fetched sucessfully!.",
                payload: JSON.parse(banner),
            });
        }
        banner = await fetchOne(Banner, { _id: id });
        redis.set(`singleBanner-${id}`, JSON.stringify(banner), "EX", 3600);
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
    let { title, body, buttonText, buttonUrl, image, categoryId } = req.body;
    let imageUrl, banner;
    try {
        if (!req.files) {
            return errorResponse(res, {
                statusCode: 422,
                message: "Add a banner image.",
            });
        }
        const uniqueTitle = await isUnique(Banner, { title });
        if (!uniqueTitle) {
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
                title, body, buttonText, buttonUrl, imageUrl, categoryId
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

const updateBanner = async function (req, res) {
    let { id } = req.params
    let { title, body, buttonText, buttonUrl } = req.body;
    let banner
    try {
        banner = await fetchOne(Banner, { _id: id })
        if (!banner) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Banner not found.",
            });
        }
        banner = await update(
            Banner,
            { _id: id }, { title, body, buttonText, buttonUrl }
        );
        return successResponse(res, {
            statusCode: 200,
            message: "Banner updated sucessfully!.",
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

const deleteBanner = async function (req, res) {
    let { id } = req.params
    let banner
    try {
        banner = await fetchOne(Banner, { _id: id })
        if (!banner) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Banner not found.",
            });
        }
        banner = await deleteItem(
            Banner,
            {
                _id: id
            }
        );
        return successResponse(res, {
            statusCode: 200,
            message: "Banner deleted sucessfully!.",
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
    fetchBanner,
    fetchSingleBanner,
    updateBanner,
    deleteBanner
}