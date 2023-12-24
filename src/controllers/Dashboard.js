import dotenv from "dotenv";
import { errorResponse, successResponse } from "../helpers/response";
import { countItems, create, deleteItem, fetch, fetchOne, isUnique, update } from "../helpers/schema";
import Banner from "../models/banner";
import redis from "../config/redis";
import Order from "../models/order";
import Product from "../models/product";
import Payment from "../models/payment";
import User from "../models/user";
const cloudinary = require("../config/cloudinary")


dotenv.config();

const fetchDashboardData = async function (req, res) {
    try {
        const orders = await countItems(Order);
        const products = await countItems(Product);
        const payments = await fetch(Payment);
        const users = await countItems(User, { role: "user" });
        const recentOrders = await fetch(Order, { orderStatus: "Pending" });
        const payload = {
            ordersCount: orders,
            productsCount: products,
            payments: payments,
            usersCount: users,
            recentOrders
        };

        return successResponse(res, {
            statusCode: 200,
            message: "Dashboard data fetched successfully!", payload
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
    fetchDashboardData,
}