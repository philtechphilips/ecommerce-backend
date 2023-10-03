import Joi from "joi";

const featuredProductSchema = Joi.object({
    categoryId: Joi.string().min(3).required(),
    image: Joi.object({
        filename: Joi.string().required(),
        size: Joi.number().integer().min(1).required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'application/pdf').required(),
    }),
    buttonText: Joi.string().min(3).required(),
    buttonUrl: Joi.string().min(3).required(),
});

export {
    featuredProductSchema
}