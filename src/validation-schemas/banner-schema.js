import Joi from "joi";

const bannerSchema = Joi.object({
    title: Joi.string().min(2),
    categoryId: Joi.string().min(2).required(),
    body: Joi.string().min(2),
    buttonText: Joi.string().min(2),
    buttonUrl: Joi.string().min(2),
    image: Joi.required(),
});


export {
   bannerSchema
}