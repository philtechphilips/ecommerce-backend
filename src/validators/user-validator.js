import { errorResponse } from "../helpers/response";
import { LoginSchema, SignupSchema, VerifyEmailSchema, userVerificationSchema } from "../validation-schemas/user-schema";

const verifyEmailValidator = async (req, res, next) => {
    try {
        await VerifyEmailSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
}

const signUpValidator = async (req, res, next) => {
    try {
        await SignupSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
}

const loginValidator = async (req, res, next) => {
    try {
        await LoginSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
}

const userVerification = async (req, res, next) => {
    try {
        await userVerificationSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
}

export {
    verifyEmailValidator,
    signUpValidator,
    loginValidator,
    userVerification
}