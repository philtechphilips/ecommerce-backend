import { errorResponse, successResponse } from "../helpers/response";
import { create, isUnique } from "../helpers/schema";
import Category from "../models/category";

const createCategory = async function (req, res) {
    let {
        category
    } = req.body;
    let categories, responseData;
    try {
        categories = await isUnique(Category, { category });
        if (!categories) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Category Exists.",
            });
        }
        categories = {
            category
        };
        categories = await create(Category, categories);
        responseData = {
            payload: categories,
            statusCode: 201,
            message: "Category created sucessfully!",
        };
        return successResponse(res, responseData);
    } catch (error) {
        console.log(error);
        return errorResponse(res, {
            statusCode: 500,
            message: "An error occured, pls try again later.",
        });
    }
}

export{
    createCategory
}