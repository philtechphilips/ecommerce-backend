import { errorResponse } from "../helpers/response";
import { cartSchema } from "../validation-schemas/cart";

const cartValidator = async (req, res, next) => {
    try {
        await cartSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
}



export {
    cartValidator
}