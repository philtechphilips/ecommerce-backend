import express from "express";
import * as OrderController from "../controllers/OrderController"
import { auth } from "../middlewares/auth";
import { cartValidator } from "../validators/cart-validator";
import { takeOrderValidator } from "../validators/orders-validator";

const Router = express.Router();

Router.get("/", auth, OrderController.fetchOrders);
Router.patch("/:orderId", auth, takeOrderValidator, OrderController.takeOrders);

module.exports = Router;