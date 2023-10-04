import Joi from "joi";

const productSchema = Joi.object({
    categoryId: Joi.string().min(3).required(),
    categoryType: Joi.string().min(3).required(),
    title: Joi.string().min(3).required(),
    details: Joi.string().min(3).required(),
    price: Joi.number().min(3).required(),
    discount: Joi.number().min(3).required(), 
    instructions: Joi.string().min(3).required(),
    images: Joi.array().items(Joi.object({
        filename: Joi.string().required(),
        size: Joi.number().integer().min(1).required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'application/pdf').required(),
    })),
});

export {
    productSchema
}