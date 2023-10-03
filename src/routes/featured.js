import express from "express";
import * as FeaturedProductController from "../controllers/FeaturedProductController";
import { auth } from "../middlewares/auth";
import { featuredValidator } from "../validators/featured-product-validator";

const Router = express.Router();

Router.get("/", FeaturedProductController.fetchFeaturedProducts);
Router.get("/:id", FeaturedProductController.fetchSingleFeaturedProducts);
Router.post("/create-featured-product", featuredValidator, FeaturedProductController.createFeaturedProduct);
Router.delete("/delete-featured-product/:id",  FeaturedProductController.deleteFeaturedProduct);
Router.patch("/update-featured-product/:id",  FeaturedProductController.updateFeaturedProduct);

module.exports = Router;