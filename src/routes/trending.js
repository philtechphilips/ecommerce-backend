import express from "express";
import * as TrendingController from "../controllers/TrendingProduct";
import { auth } from "../middlewares/auth";
import { trendingValidator } from "../validators/trending-validator";

const Router = express.Router();

// Router.get("/", auth, UserController.viewProfile);
// Router.get("/user-profile", auth, UserController.getAuthenticatedUser);
Router.post("/create-trending", trendingValidator, TrendingController.createTrending);
module.exports = Router;