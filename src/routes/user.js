import express from "express";
import * as UserController from "../controllers/UserController";
import { verifyEmailValidator } from "../validators/user-validator";

const Router = express.Router();

// User Router
Router.get("/", (req, res) => {
    res.send({
        status: 200,
        message: "Welcome to Virtuc Ecommerce v1.0"
    })
})
Router.post("/verify-email", verifyEmailValidator, UserController.verifyEmail);




module.exports = Router;