import express from "express";
import * as ProductController from "../controllers/ProductController";
import { auth } from "../middlewares/auth";
import { productValidator } from "../validators/product-validators";

const Router = express.Router();

Router.get("/", ProductController.fetchProducts);
Router.get("/:id", ProductController.fetchSingleProduct);
Router.get("/fetch-product/:slug", ProductController.fetchSingleProductBySlug);
Router.get("/trending/fetch-trending-product/:category", ProductController.fetchTrendingProducts);
Router.get("/search/:query", ProductController.searchProduct);
Router.get("/shop/:category/:categoryType", ProductController.fetchShopProducts);
Router.post("/create-product", productValidator, ProductController.createProducts);
Router.delete("/delete-product/:id",  ProductController.deleteProduct);
Router.patch("/update-product/:id",  ProductController.updateProduct);

module.exports = Router;