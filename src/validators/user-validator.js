import { errorResponse } from "../helpers/response";
import { SignupSchema, VerifyEmailSchema } from "../validation-schemas/user-schema";

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

export {
    verifyEmailValidator,
    signUpValidator
}