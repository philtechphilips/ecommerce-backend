import express from "express";
import * as FeaturedProductController from "../controllers/FeaturedProductController";
import { auth } from "../middlewares/auth";
import { featuredValidator } from "../validators/featured-product-validator";

const Router = express.Router();

// Router.get("/", auth, UserController.viewProfile);
// Router.get("/user-profile", auth, UserController.getAuthenticatedUser);
Router.post("/create-trending", featuredValidator, FeaturedProductController.createTrending);
module.exports = Router;