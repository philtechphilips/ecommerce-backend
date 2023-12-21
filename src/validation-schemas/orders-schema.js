import Joi from "joi";

const takeOrderSchema = Joi.object({
    orderStatus: Joi.string().min(3).required(),
});

export {
    takeOrderSchema
}