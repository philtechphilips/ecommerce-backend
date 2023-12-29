import Joi from "joi";

const productSchema = Joi.object({
    categoryId: Joi.string().min(3).required(),
    categoryType: Joi.string().min(3).required(),
    title: Joi.string().min(3).required(),
    details: Joi.string().min(3).required(),
    price: Joi.number().min(3).required(),
    discount: Joi.number().min(3).required(), 
    instructions: Joi.string().min(3).required(),
    highlight: Joi.array(),
    size: Joi.array(),
    color: Joi.array(),
    quantity: Joi.string(),
    image: Joi.array(),
});

export {
    productSchema
}