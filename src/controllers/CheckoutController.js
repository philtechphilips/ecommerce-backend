import dotenv from "dotenv";
import { errorResponse, successResponse } from "../helpers/response";
import { create, deleteItem, fetch, fetchOne, hardDeleteItem, isUnique, update } from "../helpers/schema";
import Cart from "../models/cart";
import axios from "axios";
import Order from "../models/order";
import Payment from "../models/payment";
import Notification from "../models/notification";
import { getYear } from "date-fns";
import { sendMail } from "../utils/email";


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
            await sendEMail(reference, verification.status, user)
            let cart, orders, notification;
            cart = await fetch(Cart, { userId: user._id, isPurchased: false });
            for (const cartItem of cart) {
                cart = await update(Cart, { _id: cartItem._id, userId: user._id, isPurchased: false }, { isPurchased: true, paymentReference: reference });
                orders = {
                    userId: user._id,
                    productId: cartItem.productId._id,
                    orderId: Date.now(),
                    paymentReference: reference,
                    size: cartItem.size,
                    color: cartItem.color,
                    quantity: cartItem.selectedQuantity
                };
                notification ={
                    title: "Order Successfull!",
                    userId: user._id,
                    notification: `Your item in Order No. ${orders.orderId} has been submitted sucessfully!`
                };
                await create(Order, orders);
                await create(Notification, notification);
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
        console.log(error)
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occurred, please try again later.",
        });
    }
};

const fetchOrderByTxRef = async function (req, res) {
    const { user } = req;
    const { txref } = req.params;
    try {
        const orders = await fetch(Cart, { userId: user._id, paymentReference: txref });
        return successResponse(res, {
            statusCode: 200,
            message: "Orders fetched successfully!",
            payload: orders,
        });
    } catch (error) {
        console.log(error)
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occurred, please try again later.",
        });
    }
};

const fetchOrder = async function (req, res) {
    const { user } = req;
    try {
        const orders = await fetch(Order, { userId: user._id });
        return successResponse(res, {
            statusCode: 200,
            message: "Orders fetched successfully!",
            payload: orders,
        });
    } catch (error) {
        console.log(error)
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occurred, please try again later.",
        });
    }
};


const fetchPaymentByTxRef = async function (req, res) {
    const { user } = req;
    const { txref } = req.params;
    try {
        const payments = await fetch(Payment, { userId: user._id, paymentReference: txref });
        return successResponse(res, {
            statusCode: 200,
            message: "Payments fetched successfully!",
            payload: payments,
        });
    } catch (error) {
        console.log(error)
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occurred, please try again later.",
        });
    }
};

const sendEMail = async function(paymentReference, paymentStatus, user){
        const subject = `Payment on VirtuC`;
        const html = `<!DOCTYPE html>
        <html>
        <head>
          <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
          </style>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding: 20px 0; text-align: center; background-color: #333333;">
                <h2 style="color: #ffffff;">Payment on ${process.env.EMAIL_SENDER_NAME}</h2>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px; background-color: #ffffff;">
              <p>Payment on VirtuC with payment reference ${paymentReference} is ${paymentStatus}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px; text-align: center; background-color: #333333;">
                <p style="color: #ffffff; margin: 0;">© ${getYear(new Date())} ${process.env.EMAIL_SENDER_NAME}. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
        `
        const recepient = user.email;
        sendMail(subject, html, recepient);
}

export {
    verifyPayment,
    fetchOrderByTxRef,
    fetchPaymentByTxRef,
    fetchOrder 
}