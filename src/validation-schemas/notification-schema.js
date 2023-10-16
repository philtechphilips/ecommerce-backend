import Joi from "joi";

const Newsletter = Joi.object({
    email: Joi.string().min(3).required(),
});


export {
    Newsletter,
  };
  