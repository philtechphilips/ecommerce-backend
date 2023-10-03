import Joi from "joi";

const categorySchema = Joi.object({
    category: Joi.string().min(2).required(),
});

const categoryTypeSchema = Joi.object({
    categoryId: Joi.string().min(8).required(),
    categoryType: Joi.string().min(2).required(),
});

export {
    categorySchema,
    categoryTypeSchema,
}