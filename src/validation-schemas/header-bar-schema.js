import Joi from "joi";

const headerBarSchema = Joi.object({
    content: Joi.string().min(8),
});


export {
   headerBarSchema
}