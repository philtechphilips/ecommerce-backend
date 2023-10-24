import { errorResponse } from "../helpers/response";
import { headerBarSchema } from "../validation-schemas/header-bar-schema";

const headerBarValidator = async (req, res, next) => {
    try {
        await headerBarSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
}



export {
    headerBarValidator
}