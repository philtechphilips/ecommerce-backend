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
    first_name: Joi.string().min(3).required(),
    last_name: Joi.string().min(3).required(),
    password: Joi.string().min(8).max(200).required(),
    phone_number: Joi.string().min(8).max(200).required(),
    dob: Joi.string().min(8).max(200).required(),
    gender: Joi.string().min(2).required(),
});

const userVerificationSchema = Joi.object({
    token: Joi.string().min(6).required(),
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().min(3).required(),
});

const resetPasswordSchema = Joi.object({
    email: Joi.string().min(3).required(),
    password: Joi.string().min(8).max(200).required(),
});

export {
    LoginSchema,
    SignupSchema,
    VerifyEmailSchema,
    userVerificationSchema,
    forgotPasswordSchema,
    resetPasswordSchema 
  };
  