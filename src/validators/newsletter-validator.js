import { errorResponse } from "../helpers/response";
import { Newsletter } from "../validation-schemas/notification-schema";


const newsletterValidator = async (req, res, next) => {
    try {
        await Newsletter.validateAsync(req.body);
        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
}


export {
    newsletterValidator,
}