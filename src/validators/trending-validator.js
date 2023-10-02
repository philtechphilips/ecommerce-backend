const { errorResponse } = require("../helpers/response");
const { trendingSchema } = require("../validation-schemas/trending-schema");

const trendingValidator = async (req, res, next) => {
    try {
        await trendingSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
}

export {
    trendingValidator
 }