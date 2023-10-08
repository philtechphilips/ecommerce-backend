import Joi from "joi";

const cartSchema = Joi.object({
    prodictId: Joi.string().min(2),
    userId: Joi.string().min(2).required(),
    color: Joi.string().min(2),
    cartQuantity: Joi.string(),
    size: Joi.string().min(2),
});


export {
   cartSchema
}