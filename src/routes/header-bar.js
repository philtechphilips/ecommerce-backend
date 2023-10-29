import express from "express";
import * as HeaderBarController from "../controllers/HeaderBarController"
import { auth, adminAuth } from "../middlewares/auth";
import { headerBarValidator } from "../validators/header-bar-validators";

const Router = express.Router();

// Home page HeaderBar Router
Router.get("/", HeaderBarController.fetchHeaderBar);
Router.post("/create", [adminAuth], headerBarValidator, HeaderBarController.createHeaderBar);
Router.patch("/update/:id", HeaderBarController.updateHeaderBar);
Router.delete("/delete/:id", HeaderBarController.deleteHeaderBar);

module.exports = Router;