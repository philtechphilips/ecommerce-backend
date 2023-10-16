import express from "express";
import * as NewsletterController from "../controllers/NewsletterController"
import { auth } from "../middlewares/auth";
import { newsletterValidator } from "../validators/newsletter-validator";

const Router = express.Router();

// Notification cart Router
Router.post("/", auth, newsletterValidator, NewsletterController.create);


module.exports = Router;