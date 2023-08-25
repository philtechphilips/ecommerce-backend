import express from "express";
import * as UserController from "../controllers/UserController";
import { loginValidator, signUpValidator, userVerification, verifyEmailValidator } from "../validators/user-validator";
import { auth } from "../middlewares/auth";

const Router = express.Router();

// User Router
Router.get("/", auth, UserController.viewProfile);
Router.post("/verify-email", verifyEmailValidator, UserController.verifyEmail);
Router.post("/create-account", signUpValidator, UserController.signup);
Router.post("/login", loginValidator, UserController.login);
Router.post("/verify-account", userVerification, UserController.verifyOTP);
Router.post("/resend-verification-token", verifyEmailValidator, UserController.resendVerificationToken);

module.exports = Router;