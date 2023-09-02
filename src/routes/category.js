import express from "express";
import * as CategoryController from "../controllers/CategoryController"
import { categoryValidator } from "../validators/category-validator";
import { auth } from "../middlewares/auth";

const Router = express.Router();

// Category Router
// Router.get("/", auth, UserController.viewProfile);
Router.post("/create-category", categoryValidator, CategoryController.createCategory);

module.exports = Router;