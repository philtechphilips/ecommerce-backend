import dotenv from "dotenv";
import { errorResponse, successResponse } from "../helpers/response";
import { create, deleteItem, fetch, fetchOne, hardDeleteItem, isUnique, update } from "../helpers/schema";
import redis from "../config/redis";
import Cart from "../models/cart";
import axios from "axios";
import Order from "../models/order";
import Payment from "../models/payment";


dotenv.config();

const verifyPayment = async function (req, res) {
    const { user } = req;
    const { reference } = req.params;
    console.log(reference);
    const SECRET_KEY = process.env.PAYSTACK_SECRET;
    const axiosInstance = axios.create({
        baseURL: 'https://api.paystack.co',
        headers: {
            Authorization: `Bearer ${SECRET_KEY}`,
        },
    });
    const endpoint = `/transaction/verify/${reference}`;

    try {
        const response = await axiosInstance.get(endpoint);
        
        if (response.status === 200) { 
            const verification = response.data.data;
            const payment = {
                userId: user._id,
                paymentStatus: verification.status,
                paymentReference: reference,
                amount: verification.amount / 100,
                initiateDate: verification.created_at,
                paidDate: verification.paid_at
            };
            await create(Payment, payment);

            let cart, isPurchased, orders;
            cart = await fetch(Cart, { userId: user._id });
            for (const cartItem of cart) {
                cart = await update(Cart, { userId: user._id, isPurchased: false }, { isPurchased: true });
                orders = {
                    userId: user._id,
                    productId: cartItem.productId._id,
                    orderId: Date.now(),
                    paymentReference: reference
                };
                await create(Order, orders);
            }

            return successResponse(res, {
                statusCode: 200,
                message: "Payment verified successfully.",
                payload: cart,
            });
        } else {
            return errorResponse(res, {
                statusCode: response.status,
                message: "Payment verification failed.",
            });
        }
    } catch (error) {
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occurred, please try again later.",
        });
    }
};



export {
    verifyPayment
}