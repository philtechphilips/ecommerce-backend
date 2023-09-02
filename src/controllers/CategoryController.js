import { errorResponse, successResponse } from "../helpers/response";
import { create, deleteItem, fetchOne, isUnique, update } from "../helpers/schema";
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

const createCategoryType = async function (req, res) {
    let {
        categoryId,
        categoryType
    } = req.body;
    let categories, categoryTypes, responseData;
    try {
        categories = await fetchOne(Category, { _id: categoryId });
        if (!categories) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Category not found.",
            });
        }

        const doesCategoryTypeExist = categories.categoryTypes.filter((item) => {
            return item.type === categoryType;
        });
        
        if(doesCategoryTypeExist.length > 0){
            return errorResponse(res, {
                statusCode: 400,
                message: "Category type exist.",
            });
        }
        
        categoryTypes = categories.categoryTypes.concat({ type: categoryType })
        // console.log(categoryTypes)
        categories = await update(
            Category, { _id: categoryId }, { categoryTypes }
        );
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

const deleteCategory = async function (req, res) {
    let { categoryId: _id } = req.params;
    let categories, responseData;
    try {
        categories = await fetchOne(Category, { _id });
        if (!categories) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Category not found.",
            });
        }

        categories = await deleteItem(Category, { _id });
        responseData = {
            payload: categories,
            statusCode: 200,
            message: "Category deleted sucessfully!",
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
    createCategory,
    createCategoryType,
    deleteCategory
}