import dotenv from "dotenv";
import { errorResponse, successResponse } from "../helpers/response";
import { create, deleteItem, fetch, fetchOne, hardDeleteItem, isUnique, update } from "../helpers/schema";
import redis from "../config/redis";
import Discount from "../models/discount";


dotenv.config();


const createDiscount = async function (req, res) {
    let { code, discountPercentage, expiryDate } = req.body;
    let discount;
    const { user } = req
    try {
        const uniqueDiscountCode = await isUnique(Discount, { code });
        if (!uniqueDiscountCode) {
            return errorResponse(res, {
                statusCode: 422,
                message: "Discount code exists.",
            });
        }
        discount = await create(
            Discount,
            { code, discountPercentage, expiryDate }
        );
        return successResponse(res, {
            statusCode: 201,
            message: "discount Created sucessfully!.",
            payload: discount,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}


const fetchDiscount = async function (req, res) {
    const { code } = req.params;
    let discount;
    try {
        // discount = await redis.get("discount");
        // // console.log(discount)
        // if (discount) {
        //     return successResponse(res, {
        //         statusCode: 200,
        //         message: "discount fetched sucessfully!.",
        //         payload: JSON.parse(discount),
        //     });
        // }
        console.log(code)
        discount = await fetchOne(Discount, { code })
        if (!discount) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Discount not found.",
            });
        }
        return successResponse(res, {
            statusCode: 200,
            message: "discount fetched sucessfully!.",
            payload: discount,
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
    createDiscount,
    fetchDiscount
}