import Joi from "joi";

const VerifyEmailSchema = Joi.object({
    email: Joi.string().min(3).required(),
});

const LoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(200).required(),
});

const SignupSchema = Joi.object({
    email: Joi.string().min(3).required(),
    password: Joi.string().min(8).max(200).required(),
});

export {
    LoginSchema,
    SignupSchema,
    VerifyEmailSchema,
  };
  