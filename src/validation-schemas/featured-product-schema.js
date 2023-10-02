import Joi from "joi";

const featuredProductSchema = Joi.object({
    category: Joi.string().min(3).required(),
    imageUrl: Joi.string().min(3).required(),
    buttonText: Joi.string().min(3).required(),
    buttonUrl: Joi.string().min(3).required(),
});

export {
    featuredProductSchema
 }