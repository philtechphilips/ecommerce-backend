import { errorResponse } from "../helpers/response";
import { wishListSchema } from "../validation-schemas/wishlist";

const wishlistValidator = async (req, res, next) => {
    try {
        await wishListSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
}



export {
    wishlistValidator
}