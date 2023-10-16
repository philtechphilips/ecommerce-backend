import express from "express";
import * as CheckoutController from "../controllers/CheckoutController"
import { auth } from "../middlewares/auth";
import { cartValidator } from "../validators/cart-validator";

const Router = express.Router();

Router.get("/verify-payment/:reference", auth, CheckoutController.verifyPayment);

module.exports = Router;