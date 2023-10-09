import { errorResponse } from "../helpers/response";
import { discountSchema } from "../validation-schemas/discount-schema";

const discountValidator = async (req, res, next) => {
    try {
        await discountSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
}



export {
    discountValidator
}