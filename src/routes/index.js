import express from "express";
import userRouter from "../routes/user";
import categoryRouter from "../routes/category";
import bannerRouter from "../routes/banner";
import featuredRouter from "../routes/featured";
import productRouter from "../routes/product";

const Router = express.Router();

Router.get("/", (req, res) => {
    res.send({
        status: 200,
        message: "Welcome to Virtuc Ecommerce v1.0"
    })
})

Router.use("/users", userRouter)
Router.use("/category", categoryRouter)
Router.use("/banner", bannerRouter)
Router.use("/featured", featuredRouter)
Router.use("/product", productRouter) 

Router.use(function (req, res, next) {
    res.status(404).send({ responseCode: 404, message: 'Invalid resource URL', data: [] });
    next();
})

export default Router;