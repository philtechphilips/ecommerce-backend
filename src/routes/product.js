import express from "express";
import * as ProductController from "../controllers/ProductController";
import { auth } from "../middlewares/auth";
import { featuredValidator } from "../validators/featured-product-validator";
import { productValidator } from "../validators/product-validators";

const Router = express.Router();

Router.get("/", ProductController.fetchProducts);
Router.get("/:id", ProductController.fetchSingleProduct);
Router.post("/create-product", productValidator, ProductController.createProducts);
Router.delete("/delete-product/:id",  ProductController.deleteProduct);
Router.patch("/update-product/:id",  ProductController.updateProduct);

module.exports = Router;