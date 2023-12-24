import express from "express";
import * as DashboardController from "../controllers/Dashboard"
import { adminAuth } from "../middlewares/auth";

const Router = express.Router();


Router.get("/", adminAuth, DashboardController.fetchDashboardData);

module.exports = Router;