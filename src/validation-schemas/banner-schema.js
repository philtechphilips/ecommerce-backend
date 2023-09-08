import Joi from "joi";

const bannerSchema = Joi.object({
    title: Joi.string().min(2).required(),
    body: Joi.string().min(2).required(),
    buttonText: Joi.string().min(2).required(),
    buttonUrl: Joi.string().min(2).required(),
});


export {
   bannerSchema
}