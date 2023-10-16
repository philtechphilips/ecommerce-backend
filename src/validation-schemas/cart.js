import Joi from "joi";

const cartSchema = Joi.object({
    productId: Joi.string().min(2).required(),
    color: Joi.string(),
    cartQuantity: Joi.number().required(),
    size: Joi.string(),
});


export {
   cartSchema
}