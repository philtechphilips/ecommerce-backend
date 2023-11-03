import express from "express";
import * as BannerController from "../controllers/BannerController"
import { auth } from "../middlewares/auth";
import { bannerValidator } from "../validators/banner-validator";

const Router = express.Router();

// Home page Banner Router
Router.get("/", BannerController.fetchBanner);
Router.get("/:id", BannerController.fetchSingleBanner);
Router.post("/create-banner",  BannerController.createBanner);
Router.patch("/update-banner/:id", BannerController.updateBanner);
Router.delete("/delete-banner/:id", BannerController.deleteBanner);

module.exports = Router;