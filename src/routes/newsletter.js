import express from "express";
import * as NewsletterController from "../controllers/NewsletterController"
import { auth } from "../middlewares/auth";
import { newsletterValidator } from "../validators/newsletter-validator";

const Router = express.Router();

// Notification cart Router
Router.post("/", newsletterValidator, NewsletterController.subscribe);


module.exports = Router;