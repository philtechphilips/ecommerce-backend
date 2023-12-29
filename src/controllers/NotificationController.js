import dotenv from "dotenv";
import { errorResponse, successResponse } from "../helpers/response";
import { create, deleteItem, fetch, fetchOne, hardDeleteItem, isUnique, update } from "../helpers/schema";
import redis from "../config/redis";
import notification from "../models/notification";
import Notification from "../models/notification";


dotenv.config();

const fetchNotification = async function (req, res) {
    const { user } = req;
    let notification;
    try {
        notification = await redis.get("notification");
        // console.log(notification)
        if (notification) {
            return successResponse(res, {
                statusCode: 200,
                message: "notification fetched sucessfully!.",
                payload: JSON.parse(notification),
            });
        }
        notification = await fetch(Notification, {userId: user._id});
        redis.set("notification", JSON.stringify(notification), "EX", 3600);
        return successResponse(res, {
            statusCode: 200,
            message: "Notification fetched sucessfully!.",
            payload: notification,
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
    fetchNotification
}