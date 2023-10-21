import express from "express";
import * as NotificationController from "../controllers/NotificationController"
import { auth } from "../middlewares/auth";

const Router = express.Router();

// Notification cart Router
Router.get("/", auth, NotificationController.fetchNotification);


module.exports = Router;