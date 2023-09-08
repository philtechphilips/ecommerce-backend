import { errorResponse } from "../helpers/response";
import { bannerSchema } from "../validation-schemas/banner-schema";

const bannerValidator = async (req, res, next) => {
    try {
        await bannerSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
}



export {
    bannerValidator
}