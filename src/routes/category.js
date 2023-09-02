import express from "express";
import * as CategoryController from "../controllers/CategoryController"
import { categoryTypeValidator, categoryValidator } from "../validators/category-validator";
import { auth } from "../middlewares/auth";

const Router = express.Router();

// Category Router
// Router.get("/", auth, UserController.viewProfile);
Router.post("/create-category", categoryValidator, CategoryController.createCategory);
Router.patch("/create-category-type", categoryTypeValidator, CategoryController.createCategoryType);

module.exports = Router;