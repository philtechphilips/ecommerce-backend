import dotenv from "dotenv";
import { errorResponse, successResponse } from "../helpers/response";
import { create, deleteItem, fetch, fetchOne, isUnique, update } from "../helpers/schema";
import redis from "../config/redis";
import Order from "../models/order";


dotenv.config();

const fetchOrders = async function (req, res) {
    let orders;
    try {
        // orders = await redis.get("orders");
        // // console.log(orders)
        // if (orders) {
        //     return successResponse(res, {
        //         statusCode: 200,
        //         message: "Orders fetched sucessfully!.",
        //         payload: JSON.parse(orders),
        //     });
        // }
        orders = await fetch(Order);
        redis.set("orders", JSON.stringify(orders), "EX", 3600);
        return successResponse(res, {
            statusCode: 200,
            message: "Orders fetched sucessfully!.",
            payload: orders,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

const takeOrders = async function (req, res) {
    let { orderId } = req.params, { orderStatus } = req.body, order;

    try {
        order = await fetchOne(Order, { orderId })
        if (!order) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Order not found.",
            });
        }
        order = await update(
            Order,
            { orderId }, { orderStatus }
        );
        return successResponse(res, {
            statusCode: 200,
            message: "Order updated sucessfully!.",
            payload: order,
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
    fetchOrders,
    takeOrders
}