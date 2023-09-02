import { errorResponse } from "../helpers/response";
import { categorySchema, categoryTypeSchema } from "../validation-schemas/category-schema";

const categoryValidator = async (req, res, next) => {
    try {
        await categorySchema.validateAsync(req.body);
        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
}

const categoryTypeValidator = async (req, res, next) => {
    try {
        await categoryTypeSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
}

export {
    categoryValidator,
    categoryTypeValidator
}