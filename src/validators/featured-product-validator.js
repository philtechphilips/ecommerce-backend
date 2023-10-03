const { errorResponse } = require("../helpers/response");
const { featuredProductSchema } = require("../validation-schemas/featured-product-schema");

const featuredValidator = async (req, res, next) => {
    try {
        await featuredProductSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
}

export {
    featuredValidator
 }