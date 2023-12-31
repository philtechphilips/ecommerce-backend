import express from "express";
import * as CategoryController from "../controllers/CategoryController"
import { categoryTypeValidator, categoryValidator, subCategoryTypeValidator } from "../validators/category-validator";
import { auth } from "../middlewares/auth";

const Router = express.Router();

// Category Router
Router.get("/", CategoryController.fetchCategory);
Router.post("/create-category", categoryValidator, CategoryController.createCategory);
Router.patch("/:id", categoryValidator, CategoryController.updateCategory);
Router.patch("/category-type/create", CategoryController.createCategoryType);
Router.delete("/delete-category/:categoryId", CategoryController.deleteCategory);
Router.patch("/delete-category-type/:categoryId", CategoryController.deleteCategoryType);
Router.post("/create-category", categoryValidator, CategoryController.createCategory);

module.exports = Router;