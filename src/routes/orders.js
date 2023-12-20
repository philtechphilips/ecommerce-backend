import express from "express";
import * as OrderController from "../controllers/OrderController"
import { auth } from "../middlewares/auth";
import { cartValidator } from "../validators/cart-validator";

const Router = express.Router();

Router.get("/", auth, OrderController.fetchOrders);

module.exports = Router;