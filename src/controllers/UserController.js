import dotenv from "dotenv";
import safeCompare from "safe-compare";
import User from "../models/user";
import { errorResponse, successResponse } from "../helpers/response";
import { create, fetchOne, isUnique } from "../helpers/schema";
import { hashPassword } from "../utils/base";

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