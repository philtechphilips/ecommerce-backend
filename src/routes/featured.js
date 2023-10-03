import express from "express";
import * as FeaturedProductController from "../controllers/FeaturedProductController";
import { auth } from "../middlewares/auth";
import { featuredValidator } from "../validators/featured-product-validator";

const Router = express.Router();

Router.get("/", FeaturedProductController.fetchFeaturedProducts);
// Router.get("/user-profile", auth, UserController.getAuthenticatedUser);
Router.post("/create-featured-product", featuredValidator, FeaturedProductController.createFeaturedProduct);
module.exports = Router;