import dotenv from "dotenv";
import { errorResponse, successResponse } from "../helpers/response";
import { create, deleteItem, fetch, fetchOne, hardDeleteItem, isUnique, update } from "../helpers/schema";
import redis from "../config/redis";
import Newsletter from "../models/newsletter";


dotenv.config();

const create = async function (req, res) {
    const { email } = req;
    let newsletter;
    try {
        newsletter = await fetch(Newsletter, {email});
        return successResponse(res, {
            statusCode: 200,
            message: "Newsletter subscribed sucessfully!.",
            payload: newsletter,
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
   create
}