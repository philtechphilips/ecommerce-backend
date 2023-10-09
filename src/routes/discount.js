import express from "express";
import * as DiscountController from "../controllers/DiscountController"
import { auth } from "../middlewares/auth";
import { discountValidator } from "../validators/discount-validator";

const Router = express.Router();

// Home page discount Router
Router.get("/",  DiscountController.fetchDiscount);
// Router.get("/:id", discountController.fetchSinglediscount);
Router.post("/create-discount", auth, discountValidator, DiscountController.createDiscount);
// Router.patch("/update-discount/:id", auth, discountController.updatediscount);
// Router.delete("/delete-discount/:id", auth, discountController.deletediscount);
// Router.delete("/delete-discount", auth, discountController.deleteUserdiscount);

module.exports = Router;