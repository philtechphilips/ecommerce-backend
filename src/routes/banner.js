import express from "express";
import * as BannerController from "../controllers/BannerController"
import { auth } from "../middlewares/auth";
import { bannerValidator } from "../validators/banner-validator";

const Router = express.Router();

// Home page Banner Router
// Router.get("/",);
Router.post("/create-banner", bannerValidator, BannerController.createBanner);

module.exports = Router;