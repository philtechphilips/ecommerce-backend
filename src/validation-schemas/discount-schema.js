import Joi from "joi";

const discountSchema = Joi.object({
    code: Joi.string().min(2).required(),
    discountPercentage: Joi.number().required(),
    expiryDate: Joi.date().required(),
});


export {
   discountSchema
}