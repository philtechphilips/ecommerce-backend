import express from "express";
import * as UserController from "../controllers/UserController";
import { loginValidator, forgotPassword, signUpValidator, userVerification, verifyEmailValidator, resetPassword } from "../validators/user-validator";
import { auth } from "../middlewares/auth";

const Router = express.Router();

// User Router
Router.get("/", auth, UserController.viewProfile);
Router.get("/user-profile", auth, UserController.getAuthenticatedUser);
Router.post("/verify-email", verifyEmailValidator, UserController.verifyEmail);
Router.post("/create-account", signUpValidator, UserController.signup);
Router.post("/login", loginValidator, UserController.login);
Router.post("/verify-account", userVerification, UserController.verifyOTP);
Router.post("/resend-verification-token", verifyEmailValidator, UserController.resendVerificationToken);
Router.patch("/update-profile", auth, UserController.updateProfile);
Router.post("/forgot-password", forgotPassword, UserController.forgotPassword);
Router.post("/verify-forgot-password", userVerification, UserController.verifyResetPassword);
Router.patch("/reset-password", resetPassword, UserController.resetPassword);
Router.patch("/profile-image", auth, UserController.uploadProfileImage);

module.exports = Router;