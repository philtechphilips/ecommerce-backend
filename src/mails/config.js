import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const emailConfig = {
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
}

export { emailConfig }