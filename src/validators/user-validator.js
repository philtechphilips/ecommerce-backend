import { errorResponse } from "../helpers/response";
import { VerifyEmailSchema } from "../validation-schemas/user-schema";

const verifyEmailValidator = async () => {
    try {
        await VerifyEmailSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
}

export {
    verifyEmailValidator
}