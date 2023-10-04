const { errorResponse } = require("../helpers/response");
const { productSchema } = require("../validation-schemas/product-schema");

const productValidator = async (req, res, next) => {
    try {
        await productSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
}

export {
    productValidator
 }