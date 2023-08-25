import dotenv from "dotenv";
import safeCompare from "safe-compare";
import User from "../models/user";
import { errorResponse, successResponse } from "../helpers/response";
import { create, fetchOne, isUnique } from "../helpers/schema";
import { hashPassword } from "../utils/base";
import { sendMail } from "../utils/email";
import { getYear } from "date-fns";

dotenv.config();

const verifyEmail = async function (req, res) {
    let {
        email
    } = req.body;

    try {
        const user = await fetchOne(User, { email });
        if(user){
            return successResponse(res, {
                statusCode: 200,
                message: "User exist!.",
                payload: user,
            });
        }else{
            return errorResponse(res, {
                statusCode: 404,
                message: "User not found!.",
                payload: user,
            });
        }
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

const signup = async function (req, res) {
    let {
        first_name,
        last_name,
        phone_number,
        gender,
        dob,
        email,
        password
    } = req.body;
    let user, responseData, token;
    try {
        user = await isUnique(User, { email });
        if (!user) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Email taken by another user.",
            });
        }
        password = await hashPassword(password);
        user = {
            first_name,
            last_name,
            phone_number,
            gender,
            dob,
            email,
            password
        };
        user = await create(User, user);
        token = await user.generateAuthToken();
        if(user){
            const subject = `Welcome, Onboard to ${process.env.EMAIL_SENDER_NAME}`;
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
                    <h2 style="color: #ffffff;">Welcome, Onboard to ${process.env.EMAIL_SENDER_NAME}</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; background-color: #ffffff;">
                  <p>Hi ${user.first_name},</p>
                  <p>Welcome to Viruc Ecommerce, your one-stop destination for all things stylish, innovative, and essential. We're thrilled to have you join our family of savvy shoppers! 🛍️
                  At Viruc, we believe in providing you with top-notch products that enhance your lifestyle. From fashion and electronics to home essentials, our diverse range has something special for everyone.</p>
                  <p>Kindly use the verification code below to finalize your account registration.</p>
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
        responseData = {
            payload: user,
            token,
            statusCode: 201,
            message: "A verification link has been sent to your email.",
        };
        return successResponse(res, responseData);
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
};

export {
    verifyEmail,
    signup
}