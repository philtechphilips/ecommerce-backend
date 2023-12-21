const { errorResponse } = require("../helpers/response");
const { takeOrderSchema } = require("../validation-schemas/orders-schema");

const takeOrderValidator = async (req, res, next) => {
    try {
        await takeOrderSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        return errorResponse(res, { statusCode: 422, message: error.message });
    }
}

export {
    takeOrderValidator
 }