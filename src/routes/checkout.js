import express from "express";
import * as CheckoutController from "../controllers/CheckoutController"
import { auth } from "../middlewares/auth";
import { cartValidator } from "../validators/cart-validator";

const Router = express.Router();

Router.get("/verify-payment/:reference", auth, CheckoutController.verifyPayment);
Router.get("/payment/:txref", auth, CheckoutController.fetchPaymentByTxRef);
Router.get("/order/:txref", auth, CheckoutController.fetchOrderByTxRef);
Router.get("/order", auth, CheckoutController.fetchOrder);

module.exports = Router;