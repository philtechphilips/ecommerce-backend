import Joi from "joi";

const categorySchema = Joi.object({
    category: Joi.string().min(2).required(),
});

export {
    categorySchema
}