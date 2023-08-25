import jwt from "jsonwebtoken";
import sanitize from "mongo-sanitize";
import dotenv from "dotenv";
import { errorResponse } from "../helpers/response";
import User from "../models/user";
import { fetchOne, fetch } from "../helpers/schema";

dotenv.config();

export const auth = async function (req, res, next) {
  let token;
  try {
    token = sanitize(req.header("Authorization"));
    token = token.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Promise.all([
      fetchOne(User, { _id: decoded._id, "tokens.token": token }),
    ]);
    if (!user) {
      throw new Error("User not found");
    }
    req.token = token;
    req.user = user;
    next()
  } catch (error) {
    return errorResponse(res, {
      statusCode: 401,
      payload: null,
      message: "Authentication required",
      status: "failure",
    });
  }
};
