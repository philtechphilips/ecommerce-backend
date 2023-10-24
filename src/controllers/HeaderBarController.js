import dotenv from "dotenv";
import { errorResponse, successResponse } from "../helpers/response";
import { create, deleteItem, fetch, fetchOne, isUnique, update } from "../helpers/schema";
import redis from "../config/redis";
import headerBar from "../models/header-bar";


dotenv.config();

const fetchHeaderBar = async function (req, res) {
    let HeaderBar;
    try {
        // HeaderBar = await redis.get("HeaderBar");
        // // console.log(HeaderBar)
        // if (HeaderBar) {
        //     return successResponse(res, {
        //         statusCode: 200,
        //         message: "HeaderBar fetched sucessfully!.",
        //         payload: JSON.parse(HeaderBar),
        //     });
        // }
        HeaderBar = await fetch(headerBar);
        redis.set("HeaderBar", JSON.stringify(HeaderBar), "EX", 3600);
        return successResponse(res, {
            statusCode: 200,
            message: "HeaderBar fetched sucessfully!.",
            payload: HeaderBar,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

const createHeaderBar = async function (req, res) {
    let { content } = req.body;
    let imageUrl, HeaderBar;
    try {
        const uniqueTitle = await isUnique(headerBar, { content });
        if (!uniqueTitle) {
            return errorResponse(res, {
                statusCode: 422,
                message: "HeaderBar with title exists.",
            });
        }
        HeaderBar = await create( headerBar, { content } );
        return successResponse(res, {
            statusCode: 201,
            message: "Header Bar Created sucessfully!.",
            payload: HeaderBar,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

const updateHeaderBar = async function (req, res) {
    let { id } = req.params
    let { content } = req.body;
    let HeaderBar
    try {
        HeaderBar = await fetchOne(headerBar, { _id: id })
        if (!HeaderBar) {
            return errorResponse(res, {
                statusCode: 400,
                message: "HeaderBar not found.",
            });
        }
        HeaderBar = await update(
            headerBar,
            { _id: id }, { content }
        );
        return successResponse(res, {
            statusCode: 200,
            message: "HeaderBar updated sucessfully!.",
            payload: HeaderBar,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

const deleteHeaderBar = async function (req, res) {
    let { id } = req.params
    let HeaderBar
    try {
        HeaderBar = await fetchOne(headerBar, { _id: id })
        if (!HeaderBar) {
            return errorResponse(res, {
                statusCode: 400,
                message: "HeaderBar not found.",
            });
        }
        HeaderBar = await deleteItem(
            headerBar,
            {
                _id: id
            }
        );
        return successResponse(res, {
            statusCode: 200,
            message: "HeaderBar deleted sucessfully!.",
            payload: HeaderBar,
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
    createHeaderBar,
    fetchHeaderBar,
    updateHeaderBar,
    deleteHeaderBar
}