import dotenv from "dotenv";
import {v2 as cloudinary} from 'cloudinary';

dotenv.config()

export default {
    baseUrl: process.env.BASE_URL || 'http://localhost',
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development',
    dbUri: process.env.DB_URI || 'mongodb+srv://localhost:27017/e-commerce',


    jwtSecret: process.env.JWT_SECRET || 'virtuc-secret',
    development: process.env.NODE_ENV === 'development',
    production: process.env.NODE_ENV === 'production'
}