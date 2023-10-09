import dotenv from "dotenv";
import { errorResponse, successResponse } from "../helpers/response";
import { create, deleteItem, fetch, fetchOne, hardDeleteItem, isUnique, update } from "../helpers/schema";
import redis from "../config/redis";
import Cart from "../models/cart";


dotenv.config();

const fetchcart = async function (req, res) {
    const { user } = req;
    let cart;
    try {
        // cart = await redis.get("cart");
        // // console.log(cart)
        // if (cart) {
        //     return successResponse(res, {
        //         statusCode: 200,
        //         message: "cart fetched sucessfully!.",
        //         payload: JSON.parse(cart),
        //     });
        // }
        cart = await fetch(Cart, {userId: user._id});
        redis.set("cart", JSON.stringify(cart), "EX", 3600);
        return successResponse(res, {
            statusCode: 200,
            message: "cart fetched sucessfully!.",
            payload: cart,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

const fetchSinglecart = async function (req, res) {
    const { id } = req.params
    let cart;
    try {
        cart = await redis.get(`singlecart-${id}`);
        if (cart) {
            return successResponse(res, {
                statusCode: 200,
                message: "cart fetched sucessfully!.",
                payload: JSON.parse(cart),
            });
        }
        cart = await fetchOne(cart, { _id: id });
        redis.set(`singlecart-${id}`, JSON.stringify(cart), "EX", 3600);
        return successResponse(res, {
            statusCode: 200,
            message: "cart fetched sucessfully!.",
            payload: cart,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

const createCart = async function (req, res) {
    let { productId, color, size, cartQuantity } = req.body;
    let cart;
    const { user } = req
    try {
        cart = await create(
            Cart,
            {
                productId, userId: user._id, color, size, cartQuantity 
            }
        );
        return successResponse(res, {
            statusCode: 201,
            message: "Cart Created sucessfully!.",
            payload: cart,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

const updatecart = async function (req, res) {
    let { id } = req.params
    const { user } = req;
    let { cartQuantity } = req.body;
    let cart
    try {
        cart = await fetchOne(Cart, { productId: id, userId: user._id })
        if (!cart) {
            return errorResponse(res, {
                statusCode: 400,
                message: "cart not found.",
            });
        }
        cart = await update(
            Cart,
            { productId: id, userId: user._id }, { cartQuantity }
        );
        return successResponse(res, {
            statusCode: 200,
            message: "cart updated sucessfully!.",
            payload: cart,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

const deletecart = async function (req, res) {
    let { id } = req.params
    const { user } = req;
    let cart
    try {
        cart = await fetchOne(Cart, { productId: id, userId: user._id  })
        if (!cart) {
            return errorResponse(res, {
                statusCode: 400,
                message: "cart not found.",
            });
        }
        cart = await deleteItem(
            Cart,
            {
                productId: id, userId: user._id 
            }
        );
        return successResponse(res, {
            statusCode: 200,
            message: "cart deleted sucessfully!.",
            payload: cart,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

const deleteUsercart = async function (req, res) {
    const { user } = req;
    let cart
    try {
        cart = await hardDeleteItem(
            Cart,
            {
                userId: user._id 
            }
        );
        return successResponse(res, {
            statusCode: 200,
            message: "cart deleted sucessfully!.",
            payload: cart,
        });
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

export {
    createCart,
    fetchcart,
    fetchSinglecart,
    updatecart,
    deletecart,
    deleteUsercart
}