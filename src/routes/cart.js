import express from "express";
import * as CartController from "../controllers/CartController"
import { auth } from "../middlewares/auth";
import { cartValidator } from "../validators/cart-validator";

const Router = express.Router();

// Home page cart Router
Router.get("/", auth, CartController.fetchcart);
// Router.get("/:id", cartController.fetchSinglecart);
Router.post("/create-cart", auth, cartValidator, CartController.createCart);
Router.patch("/update-cart/:id", auth, CartController.updatecart);
Router.delete("/delete-cart/:id", auth, CartController.deletecart);
Router.delete("/delete-cart", auth, CartController.deleteUsercart);

module.exports = Router;