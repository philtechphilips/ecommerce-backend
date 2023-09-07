import { errorResponse, successResponse } from "../helpers/response";
import { create, deleteItem, fetch, fetchOne, isUnique, update } from "../helpers/schema";
import Category from "../models/category";
import SubCategory from "../models/subCategory";
import redis from "../config/redis";

const fetchCategory = async function (req, res) {
    let categories, responseData;
    try {
        categories = await fetch(Category);
        responseData = {
            payload: categories,
            statusCode: 200,
            message: "Categories fetched sucessfully!",
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

        if (doesCategoryTypeExist.length > 0) {
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

const deleteCategoryType = async function (req, res) {
    let { categoryId: _id } = req.params;
    let { typeId } = req.body;
    let categories, categoryTypes, responseData;
    try {
        categories = await fetchOne(Category, { _id });
        if (!categories) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Category not found.",
            });
        }

        categoryTypes = categories.categoryTypes.filter((item) => {
            return item._id != typeId;
        });

        // console.log(categoryTypes)

        categories = await update(
            Category, { _id }, { categoryTypes }
        );

        responseData = {
            payload: categories,
            statusCode: 200,
            message: "Category type deleted sucessfully!",
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

const createSubCategory = async function (req, res) {
    let {
        categoryId,
        categoryType,
        subCategory
    } = req.body;

    let subCategories, subcategoryItem, responseData;
    try {
        subCategories = await isUnique(SubCategory, { categoryId });
        if (!subCategories) {
            subCategories = {
                categoryId,
                categoryType
            };

            subCategories = await fetchOne(SubCategory, { categoryId });

            const subcategoryItem = subCategories.subCategories.filter((item) => {
                return item.subCategory === subCategory;
            });

            if (subcategoryItem.length > 0) {
                return errorResponse(res, {
                    statusCode: 400,
                    message: "sub category exist.",
                });
            }

            subCategories = subCategories.subCategories.concat({ subCategory })
            // return console.log(subCategories)
            subCategories = await update(
                SubCategory, { categoryId }, { subCategories }
            );

            responseData = {
                payload: subCategories,
                statusCode: 201,
                message: "Sub Category created sucessfully!",
            };
            return successResponse(res, responseData);
        }
        subCategories = {
            categoryId,
            categoryType
        };
        subCategories = await create(SubCategory, subCategories);

        subCategories = await fetchOne(SubCategory, { categoryId });

        const subcategoryItem = subCategories.subCategories.filter((item) => {
            return item.subCategory === subCategory;
        });

        if (subcategoryItem.length > 0) {
            return errorResponse(res, {
                statusCode: 400,
                message: "sub category exist.",
            });
        }

        subCategories = subCategories.subCategories.concat({ subCategory })
        // return console.log(subCategories)
        subCategories = await update(
            SubCategory, { categoryId }, { subCategories }
        );

        responseData = {
            payload: subCategories,
            statusCode: 201,
            message: "Sub Category created sucessfully!",
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

const fetchSubCategory = async function (req, res) {
    let subCategories, responseData;
    try {
        subCategories = await redis.get("subCategories");
        if(subCategories){
            responseData = {
                payload: JSON.parse(subCategories),
                statusCode: 200,
                message: "Sub Categories fetched sucessfully!",
            };
            return successResponse(res, responseData);
        }
        subCategories = await fetch(SubCategory);
        redis.set("subCategories", JSON.stringify(subCategories), "EX", 3600);
        responseData = {
            payload: subCategories,
            statusCode: 200,
            message: "Sub Categories fetched sucessfully!",
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


export {
    createCategory,
    createCategoryType,
    deleteCategory,
    deleteCategoryType,
    fetchCategory,
    createSubCategory,
    fetchSubCategory
}